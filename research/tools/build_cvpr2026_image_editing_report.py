from __future__ import annotations

import argparse
import csv
import html
import json
import re
import time
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass
from pathlib import Path

import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import pandas as pd
import seaborn as sns
from bs4 import BeautifulSoup
from matplotlib.patches import Patch


BASE_URL = "https://openaccess.thecvf.com"
DAY_URLS = {
    "2026-06-05": f"{BASE_URL}/CVPR2026?day=2026-06-05",
    "2026-06-06": f"{BASE_URL}/CVPR2026?day=2026-06-06",
    "2026-06-07": f"{BASE_URL}/CVPR2026?day=2026-06-07",
}

ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = ROOT / "reports"
DOWNLOADS_DIR = ROOT / "downloads"
CHARTS_DIR = REPORTS_DIR / "charts"
CACHE_DIR = ROOT / ".cache" / "cvpr2026_image_editing"

REPORT_HTML = "cvpr2026_image_editing_report.html"
PAPERS_CSV = "cvpr2026_image_editing_papers.csv"
CANDIDATES_CSV = "cvpr2026_image_editing_candidates.csv"
SUMMARY_JSON = "cvpr2026_image_editing_summary.json"

FONT_FAMILY = ["Microsoft YaHei", "Segoe UI", "Arial", "DejaVu Sans", "sans-serif"]
MONO_FONT_FAMILY = ["Consolas", "SF Mono", "Menlo", "DejaVu Sans Mono", "monospace"]

TOKENS = {
    "surface": "#FCFCFD",
    "panel": "#FFFFFF",
    "ink": "#1F2430",
    "muted": "#6F768A",
    "grid": "#E6E8F0",
    "axis": "#D7DBE7",
}

COLOR_FAMILIES = {
    "blue": {"xlight": "#EAF1FE", "light": "#CEDFFE", "base": "#A3BEFA", "mid": "#5477C4", "dark": "#2E4780"},
    "gold": {"xlight": "#FFF4C2", "light": "#FFEA8F", "base": "#FFE15B", "mid": "#B8A037", "dark": "#736422"},
    "orange": {"xlight": "#FFEDDE", "light": "#FFBDA1", "base": "#F0986E", "mid": "#CC6F47", "dark": "#804126"},
    "olive": {"xlight": "#D8ECBD", "light": "#BEEB96", "base": "#A3D576", "mid": "#71B436", "dark": "#386411"},
    "pink": {"xlight": "#FCDAD6", "light": "#F5BACC", "base": "#F390CA", "mid": "#BD569B", "dark": "#8A3A6F"},
}

DIRECT_TASK_PATTERNS = [
    r"\bimage editing\b",
    r"\bimage edit\b",
    r"\btext-to-image editing\b",
    r"\binstruction[- ]guided image editing\b",
    r"\binstruction[- ]based image (editing|retouching)\b",
    r"\bimage retouching\b",
    r"\bretouch\b",
    r"\binpainting\b",
    r"\boutpainting\b",
    r"\bimage manipulation\b",
    r"\bphoto manipulation\b",
    r"\bcompositing\b",
    r"\bcomposite\b",
    r"\bcomposited\b",
    r"\bmakeup transfer\b",
    r"\bface swapping\b",
    r"\bface swap\b",
    r"\bvirtual try-on\b",
    r"\btry-on\b",
    r"\bstyle transfer\b",
    r"\bregional style\b",
    r"\btexture generation\b",
    r"\btexture modeling\b",
    r"\bconcept erasure\b",
    r"\berasing .*concept",
    r"\bobject removal\b",
    r"\bscene editing\b",
    r"\bvideo editing\b",
    r"\bmulti-view image editing\b",
    r"\bmultiview image editing\b",
    r"\b4d scene editing\b",
    r"\b3d scene editing\b",
    r"\beditable\b",
    r"\battribute manipulation\b",
    r"\bslider\b",
    r"\bforensic-friendly image manipulation\b",
    r"\bimage anonymization\b",
    r"\banonymization\b",
    r"\bimage pose transfer\b",
    r"\bpose transfer\b",
]

CONTROL_PATTERNS = [
    r"\bregion\b",
    r"\bregional\b",
    r"\blocalized\b",
    r"\bselective\b",
    r"\bmask\b",
    r"\blayer\b",
    r"\blayer-wise\b",
    r"\bcontrol\b",
    r"\bcontrollable\b",
    r"\bprompt\b",
    r"\badapter\b",
    r"\breference-guided\b",
    r"\bidentity-preserving\b",
    r"\bidentity preserving\b",
    r"\bpersonalized\b",
    r"\bsubject-driven\b",
    r"\bappearance\b",
    r"\balignment\b",
    r"\bauthorizing\b",
]

BOUNDARY_EXCLUDE_PATTERNS = [
    r"\bclassification\b",
    r"\bsegmentation\b",
    r"\bdetection\b",
    r"\btracking\b",
    r"\bretrieval\b",
    r"\bcaptioning\b",
    r"\bquestion answering\b",
    r"\bregistration\b",
    r"\bpose estimation\b",
    r"\bdepth\b",
    r"\boptical flow\b",
    r"\bpoint cloud\b",
    r"\bslam\b",
    r"\brobot\b",
    r"\bautonomous\b",
    r"\bnavigation\b",
    r"\bmedical image segmentation\b",
    r"\bmesh recovery\b",
    r"\bhuman motion\b",
    r"\btext-to-motion\b",
    r"\bcompression\b",
    r"\bai-generated.*detection\b",
]

RESTORATION_ONLY_PATTERNS = [
    r"\bsuper-resolution\b",
    r"\bdenoising\b",
    r"\bdeblurring\b",
    r"\bderaining\b",
    r"\bdesnowing\b",
    r"\brestoration\b",
    r"\blow-light\b",
    r"\breflection removal\b",
    r"\bwhite-balance\b",
    r"\bcolor constancy\b",
]

