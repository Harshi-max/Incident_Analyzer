'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

let initialized = false;

export default function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (!initialized) {
      mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose', fontFamily: 'Manrope' });
      initialized = true;
    }
    const id = `mermaid-${Math.random().toString(36).slice(2)}`;
    mermaid.render(id, chart).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg;
    }).catch(() => setFailed(true));
  }, [chart]);

  return failed ? <pre className="mermaid-block">{chart}</pre> : <div className="mermaid-visual" ref={ref} aria-label="Architecture diagram" />;
}
