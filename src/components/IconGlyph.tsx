import {
  AppWindow,
  Bot,
  BookOpen,
  BriefcaseBusiness,
  GitBranch,
  NotebookPen,
  Palette,
  SearchCode,
  Sparkles,
} from 'lucide-react';

interface IconGlyphProps {
  icon: string;
  label: string;
  className?: string;
}

const iconMap = {
  apps: AppWindow,
  notes: NotebookPen,
  research: BookOpen,
  theme: Palette,
  openai: Bot,
  search: SearchCode,
  work: BriefcaseBusiness,
  github: GitBranch,
};

function isImageIcon(icon: string): boolean {
  return icon.startsWith('/') || icon.startsWith('http') || /\.(svg|png|jpe?g|webp)$/i.test(icon);
}

export default function IconGlyph({ icon, label, className }: IconGlyphProps) {
  if (isImageIcon(icon)) {
    return <img className={className} src={icon} alt={label} loading="lazy" />;
  }

  const LucideIcon = iconMap[icon as keyof typeof iconMap];
  if (LucideIcon) {
    return <LucideIcon className={className} aria-hidden="true" />;
  }

  return (
    <span className={className} aria-hidden="true">
      <Sparkles size={22} />
    </span>
  );
}