MANUAL_INCLUDE_TITLE_FRAGMENTS = {
    "compbench: benchmarking complex instruction-guided image editing",
    "retouchiq: mllm agents for instruction-based image retouching",
    "the consistency critic: correcting inconsistencies in generated images via reference-guided attentive alignment",
    "flowdc: flow-based decoupling-decay for complex image editing",
    "delta rectified flow sampling for text-to-image editing",
    "bifm: bidirectional flow matching for few-step image editing and generation",
    "spotedit: selective region editing in diffusion transformers",
    "hieredit: region-aware hierarchical diffusion for efficient high-resolution editing",
    "visilock: authorizing instruction-based image editing with dual score distillation",
    "your latent mask is wrong: pixel-equivalent latent compositing for diffusion models",
    "dynamic-editor: training-free text-driven 4d scene editing with multimodal diffusion transformer",
    "coupled diffusion sampling for training-free multi-view image editing",
    "accelerating diffusion-based video editing via heterogeneous caching",
    "rfdm: residual flow diffusion models for video editing",
}

MANUAL_EXCLUDE_TITLE_FRAGMENTS = {
    "white-balance first, adjust later",
    "rectifying latent space for generative single-image reflection removal",
    "residual diffusion bridge model for image restoration",
    "conceptprism: concept disentanglement in personalized diffusion models via residual token optimization",
    "taming preference mode collapse via directional decoupling alignment in diffusion reinforcement learning",
    "disentangling to re-couple: resolving the similarity-controllability paradox in subject-driven text-to-image generation",
    "promptminer: black-box prompt stealing against text-to-image generative models",
    "raise: requirement-adaptive evolutionary refinement for training-free text-to-image alignment",
    "seethrough3d: occlusion aware 3d control in text-to-image generation",
    "camera control for text-to-image generation via learning viewpoint tokens",
    "premier: personalized preference modulation with learnable user embedding in text-to-image generation",
    "test-time alignment of text-to-image diffusion models via null-text embedding optimisation",
    "dcoar: deep concept injection into unified autoregressive models for personalized text-to-image generation",
    "compositional text-to-image generation via region-aware bimodal direct preference optimization",
    "pritti: primitive-based generation of controllable and editable 3d semantic urban scenes",
}


@dataclass
class Paper:
    paper_id: int
    day: str
    title: str
    authors: str
    authors_short: str
    paper_page: str
    pdf: str
    arxiv: str
    abstract: str = ""


@dataclass
class ClassifiedPaper:
    paper_id: int
    day: str
    title: str
    authors_short: str
    authors: str
    relevance: str
    include_decision: str
    editing_cluster: str
    method_family: str
    modality: str
    reading_priority: str
    best_use: str
    editing_intent: str
    evidence_basis: str
    signals: str
    exclusion_reason: str
    paper_page: str
    pdf: str
    arxiv: str
    abstract: str


def fetch_text(url: str, cache_name: str, refresh: bool = False, sleep_s: float = 0.0) -> str:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path = CACHE_DIR / cache_name
    if cache_path.exists() and not refresh:
        return cache_path.read_text(encoding="utf-8")

    if sleep_s:
        time.sleep(sleep_s)
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; CVPR2026-image-editing-research/1.0)"
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        raw = response.read()
    text = raw.decode("utf-8", errors="replace")
    cache_path.write_text(text.replace("\r\n", "\n"), encoding="utf-8")
    return text


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text or "").strip()


def authors_short(authors: list[str]) -> str:
    if not authors:
        return ""
    if len(authors) <= 3:
        return ", ".join(authors)
    return f"{authors[0]}, {authors[1]}, {authors[2]} et al."


def iter_record_links(siblings) -> tuple[str, str]:
    pdf_url = ""
    arxiv_url = ""
    for sibling in siblings:
        if not hasattr(sibling, "select"):
            continue
        for link in sibling.select("a[href]"):
            href = link.get("href", "")
            if href.endswith(".pdf") and "CVPR2026" in href and not pdf_url:
                pdf_url = urllib.parse.urljoin(BASE_URL, href)
            if "arxiv.org" in href and not arxiv_url:
                arxiv_url = href
    return pdf_url, arxiv_url


def parse_day(day: str, html_text: str, start_id: int) -> tuple[list[Paper], int]:
    soup = BeautifulSoup(html_text, "html.parser")
    papers: list[Paper] = []
    paper_id = start_id
    for dt in soup.select("dt.ptitle"):
        title_link = dt.find("a", href=True)
        if not title_link:
            continue
        title = normalize_text(title_link.get_text(" ", strip=True))
        paper_page = urllib.parse.urljoin(BASE_URL, title_link["href"])

        siblings = []
        for sibling in dt.next_siblings:
            if getattr(sibling, "name", None) == "dt" and "ptitle" in sibling.get("class", []):
                break
            siblings.append(sibling)

        author_dd = next((s for s in siblings if getattr(s, "name", None) == "dd"), None)
        author_values: list[str] = []
        if author_dd is not None:
            author_values = [
                normalize_text(item.get("value", ""))
                for item in author_dd.select('input[name="query_author"]')
                if normalize_text(item.get("value", ""))
            ]
            if not author_values:
                author_values = [
                    normalize_text(link.get_text(" ", strip=True))
                    for link in author_dd.select("a")
                    if normalize_text(link.get_text(" ", strip=True))
                ]

        pdf_url, arxiv_url = iter_record_links(siblings)
        papers.append(
            Paper(
                paper_id=paper_id,
                day=day,
                title=title,
                authors="; ".join(author_values),
                authors_short=authors_short(author_values),
                paper_page=paper_page,
                pdf=pdf_url,
                arxiv=arxiv_url,
            )
        )
        paper_id += 1
    return papers, paper_id


def parse_abstract(html_text: str) -> str:
    soup = BeautifulSoup(html_text, "html.parser")
    abstract_node = soup.find(id="abstract")
    if abstract_node:
        return normalize_text(abstract_node.get_text(" ", strip=True))
    # CVF pages sometimes use a plain div around the abstract text.
    for node in soup.select("div"):
        text = normalize_text(node.get_text(" ", strip=True))
        if text.lower().startswith("abstract"):
            return normalize_text(re.sub(r"^abstract\s*", "", text, flags=re.I))
    return ""


def regex_hits(text: str, patterns: list[str]) -> list[str]:
    hits = []
    for pattern in patterns:
        if re.search(pattern, text, flags=re.I):
            hits.append(pattern.replace(r"\b", "").replace("\\", ""))
    return hits


