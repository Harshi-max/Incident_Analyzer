'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronRight, Copy, Github, Menu, Moon, Search, Sun, X } from 'lucide-react';
import MermaidDiagram from './components/MermaidDiagram';

const repo = 'https://github.com/VishalChoubey1019/incident-analyzer';

type Section = { id: string; label: string; group: string };
const sections: Section[] = [
  { id: 'overview', label: 'Overview', group: 'Start here' },
  { id: 'architecture', label: 'System architecture', group: 'Architecture' },
  { id: 'data-flow', label: 'Data flow', group: 'Architecture' },
  { id: 'incident-lifecycle', label: 'Incident lifecycle', group: 'Architecture' },
  { id: 'ingestion', label: 'Ingestion API', group: 'Core components' },
  { id: 'kafka', label: 'Kafka pipeline', group: 'Core components' },
  { id: 'flink', label: 'Flink correlation', group: 'Core components' },
  { id: 'ai', label: 'AI / RCA engine', group: 'Core components' },
  { id: 'mongodb', label: 'MongoDB', group: 'Core components' },
  { id: 'grpc', label: 'gRPC services', group: 'Core components' },
  { id: 'dashboard', label: 'Dashboard', group: 'Core components' },
  { id: 'api', label: 'HTTP API reference', group: 'Reference' },
  { id: 'development', label: 'Local development', group: 'Operate' },
  { id: 'deployment', label: 'Deployment', group: 'Operate' },
  { id: 'decisions', label: 'Engineering decisions', group: 'Context' },
  { id: 'limitations', label: 'Limitations', group: 'Context' },
  { id: 'roadmap', label: 'Future improvements', group: 'Context' },
];

const architecture = `graph LR
  A[Application logs / alerts] --> B[FastAPI ingest :8080]
  B --> C[(Kafka logs / alerts)]
  C --> D[Python correlator\nDevelopment]
  C --> E[Flink job\nProduction path]
  D --> F[(Kafka incidents)]
  E --> F
  F --> G[AI engine]
  G --> H[Ollama llama3.2:1b]
  G --> I[(MongoDB incidents)]
  I --> J[gRPC :50051]
  J --> K[HTTP bridge :8082]
  K --> L[Static dashboard :8000]`;

const sequence = `sequenceDiagram
  participant S as Service
  participant I as Ingest :8080
  participant K as Kafka
  participant C as Correlator
  participant A as AI engine
  participant M as MongoDB
  participant D as Dashboard
  S->>I: POST log or alert
  I->>K: publish JSON event
  K->>C: consume logs / alerts
  C->>K: publish incident
  K->>A: consume incident
  A->>A: Ollama structured RCA
  A->>M: upsert enriched incident
  D->>D: poll HTTP bridge :8082
  D->>M: indirectly read incidents`;

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  return <div className="code-wrap"><div className="code-head"><span>{language}</span><button onClick={copy} aria-label="Copy code">{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}</button></div><pre><code>{code}</code></pre></div>;
}

