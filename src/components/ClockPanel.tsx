import { useEffect, useState } from 'react';

interface ClockPanelProps {
  hitokoto: string;
}

export default function ClockPanel({ hitokoto }: ClockPanelProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = now.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <section className="clock-panel" aria-label="时间">
      <div className="clock-time">{time}</div>
      <div className="clock-date">{date}</div>
      <p className="hitokoto">{hitokoto}</p>
    </section>
  );
}