def is_broad_candidate(paper: Paper) -> bool:
    lower = paper.title.lower()
    if any(fragment in lower for fragment in MANUAL_INCLUDE_TITLE_FRAGMENTS):
        return True
    title_hits = regex_hits(lower, DIRECT_TASK_PATTERNS + CONTROL_PATTERNS + RESTORATION_ONLY_PATTERNS)
    return bool(title_hits)


def classify_cluster(text: str, title: str) -> str:
    lower = text.lower()
    title_lower = title.lower()
    if "benchmark" in lower and "image editing" in lower:
        return "评测、数据与可信编辑"
    if "authorizing" in lower or "forensic-friendly" in lower:
        return "评测、数据与可信编辑"
    if re.search(r"concept erasure|erasing .*concept|localized concept erasure|online concept erasure", lower):
        return "概念擦除与模型治理"
    if "authorizing" in lower or "forensic-friendly" in lower or "anonymization" in lower:
        return "评测、数据与可信编辑"
    if re.search(r"try-on|face swapping|face swap|makeup|identity-preserving|identity preserving|talking face|talking head|caricature|pose transfer|character animation", lower):
        return "身份、人像与虚拟试穿"
    if re.search(r"video editing|multi-view image editing|multiview image editing|4d scene editing|3d scene editing|scene editing|gaussian", lower) and "editing" in lower:
        return "视频、多视图与3D编辑"
    if re.search(r"style transfer|texture|appearance|color|harmoniz", lower) and not re.search(r"concept erasure", lower):
        return "风格、纹理与外观编辑"
    if re.search(r"region|regional|localized|selective|mask|layer-wise|token|prompt|adapter|control|controllable|reference-guided", lower):
        if "editing" not in title_lower and "retouch" not in title_lower and "inpainting" not in title_lower:
            return "局部控制与条件引导"
    return "直接编辑、修补与合成"


def classify_method(text: str) -> str:
    lower = text.lower()
    if "benchmark" in lower or "bench:" in lower:
        return "Benchmark / Evaluation"
    if "mllm" in lower or "agent" in lower or "large language" in lower:
        return "MLLM / Agent"
    if "diffusion transformer" in lower or re.search(r"\bdit\b", lower):
        return "Diffusion Transformer"
    if "rectified flow" in lower or "flow matching" in lower or "mean flow" in lower or "flow-based" in lower:
        return "Flow / Rectified Flow"
    if "latent diffusion" in lower:
        return "Latent Diffusion"
    if "score distillation" in lower or "sds" in lower:
        return "Score Distillation"
    if "diffusion" in lower:
        return "Diffusion Model"
    if "gaussian" in lower:
        return "Gaussian / 3D Representation"
    if "adapter" in lower:
        return "Adapter / Control"
    return "Title-level unknown / Other"


def classify_modality(text: str) -> str:
    lower = text.lower()
    if re.search(r"4d|3d scene|multi-view|multiview|gaussian|nerf", lower):
        return "3D / 多视图"
    if "video" in lower:
        return "视频"
    if re.search(r"face|makeup|try-on|talking head|talking face|caricature|portrait", lower):
        return "人像 / 人体"
    if "mllm" in lower or "instruction" in lower or "vlm" in lower:
        return "多模态指令"
    return "图像"


def best_use_for_cluster(cluster: str) -> str:
    mapping = {
        "直接编辑、修补与合成": "作为图像编辑主线方法精读，重点看编辑保真度、局部不串扰和推理步数。",
        "局部控制与条件引导": "作为区域编辑/提示控制模块阅读，重点看控制粒度与跨对象干扰。",
        "概念擦除与模型治理": "作为安全编辑、模型治理与概念删除基线，重点看泛化、绕过与遗忘副作用。",
        "身份、人像与虚拟试穿": "作为人像、身份保持、虚拟试穿方向阅读，重点看身份/属性解耦和数据协议。",
        "风格、纹理与外观编辑": "作为外观迁移、风格/纹理素材生成模块阅读，重点看语义与纹理一致性。",
        "视频、多视图与3D编辑": "作为从单图编辑扩展到视频、多视图和3D场景的一致性方向阅读。",
        "评测、数据与可信编辑": "作为评测、授权、可信编辑和产品化约束阅读，适合指导后续benchmark设计。",
    }
    return mapping.get(cluster, "作为相关背景阅读。")


def editing_intent_for_cluster(cluster: str) -> str:
    mapping = {
        "直接编辑、修补与合成": "直接改变图像局部或整体内容，包括指令编辑、修补、合成、属性操控。",
        "局部控制与条件引导": "提供区域、token、prompt、adapter 或参考图约束，减少编辑串扰。",
        "概念擦除与模型治理": "从生成模型或输出行为中删除特定概念，兼顾安全和可控性。",
        "身份、人像与虚拟试穿": "保持人物身份、服饰或面部属性，同时改变外观、姿态或穿搭。",
        "风格、纹理与外观编辑": "改变纹理、风格、颜色或外观层，常作为图像编辑工作流的素材/外观模块。",
        "视频、多视图与3D编辑": "把编辑扩展到跨帧、跨视角或三维场景，关键是时空一致性。",
        "评测、数据与可信编辑": "评估、授权或约束编辑系统，使复杂指令和可信使用可被度量。",
    }
    return mapping.get(cluster, "与图像编辑链路相关。")