function Callout({ kind = 'note', children }: { kind?: 'note' | 'warning' | 'success'; children: React.ReactNode }) {
  return <div className={`callout ${kind}`}><span className="callout-mark">{kind === 'warning' ? '!' : kind === 'success' ? '✓' : 'i'}</span><div>{children}</div></div>;
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const filtered = useMemo(() => sections.filter(s => `${s.label} ${s.group}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const groups = [...new Set(filtered.map(s => s.group))];

  return <main className={dark ? 'site dark' : 'site'}>
    <header className="navbar">
      <a className="brand" href="#overview"><span className="brand-mark">IA</span><span>Incident Analyzer</span><small>docs</small></a>
      <div className="nav-links"><a href="#architecture">Architecture</a><a href="#api">API</a><a href={repo} target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a><a href="http://localhost:8000" target="_blank" rel="noreferrer">Demo</a></div>
      <div className="nav-actions"><button className="icon-button mobile-menu" onClick={() => setDrawer(true)} aria-label="Open navigation"><Menu size={18} /></button><button className="icon-button" onClick={() => setDark(v => !v)} aria-label="Toggle theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</button></div>
    </header>
    <div className="docs-layout">
      <aside className={`sidebar ${drawer ? 'open' : ''}`}>
        <div className="sidebar-top"><span>Documentation</span><button className="icon-button mobile-menu" onClick={() => setDrawer(false)} aria-label="Close navigation"><X size={18} /></button></div>
        <label className="search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search docs" /></label>
        <nav>{groups.map(group => <div className="nav-group" key={group}><span className="nav-group-label">{group}</span>{filtered.filter(s => s.group === group).map(s => <a key={s.id} href={`#${s.id}`} onClick={() => setDrawer(false)}>{s.label}<ChevronRight size={13} /></a>)}</div>)}</nav>
        <div className="sidebar-foot"><span className="status-dot" /> Source verified against repository</div>
      </aside>
      {drawer && <button className="scrim" onClick={() => setDrawer(false)} aria-label="Close menu" />}
      <article className="content">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
          <section id="overview" className="hero section-block"><div className="hero-copy"><span className="eyebrow">Distributed systems / AI operations</span><h1>Incident intelligence,<br /><em>from signal to cause.</em></h1><p className="lead">A technical guide to the system that correlates application failures, enriches incidents with local LLM analysis, and makes the result legible to an on-call engineer.</p><div className="hero-actions"><a className="button primary" href="#architecture">Explore architecture <ChevronRight size={16} /></a><a className="button secondary" href={repo} target="_blank" rel="noreferrer"><Github size={16} /> View source</a></div></div><div className="hero-orbit"><div className="orbit-core">INCIDENT<br /><strong>ANALYZER</strong></div><span className="orbit-node n1">Kafka</span><span className="orbit-node n2">Ollama</span><span className="orbit-node n3">Flink</span><span className="orbit-node n4">MongoDB</span></div></section>

          <Callout kind="success"><strong>What is live today:</strong> the local stack includes Docker infrastructure, FastAPI ingestion, Kafka, a development correlator, Ollama, MongoDB, gRPC, an HTTP bridge, and a static dashboard. The production Flink path is implemented but separately deployed.</Callout>

          <section id="architecture" className="section-block"><SectionHeading eyebrow="01 / Architecture" title="The system at a glance">The repository is a multi-process local system. The two correlation paths are intentionally distinct: Python is the rapid development loop; Flink is the production-oriented job.</SectionHeading><MermaidDiagram chart={architecture} /><div className="card-grid three"><Info title="Ingest" tag="FastAPI" text="Accepts log events and alerts, serializes them as JSON, and publishes them to Kafka." /><Info title="Correlate" tag="Flink / Python" text="Groups errors by service and time window, or turns each alert into an incident immediately." /><Info title="Explain" tag="Ollama" text="Consumes incidents, asks a local Llama model for structured RCA, then upserts MongoDB." /></div></section>

          <section id="data-flow" className="section-block"><SectionHeading eyebrow="02 / Data flow" title="One failure, traced end to end">The browser never talks directly to MongoDB or gRPC. It polls the HTTP bridge, which translates JSON requests into protobuf calls.</SectionHeading><MermaidDiagram chart={sequence} /><ol className="steps"><li><b>Accept.</b> `POST /events/log` or `POST /events/alert` returns `202` after Kafka acknowledgement.</li><li><b>Correlate.</b> The chosen correlator consumes `logs` and `alerts` and writes incident JSON to `incidents`.</li><li><b>Enrich.</b> The AI engine builds an SRE prompt and calls Ollama with `stream: false`.</li><li><b>Persist.</b> The enriched document is upserted into the `incidents` MongoDB collection.</li><li><b>Serve.</b> gRPC reads MongoDB; the HTTP bridge makes list and analysis actions browser-friendly.</li><li><b>Observe.</b> The dashboard polls every 15 seconds and renders severity, status, RCA, confidence, and event IDs.</li></ol></section>

          <section id="incident-lifecycle" className="section-block"><SectionHeading eyebrow="03 / Lifecycle" title="What counts as an incident?">Correlation is the boundary where many raw signals become an operational unit.</SectionHeading><div className="lifecycle"><span>ERROR</span><b>+</b><span>ERROR</span><b>+</b><span>ERROR</span><i>same service + same window</i><strong>INCIDENT</strong></div><Callout kind="warning"><strong>Two implementations exist.</strong> Flink uses 30-second tumbling processing-time windows and emits when a service has 3 or more errors. The local Python correlator uses a 15-second flush window and a demo threshold of 2. Do not run both against the same topics unless duplicate incidents are intentional.</Callout></section>

          <section id="ingestion" className="section-block"><SectionHeading eyebrow="04 / Core component" title="Ingestion API">The FastAPI service is a small, synchronous Kafka producer at `localhost:8080`.</SectionHeading><CodeBlock language="PowerShell" code={`$payload = @{ service = "order-service"; level = "ERROR"; message = "database timeout" } | ConvertTo-Json
Invoke-RestMethod http://localhost:8080/events/log -Method Post -Body $payload -ContentType "application/json"`} /><div className="api-mini"><code>POST /events/log</code><span>LogEventIn: service, level, message, host, timestamp, labels</span><b>202</b></div><div className="api-mini"><code>POST /events/alert</code><span>AlertIn: name, source, severity, service, message, fired_at, annotations</span><b>202</b></div></section>

          <section id="kafka" className="section-block"><SectionHeading eyebrow="05 / Core component" title="Kafka pipeline">Kafka is the buffer between producers and processors. Topics are created by the startup flow.</SectionHeading><div className="topic-row"><Topic name="logs" from="ingest-service" to="correlator" /><Topic name="alerts" from="ingest-service" to="correlator" /><Topic name="incidents" from="correlator" to="ai-engine / API" /></div><Callout>Serialization is JSON encoded as UTF-8. The ingest producer uses `acks="all"` and retries three times. Consumer groups are `python-correlator`, `flink-correlator`, and `ai-engine`.</Callout></section>

          <section id="flink" className="section-block"><SectionHeading eyebrow="06 / Core component" title="Flink correlation">The Kotlin job reads both Kafka sources. Error logs are parsed, filtered, keyed by service, windowed, and written to the incidents topic. Alerts bypass the window and become incidents immediately.</SectionHeading><CodeBlock language="Kotlin" code={`logs
  .flatMap(LogParser())
  .filter { it.level == "ERROR" }
  .keyBy { it.service }
  .window(TumblingProcessingTimeWindows.of(Time.seconds(30)))
  .apply(LogCorrelator(), Types.STRING)
  .sinkTo(incidentSink)`} /><p>Flink emits `MEDIUM` for 3-5 errors, `HIGH` for 6-9, and `CRITICAL` for 10 or more. Invalid JSON is logged and dropped by the parsers. The local Python script exists to avoid rebuilding and redeploying the JAR during iteration.</p></section>

          <section id="ai" className="section-block"><SectionHeading eyebrow="07 / Core component" title="AI / RCA engine">The AI worker consumes `incidents`, constructs the prompt from service, severity, title, and description, and expects strict JSON.</SectionHeading><CodeBlock language="JSON" code={`{
  "summary": "one sentence describing what happened",
  "likely_cause": "most probable root cause",
  "recommendations": ["action 1", "action 2", "action 3"],
  "confidence_score": 0.0
}`} /><div className="metric-grid"><Metric label="Default model" value="llama3.2:1b" /><Metric label="Endpoint" value="localhost:11434" /><Metric label="Transport" value="HTTP JSON" /><Metric label="Failure mode" value="Evidence fallback" /></div><p>Set `OLLAMA_MODEL=llama3` to use the larger model. If Ollama is unavailable, the current implementation stores an evidence-based fallback RCA rather than discarding the incident.</p></section>

          <section id="mongodb" className="section-block"><SectionHeading eyebrow="08 / Core component" title="MongoDB document model">The initializer creates `incidents`, `events`, and `alerts` collections. The AI and gRPC paths actively use the `incidents` collection.</SectionHeading><CodeBlock language="JSON" code={`{
  "id": "inc-...",
  "title": "order-service — 4 errors",
  "description": "...",
  "severity": "HIGH",
  "status": "OPEN",
  "service": "order-service",
  "startedAt": 1787200000000,
  "updatedAt": 1787200005000,
  "relatedEventIds": ["event-..."],
  "rca": {
    "summary": "...",
    "likely_cause": "...",
    "recommendations": ["..."],
    "confidence_score": 0.7,
    "generated_at": 1787200005000
  }
}`} /><p>Indexes are defined for status, severity, service, started time, event service/time, event time, and alert source/time. The local Compose mapping is host `27018` to container `27017`.</p></section>

          <section id="grpc" className="section-block"><SectionHeading eyebrow="09 / Core component" title="gRPC services">The protobuf contract defines IncidentService, AlertService, and AnalysisService. The Python server currently registers IncidentService list support and AnalysisService trigger support.</SectionHeading><div className="rpc-list"><Rpc name="IncidentService.ListIncidents" request="ListIncidentsRequest" response="ListIncidentsResponse" /><Rpc name="IncidentService.GetIncident" request="GetIncidentRequest" response="GetIncidentResponse" note="Contract exists; server implementation is not complete." /><Rpc name="IncidentService.StreamIncidents" request="StreamIncidentsRequest" response="stream Incident" note="Contract exists; server implementation is not complete." /><Rpc name="AlertService.IngestEvent" request="IngestEventRequest" response="IngestEventResponse" note="Contract exists; server implementation is not registered." /><Rpc name="AnalysisService.TriggerAnalysis" request="GetIncidentRequest" response="RootCauseAnalysis" /></div><Callout kind="warning">There is no `ResolveIncident` RPC. `STATUS_RESOLVED` is an enum value only; it is not a working mutation workflow.</Callout></section>

          <section id="dashboard" className="section-block"><SectionHeading eyebrow="10 / Core component" title="Dashboard">The existing dashboard is a static `index.html`, not a React app. It fetches the bridge every 15 seconds and supports All, Open, Investigating, and Resolved filters, plus Re-analyse.</SectionHeading><div className="card-grid three"><Info title="Displays" tag="Read model" text="Service, severity, status, age, description, related IDs, RCA summary, likely cause, recommendations, and confidence." /><Info title="Transport" tag="HTTP JSON" text="GET /incidents and POST /incidents/{id}/analyse through the CORS-enabled bridge." /><Info title="Gap" tag="Honest limitation" text="The Resolved filter exists visually, but there is no frontend action or backend mutation to resolve an incident." /></div></section>

          <section id="api" className="section-block"><SectionHeading eyebrow="11 / Reference" title="HTTP API reference">These routes are present in `api-server/http_bridge.py` and `ingest-service/main.py`. The bridge’s single-incident GET route currently reaches an unimplemented gRPC method.</SectionHeading><div className="endpoint"><span className="method post">POST</span><code>/events/log</code><p>Accept a log event and publish it to Kafka topic `logs`.</p><CodeBlock language="JSON" code={`{"service":"order-service","level":"ERROR","message":"database timeout"}`} /></div><div className="endpoint"><span className="method post">POST</span><code>/events/alert</code><p>Accept an alert and publish it to Kafka topic `alerts`.</p></div><div className="endpoint"><span className="method get">GET</span><code>/incidents?page=1&page_size=20</code><p>List incidents through gRPC. Returns <code>{'{ incidents, total }'}</code> or `503` when the gRPC service is unavailable.</p></div><div className="endpoint"><span className="method get">GET</span><code>/incidents/{'{incident_id}'}</code><p>Route exists in the bridge, but the current gRPC server does not implement `GetIncident`; expect `503`/unimplemented behavior.</p></div><div className="endpoint"><span className="method post">POST</span><code>/incidents/{'{incident_id}'}/analyse</code><p>Queue an existing incident on Kafka for RCA regeneration.</p></div></section>

          <section id="development" className="section-block"><SectionHeading eyebrow="12 / Operate" title="Local development">Use Python 3.11 for the pinned dependency set. Run infrastructure first, then each long-running process in its own terminal.</SectionHeading><CodeBlock language="PowerShell" code={`cd C:\\Users\\subra\\contribution\\incident-analyzer\\incident-analyzer
docker compose up -d
ollama serve
ollama pull llama3.2:1b

# Separate terminals
cd ingest-service; .venv\\Scripts\\python -m uvicorn main:app --port 8080
cd ai-engine; .venv\\Scripts\\python main.py
cd ai-engine; .venv\\Scripts\\python correlator.py
cd api-server; .venv\\Scripts\\python main.py
cd api-server; .venv\\Scripts\\python -m uvicorn http_bridge:app --port 8082
cd dashboard; py -3.11 -m http.server 8000`} /><p>The repository’s `start.sh` is Bash-oriented and checks for Ollama, Docker, and Python 3. It also generates gRPC stubs. On Windows, the explicit terminals above are the dependable path.</p></section>

          <section id="deployment" className="section-block"><SectionHeading eyebrow="13 / Operate" title="Deployment reality">The documentation site is static and Vercel-ready. The Incident Analyzer itself is not a Vercel-hosted backend.</SectionHeading><div className="deploy-grid"><Info title="Vercel" tag="Documentation only" text="Deploy this Next.js app as a static export. No backend, filesystem, secrets, Kafka, Flink, MongoDB, or Ollama are required at build time." /><Info title="Backend hosting" tag="Separate infrastructure" text="Kafka, ZooKeeper, MongoDB, Flink, Python services, and Ollama need a VM, containers, or managed equivalents with persistent storage and process supervision." /><Info title="Production work" tag="Not automatic" text="Replace localhost configuration, externalize secrets, add health checks/authentication, and choose managed or container hosting for stateful services." /></div><Callout kind="warning">Vercel can host the documentation frontend. It does not automatically host the Incident Analyzer infrastructure.</Callout></section>

          <section id="decisions" className="section-block"><SectionHeading eyebrow="14 / Context" title="Engineering decisions">These are grounded in the repository’s implementation and stated rationale, with trade-offs made explicit.</SectionHeading><div className="decision-grid"><Decision title="Why Kafka?" problem="Producers should not wait for processing." decision="Buffer logs and alerts in topics between services." tradeoff="Adds broker/ZooKeeper operations and eventual consistency." /><Decision title="Why Flink?" problem="Correlation needs keyed time windows." decision="Use a Kotlin streaming job with tumbling windows." tradeoff="The JAR must be built, uploaded, and operated separately." /><Decision title="Why MongoDB?" problem="Incidents contain nested RCA and event IDs." decision="Persist JSON-shaped incident documents." tradeoff="Schema discipline and operational indexing remain application responsibilities." /><Decision title="Why gRPC?" problem="Internal APIs need an explicit contract." decision="Define protobuf services and typed messages." tradeoff="Browsers need the extra HTTP bridge." /><Decision title="Why local Llama?" problem="RCA should work offline without a paid inference API." decision="Call Ollama over local HTTP." tradeoff="Model download, memory, and inference latency are local deployment concerns." /></div></section>

          <section id="limitations" className="section-block"><SectionHeading eyebrow="15 / Context" title="Known limitations">Only verified gaps are listed here.</SectionHeading><ul className="bullet-list"><li>No incident resolution or acknowledgement mutation exists.</li><li>Ollama is a local dependency; model size affects latency and memory.</li><li>Flink deployment requires Gradle/JAR upload and is more involved than the Python correlator.</li><li>Service configuration uses localhost addresses and hard-coded development credentials in Compose/application code.</li><li>The dashboard has no authentication layer.</li><li>Some protobuf RPCs exist in the contract but are not implemented by the current Python server.</li></ul></section>

          <section id="roadmap" className="section-block"><SectionHeading eyebrow="16 / Context" title="Future improvements">These are roadmap ideas, not current capabilities.</SectionHeading><div className="roadmap"><span>01</span><b>Incident resolution workflow</b><p>Add a status mutation, audit trail, and UI action.</p><span>02</span><b>Auth and RBAC</b><p>Protect ingestion, analysis, and operational views.</p><span>03</span><b>Notifications</b><p>Slack, Teams, and PagerDuty integrations.</p><span>04</span><b>Operations intelligence</b><p>Dependency graphs, anomaly detection, remediation, and history analytics.</p></div></section>
        </motion.div>
        <footer><span>Incident Analyzer docs</span><a href={repo} target="_blank" rel="noreferrer">View repository <Github size={14} /></a><span>Built for engineers on call.</span></footer>
      </article>
      <aside className="toc"><span>On this page</span><a href="#overview">Overview</a><a href="#architecture">Architecture</a><a href="#api">API reference</a><a href="#development">Development</a><a href="#limitations">Limitations</a></aside>
    </div>
  </main>;
}

function Info({ title, tag, text }: { title: string; tag: string; text: string }) { return <div className="info-card"><span>{tag}</span><h3>{title}</h3><p>{text}</p></div>; }
function Topic({ name, from, to }: { name: string; from: string; to: string }) { return <div className="topic"><code>{name}</code><small>{from} → {to}</small></div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="metric"><span>{label}</span><b>{value}</b></div>; }
function Rpc({ name, request, response, note }: { name: string; request: string; response: string; note?: string }) { return <div className="rpc"><code>{name}</code><span>{request} → {response}</span>{note && <small>{note}</small>}</div>; }
function Decision({ title, problem, decision, tradeoff }: { title: string; problem: string; decision: string; tradeoff: string }) { return <div className="decision"><h3>{title}</h3><dl><dt>Problem</dt><dd>{problem}</dd><dt>Decision</dt><dd>{decision}</dd><dt>Trade-off</dt><dd>{tradeoff}</dd></dl></div>; }