def classify_paper(paper: Paper) -> ClassifiedPaper:
    combined = paper.title.lower()
    title_lower = paper.title.lower()
    direct_hits = regex_hits(combined, DIRECT_TASK_PATTERNS)
    control_hits = regex_hits(combined, CONTROL_PATTERNS)
    exclude_hits = regex_hits(combined, BOUNDARY_EXCLUDE_PATTERNS)
    restoration_hits = regex_hits(combined, RESTORATION_ONLY_PATTERNS)

    score = 0
    if direct_hits:
        score += 5
    if control_hits:
        score += 2
    if control_hits and re.search(r"text-to-image|generated images|diffusion|image|style|region|mask|layer", combined):
        score += 2
    if control_hits and "text-to-image" in combined:
        score += 2
    if "image editing" in combined:
        score += 4
    if re.search(r"image|photo|text-to-image|generated images|diffusion|visual", combined):
        score += 1
    if "editing" in combined:
        score += 2

    manual_include = any(fragment in title_lower for fragment in MANUAL_INCLUDE_TITLE_FRAGMENTS)
    manual_exclude = any(fragment in title_lower for fragment in MANUAL_EXCLUDE_TITLE_FRAGMENTS)
    restoration_only = bool(restoration_hits) and not direct_hits and "retouch" not in combined and "editing" not in combined
    domain_excluded = bool(exclude_hits) and not direct_hits and "image editing" not in combined

    include = (score >= 6 and not restoration_only and not domain_excluded) or manual_include
    if manual_exclude:
        include = False

    cluster = classify_cluster(combined, paper.title)
    method = classify_method(combined)
    modality = classify_modality(combined)

    if include:
        if "image editing" in combined or "retouch" in combined or "inpainting" in combined or "concept erasure" in combined:
            relevance = "强相关"
            priority = "Deep Read"
        elif cluster in {"身份、人像与虚拟试穿", "视频、多视图与3D编辑", "评测、数据与可信编辑"}:
            relevance = "强相关"
            priority = "Deep Read"
        elif cluster in {"局部控制与条件引导", "风格、纹理与外观编辑"}:
            relevance = "中相关"
            priority = "Skim -> Deep"
        else:
            relevance = "中相关"
            priority = "Skim -> Deep"
        exclusion_reason = ""
    else:
        relevance = "边界相关" if direct_hits or control_hits or restoration_hits else "弱相关"
        priority = "Drop"
        reasons = []
        if manual_exclude:
            reasons.append("人工排除：更接近图像恢复/颜色校正，不作为编辑论文统计")
        if restoration_only:
            reasons.append("更接近 restoration/enhancement，缺少编辑意图")
        if domain_excluded:
            reasons.append("关键词出现在分割/检测/跟踪/检索等非编辑任务中")
        if score < 6 and not reasons:
            reasons.append("编辑信号不足，保留为候选审计项")
        exclusion_reason = "；".join(reasons)

    signals = "; ".join([*direct_hits[:6], *control_hits[:5], *restoration_hits[:3], *exclude_hits[:3]])
    evidence_basis = "CVF metadata title-level triage; cached abstract available for audit" if paper.abstract else "CVF metadata title-level triage"
    return ClassifiedPaper(
        paper_id=paper.paper_id,
        day=paper.day,
        title=paper.title,
        authors_short=paper.authors_short,
        authors=paper.authors,
        relevance=relevance,
        include_decision="include" if include else "exclude",
        editing_cluster=cluster if include else "",
        method_family=method if include else "",
        modality=modality if include else "",
        reading_priority=priority,
        best_use=best_use_for_cluster(cluster) if include else "",
        editing_intent=editing_intent_for_cluster(cluster) if include else "",
        evidence_basis=evidence_basis,
        signals=signals,
        exclusion_reason=exclusion_reason,
        paper_page=paper.paper_page,
        pdf=paper.pdf,
        arxiv=paper.arxiv,
        abstract=paper.abstract,
    )


def collect_papers(refresh: bool = False) -> list[Paper]:
    papers: list[Paper] = []
    next_id = 1
    for day, url in DAY_URLS.items():
        cache_name = f"cvpr2026_{day}.html"
        html_text = fetch_text(url, cache_name, refresh=refresh)
        day_papers, next_id = parse_day(day, html_text, next_id)
        papers.extend(day_papers)
    return papers


def add_candidate_abstracts(papers: list[Paper], refresh: bool = False) -> None:
    candidates = [paper for paper in papers if is_broad_candidate(paper)]
    for index, paper in enumerate(candidates, start=1):
        slug = re.sub(r"[^A-Za-z0-9]+", "_", paper.title).strip("_")[:120]
        cache_name = f"abstract_{paper.paper_id}_{slug}.html"
        try:
            page = fetch_text(paper.paper_page, cache_name, refresh=refresh, sleep_s=0.08 if index > 1 else 0.0)
            paper.abstract = parse_abstract(page)
        except Exception as exc:  # noqa: BLE001
            paper.abstract = f"[abstract fetch failed: {exc}]"


def load_cached_candidate_abstracts(papers: list[Paper]) -> None:
    for paper in papers:
        matches = list(CACHE_DIR.glob(f"abstract_{paper.paper_id}_*.html"))
        if not matches:
            continue
        try:
            paper.abstract = parse_abstract(matches[0].read_text(encoding="utf-8"))
        except Exception:  # noqa: BLE001
            paper.abstract = ""


def write_csv(path: Path, records: list[dict]) -> None:
    if not records:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(records[0].keys()))
        writer.writeheader()
        writer.writerows(records)


def use_chart_theme() -> None:
    sns.set_theme(
        style="whitegrid",
        rc={
            "figure.facecolor": TOKENS["surface"],
            "figure.edgecolor": "none",
            "savefig.facecolor": TOKENS["surface"],
            "savefig.edgecolor": "none",
            "axes.facecolor": TOKENS["panel"],
            "axes.edgecolor": TOKENS["axis"],
            "axes.labelcolor": TOKENS["ink"],
            "axes.grid": True,
            "axes.spines.top": False,
            "axes.spines.right": False,
            "grid.color": TOKENS["grid"],
            "grid.linewidth": 0.8,
            "font.family": "sans-serif",
            "font.sans-serif": FONT_FAMILY,
            "font.monospace": MONO_FONT_FAMILY,
            "patch.linewidth": 1.0,
        },
    )


def add_chart_header(fig, ax, title: str, subtitle: str, *, title_width: int = 62, subtitle_width: int = 92) -> None:
    import textwrap

    title = textwrap.fill(title, width=title_width, break_long_words=False)
    subtitle = textwrap.fill(subtitle, width=subtitle_width, break_long_words=False)
    title_lines = title.count("\n") + 1
    subtitle_lines = subtitle.count("\n") + 1
    ax.set_title("")
    fig.subplots_adjust(top=max(0.58, 0.86 - 0.045 * (title_lines - 1) - 0.032 * (subtitle_lines - 1)))
    left = ax.get_position().x0
    fig.text(left, 0.985, title, ha="left", va="top", fontsize=15, fontweight="semibold", color=TOKENS["ink"], linespacing=1.08)
    fig.text(left, 0.925 - 0.045 * (title_lines - 1), subtitle, ha="left", va="top", fontsize=10, color=TOKENS["muted"], linespacing=1.18)
    sns.despine(ax=ax)


def save_ranked_bar(df: pd.DataFrame, category_col: str, value_col: str, path: Path, title: str, subtitle: str, family_name: str = "blue") -> None:
    family = COLOR_FAMILIES[family_name]
    plot_df = df.sort_values(value_col, ascending=True)
    height = max(4.8, 0.42 * len(plot_df) + 2.0)
    fig, ax = plt.subplots(figsize=(10.5, height))
    bars = ax.barh(plot_df[category_col], plot_df[value_col], color=family["base"], edgecolor=family["dark"], linewidth=1.0)
    ax.set_xlabel("论文数", fontsize=10)
    ax.set_ylabel("")
    ax.xaxis.set_major_locator(mticker.MaxNLocator(integer=True))
    ax.tick_params(axis="x", labelsize=9, colors=TOKENS["muted"])
    ax.tick_params(axis="y", labelsize=9, colors=TOKENS["ink"])
    max_value = max(plot_df[value_col].max(), 1)
    ax.set_xlim(0, max_value * 1.18)
    for bar, value in zip(bars, plot_df[value_col]):
        ax.text(value + max_value * 0.025, bar.get_y() + bar.get_height() / 2, f"{int(value)}", va="center", ha="left", fontsize=9, color=TOKENS["ink"])
    add_chart_header(fig, ax, title, subtitle)
    fig.savefig(path, dpi=180, bbox_inches="tight")
    plt.close(fig)


def save_stacked_cluster_method(df: pd.DataFrame, path: Path) -> None:
    family_names = ["blue", "orange", "olive", "gold", "pink"]
    method_order = list(df["method_family"].value_counts().index)
    cluster_order = list(df["editing_cluster"].value_counts().index)
    pivot = pd.crosstab(df["editing_cluster"], df["method_family"]).reindex(index=cluster_order, columns=method_order, fill_value=0)
    fig, ax = plt.subplots(figsize=(11, max(5.0, 0.46 * len(pivot) + 2.0)))
    left = [0] * len(pivot)
    for i, method in enumerate(method_order):
        family = COLOR_FAMILIES[family_names[i % len(family_names)]]
        values = pivot[method].to_numpy()
        bars = ax.barh(pivot.index, values, left=left, label=method, color=family["base"], edgecolor=family["dark"], linewidth=1.0)
        for bar, value in zip(bars, values):
            if value >= 3:
                ax.text(bar.get_x() + bar.get_width() / 2, bar.get_y() + bar.get_height() / 2, str(int(value)), ha="center", va="center", fontsize=8, color=TOKENS["ink"])
        left = [l + v for l, v in zip(left, values)]
    ax.set_xlabel("")
    ax.set_ylabel("")
    ax.xaxis.set_major_locator(mticker.MaxNLocator(integer=True))
    add_chart_header(fig, ax, "图像编辑论文的方法家族按主题分布", "CVPR 2026 Open Access；每个横条为一个主题簇，颜色表示主要方法家族")
    handles, labels = ax.get_legend_handles_labels()
    fig.legend(handles, labels, loc="lower left", bbox_to_anchor=(0.18, 0.02), frameon=False, ncol=3, fontsize=8)
    fig.subplots_adjust(bottom=0.20)
    fig.savefig(path, dpi=180, bbox_inches="tight")
    plt.close(fig)


def make_charts(included: list[ClassifiedPaper]) -> dict[str, str]:
    CHARTS_DIR.mkdir(parents=True, exist_ok=True)
    use_chart_theme()
    df = pd.DataFrame([asdict(item) for item in included])
    chart_paths = {
        "cluster": CHARTS_DIR / "cvpr2026_image_editing_full_by_cluster.png",
        "method": CHARTS_DIR / "cvpr2026_image_editing_full_by_method.png",
        "priority": CHARTS_DIR / "cvpr2026_image_editing_full_by_priority.png",
        "cluster_method": CHARTS_DIR / "cvpr2026_image_editing_full_cluster_method.png",
    }
    cluster_df = df["editing_cluster"].value_counts().rename_axis("主题簇").reset_index(name="论文数")
    method_df = df["method_family"].value_counts().rename_axis("方法家族").reset_index(name="论文数")
    priority_order = ["Deep Read", "Skim -> Deep", "Skim"]
    priority_df = df["reading_priority"].value_counts().reindex(priority_order, fill_value=0).rename_axis("阅读优先级").reset_index(name="论文数")

    save_ranked_bar(cluster_df, "主题簇", "论文数", chart_paths["cluster"], "CVPR 2026 图像编辑相关论文按主题簇分布", "从全量 CVF 主会论文重新筛选；直接编辑、局部控制、概念擦除、人像与评测分开统计", "blue")
    save_ranked_bar(method_df, "方法家族", "论文数", chart_paths["method"], "CVPR 2026 图像编辑相关论文按方法家族分布", "标题与摘要级 triage；Diffusion/Flow/MLLM/Benchmark 等按论文主要技术信号归类", "orange")
    save_ranked_bar(priority_df, "阅读优先级", "论文数", chart_paths["priority"], "图像编辑论文阅读优先级建议", "Deep Read 表示论文直接落在编辑任务或关键评测/安全问题上", "olive")
    save_stacked_cluster_method(df, chart_paths["cluster_method"])
    return {key: str(path.relative_to(REPORTS_DIR)).replace("\\", "/") for key, path in chart_paths.items()}


def pct(count: int, total: int) -> str:
    return f"{count / total * 100:.1f}%" if total else "0.0%"


def count_table(counter: Counter, total: int, first_col: str) -> str:
    rows = []
    for key, value in counter.most_common():
        rows.append(f"<tr><td>{html.escape(str(key))}</td><td>{value}</td><td>{pct(value, total)}</td></tr>")
    return f'<table><thead><tr><th>{first_col}</th><th>论文数</th><th>占比</th></tr></thead><tbody>{"".join(rows)}</tbody></table>'


def link_or_empty(url: str, label: str) -> str:
    if not url:
        return ""
    return f'<a href="{html.escape(url)}">{html.escape(label)}</a>'


def paper_table(rows: list[ClassifiedPaper]) -> str:
    sorted_rows = sorted(rows, key=lambda item: (item.editing_cluster, item.reading_priority, item.paper_id))
    body = []
    for item in sorted_rows:
        links = " ".join(part for part in [link_or_empty(item.paper_page, "CVF"), link_or_empty(item.pdf, "PDF"), link_or_empty(item.arxiv, "arXiv")] if part)
        body.append(
            "<tr>"
            f"<td>{item.paper_id}</td>"
            f"<td>{html.escape(item.day)}</td>"
            f"<td>{html.escape(item.title)}</td>"
            f"<td>{html.escape(item.authors_short)}</td>"
            f"<td>{html.escape(item.editing_cluster)}</td>"
            f"<td>{html.escape(item.method_family)}</td>"
            f"<td>{html.escape(item.relevance)}</td>"
            f"<td>{html.escape(item.reading_priority)}</td>"
            f"<td>{html.escape(item.best_use)}</td>"
            f"<td>{links}</td>"
            "</tr>"
        )
    return (
        '<div class="table-scroll"><table class="paper-table">'
        "<thead><tr><th>ID</th><th>日期</th><th>标题</th><th>作者</th><th>主题簇</th><th>方法家族</th><th>相关度</th><th>优先级</th><th>最佳用途</th><th>链接</th></tr></thead>"
        f"<tbody>{''.join(body)}</tbody></table></div>"
    )


def recommended_lists(included: list[ClassifiedPaper]) -> str:
    groups = defaultdict(list)
    for item in included:
        if item.reading_priority == "Deep Read":
            groups[item.editing_cluster].append(item)
    parts = []
    for cluster, rows in sorted(groups.items(), key=lambda pair: (-len(pair[1]), pair[0])):
        shown = sorted(rows, key=lambda item: item.paper_id)[:8]
        lis = "".join(f"<li>{html.escape(item.title)}</li>" for item in shown)
        suffix = f"；另有 {len(rows) - len(shown)} 篇" if len(rows) > len(shown) else ""
        parts.append(f"<h3>{html.escape(cluster)}：{len(rows)} 篇 Deep Read{suffix}</h3><ul>{lis}</ul>")
    return "".join(parts)


def make_summary(all_papers: list[Paper], classified: list[ClassifiedPaper]) -> dict:
    included = [item for item in classified if item.include_decision == "include"]
    candidates = [item for item in classified if item.include_decision == "exclude"]
    total = len(included)
    return {
        "source": "CVF Open Access CVPR 2026 main-conference day pages",
        "generated_at": "2026-06-20",
        "total_cvpr2026_main_papers": len(all_papers),
        "image_editing_related": total,
        "share_of_main_papers": round(total / len(all_papers), 4) if all_papers else 0,
        "candidate_audit_rows": len(classified),
        "boundary_excluded": len(candidates),
        "by_cluster": dict(Counter(item.editing_cluster for item in included)),
        "by_method": dict(Counter(item.method_family for item in included)),
        "by_modality": dict(Counter(item.modality for item in included)),
        "by_relevance": dict(Counter(item.relevance for item in included)),
        "by_priority": dict(Counter(item.reading_priority for item in included)),
        "by_day": dict(Counter(item.day for item in included)),
        "day_urls": DAY_URLS,
        "abstracts_available": sum(1 for item in classified if item.abstract),
        "methodology": {
            "scope": "Image-editing-related CVPR 2026 papers were selected from the full CVF Open Access main-conference listing, not from the existing diffusion subset.",
            "evidence_level": "Title-level triage; cached abstracts are retained for audit only and do not change inclusion decisions.",
            "included_tasks": [
                "instruction-guided image editing",
                "retouching",
                "inpainting",
                "compositing",
                "concept erasure",
                "regional/local control",
                "style/texture/appearance transfer",
                "identity-preserving face or try-on editing",
                "video/multiview/3D editing extensions",
                "editing benchmarks, authorization, and trustworthy editing",
            ],
            "excluded_tasks": [
                "pure image restoration/enhancement without edit intent",
                "segmentation/classification/detection/tracking/retrieval",
                "robotics/navigation/control tasks whose control is not image editing control",
            ],
        },
    }


def write_report(included: list[ClassifiedPaper], classified: list[ClassifiedPaper], summary: dict, charts: dict[str, str]) -> None:
    total = summary["image_editing_related"]
    all_total = summary["total_cvpr2026_main_papers"]
    cluster_counter = Counter(item.editing_cluster for item in included)
    method_counter = Counter(item.method_family for item in included)
    modality_counter = Counter(item.modality for item in included)
    priority_counter = Counter(item.reading_priority for item in included)
    relevance_counter = Counter(item.relevance for item in included)
    boundary_count = summary["boundary_excluded"]
    abstract_count = summary.get("abstracts_available", 0)
    top_clusters = cluster_counter.most_common(3)
    top_cluster_text = "、".join(f"{name} {count} 篇" for name, count in top_clusters)
    deep_count = priority_counter.get("Deep Read", 0)
    strong_count = relevance_counter.get("强相关", 0)

    html_text = f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>CVPR 2026 图像编辑相关论文统计分析</title>
  <style>
    :root {{
      --ink:#1f2430; --muted:#5f6878; --line:#d8dde8; --soft:#f3f6fb; --panel:#fff;
      --blue:#5477c4; --orange:#cc6f47; --olive:#71b436; --gold:#b8a037;
    }}
    body {{ margin:0; background:#fcfcfd; color:var(--ink); font-family:"Microsoft YaHei","Segoe UI",Arial,sans-serif; }}
    main {{ max-width:1160px; margin:0 auto; padding:42px 22px 72px; }}
    header, section {{ margin-bottom:34px; }}
    h1 {{ font-size:32px; line-height:1.18; margin:0 0 8px; letter-spacing:0; }}
    h2 {{ font-size:22px; line-height:1.25; margin:0 0 12px; letter-spacing:0; }}
    h3 {{ font-size:16px; margin:18px 0 6px; letter-spacing:0; }}
    p, li {{ line-height:1.72; }}
    a {{ color:var(--blue); text-decoration:none; }}
    a:hover {{ text-decoration:underline; }}
    .meta {{ color:var(--muted); margin-top:0; }}
    .kpis {{ display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin:18px 0; }}
    .kpi {{ border:1px solid var(--line); background:var(--panel); border-radius:8px; padding:14px; }}
    .kpi strong {{ display:block; font-size:24px; margin-bottom:3px; }}
    .kpi span {{ color:var(--muted); font-size:13px; }}
    figure {{ margin:22px 0; }}
    figure img {{ width:100%; max-width:1030px; border:1px solid var(--line); border-radius:8px; background:white; }}
    figcaption {{ color:var(--muted); font-size:13px; margin-top:8px; }}
    table {{ width:100%; border-collapse:collapse; background:white; border:1px solid var(--line); }}
    th, td {{ padding:9px 10px; border-bottom:1px solid var(--line); vertical-align:top; text-align:left; }}
    th {{ background:var(--soft); font-size:13px; }}
    td {{ font-size:13px; }}
    .table-grid {{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }}
    .table-scroll {{ overflow-x:auto; border:1px solid var(--line); border-radius:8px; }}
    .table-scroll table {{ border:0; min-width:1380px; }}
    .paper-table td:nth-child(3) {{ min-width:380px; }}
    .note {{ background:#f8fafc; border-left:4px solid var(--orange); padding:12px 14px; border-radius:0 6px 6px 0; }}
    .source-list {{ display:flex; flex-wrap:wrap; gap:10px; padding:0; list-style:none; }}
    .source-list a {{ display:inline-block; border:1px solid var(--line); border-radius:999px; padding:6px 10px; background:#fff; }}
    code {{ background:var(--soft); padding:2px 5px; border-radius:5px; }}
    @media (max-width:760px) {{ .kpis,.table-grid {{ grid-template-columns:1fr; }} h1 {{ font-size:26px; }} }}
  </style>
</head>
<body>
  <main data-report-audience="technical">
    <header data-contract-section="title">
      <h1>CVPR 2026 图像编辑相关论文统计分析</h1>
      <p class="meta">生成日期：2026-06-20；范围：CVF Open Access 的 CVPR 2026 主会三天全量论文页；筛选口径：图像编辑 / image editing 及其直接相关链路，不从 diffusion 子集倒筛。</p>
      <ul class="source-list">
        <li><a href="{DAY_URLS['2026-06-05']}">CVF 2026-06-05</a></li>
        <li><a href="{DAY_URLS['2026-06-06']}">CVF 2026-06-06</a></li>
        <li><a href="{DAY_URLS['2026-06-07']}">CVF 2026-06-07</a></li>
      </ul>
    </header>

    <section data-contract-section="technical-summary">
      <h2>技术摘要：图像编辑已从单一生成模型分化为编辑任务、控制接口、可信评测三条线</h2>
      <p><strong>从 {all_total:,} 篇 CVPR 2026 主会论文中重新筛出 {total} 篇图像编辑相关论文，占主会约 {pct(total, all_total)}。</strong>这批论文不是 diffusion 子集的再过滤；它额外纳入了 instruction-guided image editing、image retouching、benchmark、授权/可信编辑、风格纹理、人像试穿、视频/多视图编辑等标题和摘要明确落在编辑链路上的工作。</p>
      <p>主题上最密集的是 {html.escape(top_cluster_text)}。这说明 2026 年的 image editing 不只是“生成一张新图”，而是在走向复杂指令、多对象局部约束、编辑安全、身份保持和跨视角一致性。</p>
      <div class="kpis">
        <div class="kpi"><strong>{total}</strong><span>图像编辑相关论文</span></div>
        <div class="kpi"><strong>{pct(total, all_total)}</strong><span>占 CVPR 2026 主会比例</span></div>
        <div class="kpi"><strong>{strong_count}</strong><span>强相关论文</span></div>
        <div class="kpi"><strong>{deep_count}</strong><span>建议 Deep Read</span></div>
      </div>
    </section>

    <section data-contract-section="key-findings">
      <h2>关键发现：直接编辑最多，但评测/可信编辑是新增的非 diffusion 盲区</h2>
      <p>按主题簇看，直接编辑、修补、合成仍是最大主体；但从全量 CVF 页面重新筛选后，`CompBench` 与 `RetouchIQ` 这类 benchmark/retouching/agent 论文会进入清单。它们不一定以 diffusion 为标题核心，却对 image edit 研究路线很关键。</p>
      <figure><img src="{charts['cluster']}" alt="CVPR 2026 image editing papers by cluster"><figcaption>图 1：图像编辑相关论文按主题簇计数。主题簇用于决定优先阅读路线，而不是作者自称的方向。</figcaption></figure>
      <p>方法家族仍由 diffusion 及其变体主导，但 MLLM/Agent、Benchmark/Evaluation、Flow/Rectified Flow 已经形成明显侧枝。对后续研究最有用的不是只追模型，而是对照任务：复杂指令编辑需要 benchmark，人像/试穿需要身份保持，视频/多视图需要一致性。</p>
      <figure><img src="{charts['method']}" alt="CVPR 2026 image editing papers by method family"><figcaption>图 2：按主要方法信号统计。这里以标题和摘要中的技术主语归类，复杂混合方法只归入最能解释论文贡献的一类。</figcaption></figure>
      <figure><img src="{charts['cluster_method']}" alt="CVPR 2026 image editing papers by cluster and method"><figcaption>图 3：主题簇与方法家族交叉分布。它显示不同任务线并不共享同一套技术路线。</figcaption></figure>
      <figure><img src="{charts['priority']}" alt="CVPR 2026 image editing papers by reading priority"><figcaption>图 4：阅读优先级建议。Deep Read 代表标题/摘要直接落在编辑任务、评测、安全或关键人像/多视图问题上。</figcaption></figure>
    </section>

    <section data-contract-section="scope-data-and-metric-definitions">
      <h2>范围、数据与定义：本报告按 image editing 链路重新筛选</h2>
      <p>数据源是 CVF Open Access 的 CVPR 2026 主会三天页面。脚本先解析全量标题、作者、CVF 页面、PDF/arXiv 链接，再对标题出现编辑信号的候选论文做 triage；本次有 {abstract_count} 条候选记录保留了本地缓存摘要，作为人工复核备注，不参与最终纳入规则。</p>
      <p>本报告的“图像编辑相关”包括 instruction-guided image editing、retouching、inpainting、compositing、concept erasure、regional/local control、style/texture/appearance editing、identity-preserving face/try-on editing、video/multiview/3D editing extension，以及 editing benchmark / authorization / trustworthy editing。</p>
      <p class="note">不纳入纯 restoration/enhancement、分割/检测/跟踪/检索、机器人/导航控制等边界任务，除非标题或摘要明确说明其目标是图像编辑操作。被排除但触发关键词的候选保存在 <code>{CANDIDATES_CSV}</code>，便于复核。</p>
      <div class="table-grid">
        <div><h3>主题簇统计</h3>{count_table(cluster_counter, total, "主题簇")}</div>
        <div><h3>方法家族统计</h3>{count_table(method_counter, total, "方法家族")}</div>
        <div><h3>模态统计</h3>{count_table(modality_counter, total, "模态")}</div>
        <div><h3>阅读优先级统计</h3>{count_table(priority_counter, total, "优先级")}</div>
      </div>
    </section>

    <section data-contract-section="methodology">
      <h2>方法：全量 CVF 抓取 + 标题/摘要级审计筛选</h2>
      <p>筛选过程分三步：第一步解析 CVF 主会全量页面，得到 {all_total:,} 篇论文；第二步用编辑任务词、局部控制词、风格/身份/视频编辑词建立宽候选；第三步用排除规则剔除 restoration-only、segmentation/detection/tracking/retrieval 等非编辑任务。最终纳入由标题级规则和人工边界规则决定，避免缓存摘要数量变化导致统计漂移。</p>
      <p>每篇最终论文都有 <code>relevance</code>、<code>editing_cluster</code>、<code>method_family</code>、<code>reading_priority</code>、<code>signals</code> 和 <code>evidence_basis</code> 字段。这个结果适合做专题地图和阅读队列，但不等价于逐篇 PDF 的完整审稿；后续精读时应优先补充方法细节、实验协议和代码可复现性。</p>
    </section>

    <section data-contract-section="limitations-uncertainty-and-robustness-checks">
      <h2>限制与不确定性：标题/摘要足以做地图，不足以替代精读</h2>
      <p>本报告没有逐篇通读 PDF，因此对方法细节、实验可信度、baseline 公平性和代码可复现性只做低深度判断。最容易出现边界不确定的是 prompt/alignment/control 类论文：它们可能是通用生成控制，也可能是编辑系统中的关键模块；本报告将其降为中相关或 Skim -> Deep，而不是和直接 image editing 混为一类。</p>
      <p>另一个不确定点是 low-level enhancement 与 photo editing 的边界。报告排除了白平衡、反射移除、纯 restoration 等缺少编辑意图的论文；如果你的研究口径要覆盖 computational photography editing，可以从候选审计表中重新打开这些边界项。</p>
    </section>

    <section data-contract-section="recommended-next-steps">
      <h2>建议阅读路线：先读任务定义，再读控制与一致性</h2>
      <p><strong>优先级最高的是复杂指令编辑/修图 benchmark、直接编辑与修补、人像/试穿、概念擦除、多视图/视频编辑。</strong>这些论文最容易转化为后续研究问题：如何评测复杂编辑是否满足指令，如何避免局部编辑串扰，如何保持身份/风格/纹理，如何让编辑跨帧和跨视角一致。</p>
      {recommended_lists(included)}
    </section>

    <section data-contract-section="further-questions">
      <h2>进一步问题</h2>
      <ul>
        <li>复杂指令编辑 benchmark 是否真的覆盖多对象、多约束、多步编辑，还是仍偏向单句局部替换？</li>
        <li>概念擦除论文能否抵抗同义提示、LoRA/adapter 恢复和邻近概念副作用？</li>
        <li>区域编辑方法是否显式度量了 non-target preservation，而不只是展示少量定性图？</li>
        <li>多视图/视频编辑能否同时保持几何一致性、时间一致性和局部可控性？</li>
        <li>哪些论文有代码、数据和可复现实验，适合作为后续 image editing 项目的 baseline？</li>
      </ul>
    </section>

    <section>
      <h2>全量图像编辑相关论文清单</h2>
      <p>CSV 版本可继续筛选和二次标注：<a href="{PAPERS_CSV}">{PAPERS_CSV}</a>；候选审计表：<a href="{CANDIDATES_CSV}">{CANDIDATES_CSV}</a>。</p>
      {paper_table(included)}
    </section>
  </main>
</body>
</html>
"""
    (REPORTS_DIR / REPORT_HTML).write_text(html_text, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--refresh", action="store_true", help="Refetch CVF pages instead of using local cache.")
    parser.add_argument("--fetch-abstracts", action="store_true", help="Fetch candidate paper pages for abstracts; slower but richer.")
    args = parser.parse_args()

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)
    CHARTS_DIR.mkdir(parents=True, exist_ok=True)

    all_papers = collect_papers(refresh=args.refresh)
    if args.fetch_abstracts:
        add_candidate_abstracts(all_papers, refresh=args.refresh)
    else:
        load_cached_candidate_abstracts(all_papers)
    classified = [classify_paper(paper) for paper in all_papers if is_broad_candidate(paper)]
    included = [item for item in classified if item.include_decision == "include"]
    included.sort(key=lambda item: item.paper_id)
    classified.sort(key=lambda item: item.paper_id)

    included_records = [asdict(item) for item in included]
    candidate_records = [asdict(item) for item in classified]
    write_csv(REPORTS_DIR / PAPERS_CSV, included_records)
    write_csv(REPORTS_DIR / CANDIDATES_CSV, candidate_records)
    write_csv(DOWNLOADS_DIR / PAPERS_CSV, included_records)
    write_csv(DOWNLOADS_DIR / CANDIDATES_CSV, candidate_records)

    summary = make_summary(all_papers, classified)
    (REPORTS_DIR / SUMMARY_JSON).write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    (DOWNLOADS_DIR / SUMMARY_JSON).write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    charts = make_charts(included)
    write_report(included, classified, summary, charts)

    print(json.dumps({
        "total_cvpr2026_main_papers": len(all_papers),
        "image_editing_related": len(included),
        "candidate_audit_rows": len(classified),
        "report": str(REPORTS_DIR / REPORT_HTML),
        "papers_csv": str(REPORTS_DIR / PAPERS_CSV),
        "candidates_csv": str(REPORTS_DIR / CANDIDATES_CSV),
        "summary_json": str(REPORTS_DIR / SUMMARY_JSON),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
