import React, { useState, useEffect, useCallback } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0e1117; --surface:#161b27; --card:#1c2333; --border:#2a3347;
    --accent:#3b82f6; --accent2:#f59e0b; --accent3:#10b981; --danger:#ef4444;
    --text:#e2e8f0; --muted:#64748b; --tag-bg:#1e3a5f;
    --latex:#7c3aed; --latex-bg:#1e1040; --latex-border:#4c1d95;
  }
  body { background:var(--bg); color:var(--text); font-family:'Source Serif 4',Georgia,serif; min-height:100vh; line-height:1.6; }
  .app-shell { display:grid; grid-template-columns:260px 1fr; min-height:100vh; }
  .sidebar { background:var(--surface); border-right:1px solid var(--border); padding:2rem 1.25rem; position:sticky; top:0; height:100vh; overflow-y:auto; display:flex; flex-direction:column; gap:1.5rem; }
  .logo { font-family:'Playfair Display',serif; font-size:1.25rem; color:var(--accent); letter-spacing:-0.5px; line-height:1.2; padding-bottom:1rem; border-bottom:1px solid var(--border); }
  .logo span { color:var(--accent2); }
  .sidebar-label { font-family:'IBM Plex Mono',monospace; font-size:0.65rem; letter-spacing:0.12em; color:var(--muted); text-transform:uppercase; margin-bottom:0.5rem; }
  .topic-btn { width:100%; text-align:left; background:transparent; border:1px solid transparent; border-radius:6px; padding:0.6rem 0.75rem; color:var(--muted); cursor:pointer; font-family:'Source Serif 4',serif; font-size:0.85rem; transition:all 0.15s; line-height:1.4; }
  .topic-btn:hover { background:var(--card); color:var(--text); }
  .topic-btn.active { background:var(--tag-bg); border-color:var(--accent); color:var(--text); }
  .topic-num { font-family:'IBM Plex Mono',monospace; font-size:0.7rem; color:var(--accent2); display:block; margin-bottom:2px; }
  .main { padding:2.5rem 3rem; max-width:900px; }
  .page-header { margin-bottom:2rem; padding-bottom:1.5rem; border-bottom:1px solid var(--border); }
  .page-header h1 { font-family:'Playfair Display',serif; font-size:2rem; color:var(--text); letter-spacing:-0.5px; }
  .page-header p { color:var(--muted); font-size:0.9rem; margin-top:0.25rem; font-style:italic; }
  .controls-bar { display:flex; gap:0.75rem; align-items:center; margin-bottom:2rem; flex-wrap:wrap; }
  .btn { font-family:'IBM Plex Mono',monospace; font-size:0.8rem; padding:0.6rem 1.25rem; border-radius:6px; border:none; cursor:pointer; transition:all 0.15s; letter-spacing:0.03em; display:flex; align-items:center; gap:0.5rem; }
  .btn-primary { background:var(--accent); color:#fff; }
  .btn-primary:hover { background:#2563eb; }
  .btn-primary:disabled { background:#1e3a5f; color:var(--muted); cursor:default; }
  .btn-outline { background:transparent; border:1px solid var(--border); color:var(--muted); }
  .btn-outline:hover { border-color:var(--accent); color:var(--text); }
  .btn-sol { background:#14532d; color:#86efac; border:1px solid #166534; }
  .btn-sol:hover { background:#166534; }
  .btn-latex { background:var(--latex-bg); color:#c4b5fd; border:1px solid var(--latex-border); }
  .btn-latex:hover { background:#2e1065; color:#ddd6fe; }
  .btn-latex-sol { background:#1a0a40; color:#a78bfa; border:1px solid #6d28d9; }
  .btn-latex-sol:hover { background:#2e1065; }
  .data-strip { display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:2rem; }
  .data-pill { background:var(--card); border:1px solid var(--border); border-radius:4px; padding:0.3rem 0.75rem; font-family:'IBM Plex Mono',monospace; font-size:0.75rem; }
  .data-pill .label { color:var(--muted); margin-right:0.4rem; }
  .data-pill .val { color:var(--accent2); }
  .ex-card { background:var(--card); border:1px solid var(--border); border-radius:10px; padding:2rem 2.25rem; margin-bottom:1.5rem; animation:fadeIn 0.35s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .ex-tag { display:inline-flex; align-items:center; gap:0.35rem; background:var(--tag-bg); color:var(--accent); border-radius:4px; padding:0.2rem 0.65rem; font-family:'IBM Plex Mono',monospace; font-size:0.7rem; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:1rem; }
  .ex-context { background:#1a2a1a; border-left:3px solid var(--accent3); padding:0.85rem 1rem; border-radius:0 6px 6px 0; margin-bottom:1.25rem; font-size:0.88rem; color:#a7f3d0; font-style:italic; }
  .ex-title { font-family:'Playfair Display',serif; font-size:1.25rem; margin-bottom:0.75rem; color:var(--text); }
  .ex-body { font-size:0.92rem; color:#cbd5e1; margin-bottom:1.25rem; line-height:1.75; }
  .ex-data-table { background:#111827; border:1px solid var(--border); border-radius:6px; padding:1rem 1.25rem; margin-bottom:1.25rem; font-family:'IBM Plex Mono',monospace; font-size:0.82rem; }
  .ex-data-table .row { display:flex; justify-content:space-between; padding:0.25rem 0; border-bottom:1px solid #1e2d3d; }
  .ex-data-table .row:last-child { border-bottom:none; }
  .ex-data-table .key { color:var(--muted); }
  .ex-data-table .val { color:var(--accent2); }
  .ex-questions { list-style:none; padding:0; }
  .ex-questions li { padding:0.5rem 0 0.5rem 1.5rem; position:relative; font-size:0.9rem; color:#cbd5e1; border-bottom:1px dashed #1e2d3d; }
  .ex-questions li:last-child { border-bottom:none; }
  .ex-questions li::before { content:attr(data-label); position:absolute; left:0; font-family:'IBM Plex Mono',monospace; font-size:0.75rem; color:var(--accent2); top:0.55rem; }
  .sol-panel { background:#0a1f0a; border:1px solid #166534; border-radius:8px; padding:1.5rem 2rem; margin-top:1rem; animation:fadeIn 0.3s ease; }
  .sol-panel h3 { font-family:'IBM Plex Mono',monospace; font-size:0.75rem; color:#86efac; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid #166534; }
  .sol-step { margin-bottom:1rem; padding:0.75rem 1rem; background:#0f2b0f; border-radius:6px; }
  .sol-step-label { font-family:'IBM Plex Mono',monospace; font-size:0.7rem; color:#86efac; text-transform:uppercase; margin-bottom:0.35rem; }
  .sol-step p { font-size:0.88rem; color:#d1fae5; line-height:1.6; }
  .sol-formula { font-family:'IBM Plex Mono',monospace; background:#071a07; border:1px solid #14532d; padding:0.6rem 1rem; border-radius:4px; font-size:0.82rem; color:#a7f3d0; margin:0.4rem 0; display:block; white-space:pre-wrap; }
  .sol-result { display:inline-block; background:#14532d; color:#ecfdf5; font-family:'IBM Plex Mono',monospace; font-size:0.85rem; padding:0.3rem 0.75rem; border-radius:4px; margin-top:0.3rem; font-weight:500; }
  .export-section { margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid var(--border); }
  .export-label { font-family:'IBM Plex Mono',monospace; font-size:0.65rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.6rem; }
  .export-btns { display:flex; gap:0.6rem; flex-wrap:wrap; }
  .source-badge { font-family:'IBM Plex Mono',monospace; font-size:0.65rem; color:var(--muted); margin-top:1.25rem; padding-top:0.75rem; border-top:1px solid var(--border); display:flex; align-items:center; gap:0.4rem; }
  .source-badge a { color:var(--accent); text-decoration:none; }
  .empty-state { text-align:center; padding:4rem 2rem; color:var(--muted); }
  .empty-state .icon { font-size:3rem; margin-bottom:1rem; }
  .empty-state h2 { font-family:'Playfair Display',serif; font-size:1.4rem; color:var(--text); margin-bottom:0.5rem; }
  .loading-ring { width:18px; height:18px; border:2px solid #1e3a5f; border-top-color:var(--accent); border-radius:50%; animation:spin 0.7s linear infinite; display:inline-block; }
  @keyframes spin { to{transform:rotate(360deg)} }
  .error-box { background:#1c0a0a; border:1px solid var(--danger); border-radius:6px; padding:0.75rem 1rem; color:#fca5a5; font-size:0.85rem; margin-bottom:1rem; }
  /* MODAL */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:1000; padding:1rem; animation:fadeIn 0.2s ease; }
  .modal { background:#0d1117; border:1px solid var(--latex-border); border-radius:10px; width:100%; max-width:800px; max-height:90vh; display:flex; flex-direction:column; overflow:hidden; }
  .modal-header { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.5rem; border-bottom:1px solid var(--latex-border); background:var(--latex-bg); }
  .modal-header h2 { font-family:'IBM Plex Mono',monospace; font-size:0.82rem; color:#c4b5fd; letter-spacing:0.06em; text-transform:uppercase; }
  .modal-tabs { display:flex; gap:0.5rem; padding:0.75rem 1.5rem; border-bottom:1px solid var(--border); background:#0d1117; }
  .modal-tab { font-family:'IBM Plex Mono',monospace; font-size:0.75rem; padding:0.35rem 0.9rem; border-radius:4px; border:1px solid var(--border); background:transparent; color:var(--muted); cursor:pointer; transition:all 0.15s; }
  .modal-tab.active { background:var(--latex-bg); border-color:var(--latex-border); color:#c4b5fd; }
  .modal-code { flex:1; overflow-y:auto; padding:1.25rem 1.5rem; font-family:'IBM Plex Mono',monospace; font-size:0.77rem; line-height:1.75; color:#e2e8f0; background:#0d1117; white-space:pre; }
  .modal-code .tc { color:#374151; }
  .modal-code .tk { color:#93c5fd; }
  .modal-code .tm { color:#fbbf24; }
  .modal-code .ta { color:#f9a8d4; }
  .modal-footer { display:flex; gap:0.75rem; padding:1rem 1.5rem; border-top:1px solid var(--border); background:#0d1117; align-items:center; }
  .btn-close { background:transparent; border:1px solid var(--border); color:var(--muted); border-radius:6px; padding:0.5rem 1rem; cursor:pointer; font-family:'IBM Plex Mono',monospace; font-size:0.78rem; transition:all 0.15s; }
  .btn-close:hover { border-color:var(--danger); color:#fca5a5; }
  .copy-ok { font-family:'IBM Plex Mono',monospace; font-size:0.75rem; color:var(--accent3); opacity:0; transition:opacity 0.3s; }
  .copy-ok.show { opacity:1; }

  /* CUSTOM EXERCISE */
  .custom-panel { background:var(--card); border:1px solid var(--border); border-radius:10px; padding:2rem 2.25rem; margin-bottom:1.5rem; animation:fadeIn 0.35s ease; }
  .custom-panel h2 { font-family:'Playfair Display',serif; font-size:1.3rem; color:var(--text); margin-bottom:0.5rem; }
  .custom-panel p.sub { color:var(--muted); font-size:0.88rem; font-style:italic; margin-bottom:1.5rem; }
  .custom-textarea { width:100%; background:#111827; border:1px solid var(--border); border-radius:6px; padding:1rem; color:var(--text); font-family:'Source Serif 4',Georgia,serif; font-size:0.92rem; line-height:1.7; resize:vertical; min-height:120px; outline:none; transition:border 0.15s; }
  .custom-textarea:focus { border-color:var(--accent); }
  .custom-textarea::placeholder { color:var(--muted); font-style:italic; }
  .clarif-box { background:#111827; border:1px solid var(--border); border-radius:8px; padding:1.5rem; margin-top:1.5rem; }
  .clarif-box h3 { font-family:'IBM Plex Mono',monospace; font-size:0.72rem; color:var(--accent2); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:1.25rem; }
  .clarif-row { margin-bottom:1.25rem; }
  .clarif-row label { display:block; font-size:0.88rem; color:var(--text); margin-bottom:0.5rem; font-weight:600; }
  .clarif-row .hint { font-size:0.78rem; color:var(--muted); font-style:italic; margin-bottom:0.5rem; display:block; }
  .clarif-opts { display:flex; flex-wrap:wrap; gap:0.4rem; }
  .clarif-opt { font-family:'IBM Plex Mono',monospace; font-size:0.75rem; padding:0.3rem 0.75rem; border-radius:4px; border:1px solid var(--border); background:transparent; color:var(--muted); cursor:pointer; transition:all 0.15s; }
  .clarif-opt:hover { border-color:var(--accent); color:var(--text); }
  .clarif-opt.sel { background:var(--tag-bg); border-color:var(--accent); color:var(--text); }
  .clarif-opt.sel-green { background:#14532d; border-color:#166534; color:#86efac; }
  .manual-input { width:100%; background:#0e1117; border:1px solid var(--border); border-radius:4px; padding:0.4rem 0.75rem; color:var(--text); font-family:'IBM Plex Mono',monospace; font-size:0.8rem; outline:none; margin-top:0.4rem; }
  .manual-input:focus { border-color:var(--accent); }
  .progress-bar { display:flex; gap:0.25rem; margin-bottom:1.5rem; }
  .progress-step { flex:1; height:3px; border-radius:2px; background:var(--border); transition:background 0.3s; }
  .progress-step.done { background:var(--accent3); }
  .progress-step.active { background:var(--accent); }
  .ai-thinking { display:flex; flex-direction:column; align-items:center; gap:1rem; padding:3rem 2rem; color:var(--muted); text-align:center; }
  .ai-thinking .ring-big { width:48px; height:48px; border:3px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin 0.9s linear infinite; }
  .ai-thinking p { font-size:0.88rem; font-style:italic; }
  .custom-ex-result { margin-top:1.5rem; }
  .custom-source-list { margin-top:0.75rem; }
  .custom-source-list li { font-family:'IBM Plex Mono',monospace; font-size:0.72rem; color:var(--muted); margin-bottom:0.2rem; list-style:disc; margin-left:1.2rem; }
  .custom-source-list li a { color:var(--accent); text-decoration:none; }
  .errors-panel { background:#1c0a20; border:1px solid #7c2d9e; border-radius:6px; padding:1rem 1.25rem; margin-top:0.75rem; }
  .errors-panel h4 { font-family:'IBM Plex Mono',monospace; font-size:0.7rem; color:#c084fc; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.5rem; }
  .errors-panel li { font-size:0.85rem; color:#e9d5ff; margin-bottom:0.3rem; margin-left:1.2rem; }
  .step-badge { display:inline-block; background:var(--tag-bg); color:var(--accent2); font-family:'IBM Plex Mono',monospace; font-size:0.65rem; padding:0.1rem 0.5rem; border-radius:3px; margin-right:0.5rem; text-transform:uppercase; }
`;

// ─── TOPICS ────────────────────────────────────────────────
const TOPICS = [
  { id:"t5_arbitraje_simple",     theme:"Tema 5", label:"Arbitraje Simple (dos plazas)",       emoji:"⚖️" },
  { id:"t5_arbitraje_triangular", theme:"Tema 5", label:"Arbitraje Triangular (tres divisas)", emoji:"🔺" },
  { id:"t5_arbitraje_crypto",     theme:"Tema 5", label:"Arbitraje con Criptomonedas",         emoji:"₿"  },
  { id:"t5_pci",                  theme:"Tema 5", label:"Paridad Cubierta de Intereses",       emoji:"🔒" },
  { id:"t5_pdi",                  theme:"Tema 5", label:"Paridad Descubierta de Intereses",    emoji:"📈" },
  { id:"t6_corto",                theme:"Tema 6", label:"Política Monetaria a C/P",            emoji:"🏦" },
  { id:"t6_ppa",                  theme:"Tema 6", label:"PPA y Tipo de Cambio L/P",            emoji:"📊" },
  { id:"t6_tipo_real",            theme:"Tema 6", label:"Tipo de Cambio Real",                 emoji:"📉" },
];

// ─── HELPERS ───────────────────────────────────────────────
function rand(min, max, dec=4) { return parseFloat((Math.random()*(max-min)+min).toFixed(dec)); }
function choose(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function fmtN(n,dec=4){ return n.toLocaleString("es-ES",{minimumFractionDigits:dec,maximumFractionDigits:dec}); }
function fmtK(n){ return n.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2}); }

// ─── LATEX ESCAPE ──────────────────────────────────────────
function esc(s){
  if(!s) return "";
  return s
    .replace(/&/g,"\\&").replace(/%/g,"\\%").replace(/#/g,"\\#")
    .replace(/\$/g,"\\$").replace(/_(?![{\\])/g,"\\_").replace(/\^(?![{\\])/g,"\\^{}")
    .replace(/~/g,"\\textasciitilde{}").replace(/→/g,"$\\rightarrow$")
    .replace(/↑/g,"$\\uparrow$").replace(/↓/g,"$\\downarrow$")
    .replace(/×/g,"$\\times$").replace(/÷/g,"$\\div$")
    .replace(/≈/g,"$\\approx$").replace(/≠/g,"$\\neq$")
    .replace(/≤/g,"$\\leq$").replace(/≥/g,"$\\geq$")
    .replace(/€/g,"\\euro{}").replace(/£/g,"\\pounds{}").replace(/¥/g,"\\yen{}")
    .replace(/…/g,"\\ldots").replace(/✓/g,"\\checkmark").replace(/✗/g,"$\\times$")
    .replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,(m)=>m==="\u201C"?"``":"''");
}
function fml(s){
  if(!s) return "";
  return s.split("\n").map(l=>esc(l)).join("\\\\\n");
}

// ─── LATEX DOCUMENT BUILDER ────────────────────────────────
function buildLatex(ex, withSolution, topicObj, ts){
  const tl = topicObj ? `${topicObj.theme}: ${topicObj.label}` : "Ejercicio";
  const preamble =
`\\documentclass[12pt,a4paper]{article}

% ── Paquetes ──────────────────────────────────────────
\\usepackage[utf8]{inputenc}
\\usepackage[spanish]{babel}
\\usepackage{geometry}
\\geometry{margin=2.5cm}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{eurosym}
\\usepackage{wasysym}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage{booktabs}
\\usepackage{array}
\\usepackage{hyperref}
\\usepackage{fancyhdr}
\\usepackage{tcolorbox}
\\tcbuselibrary{skins}

% ── Página ────────────────────────────────────────────
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{${esc(tl)}}
\\lhead{Ejercicios de Práctica}
\\cfoot{\\thepage}

% ── Colores ───────────────────────────────────────────
\\definecolor{contexto}{RGB}{230,250,240}
\\definecolor{solbg}{RGB}{240,255,240}
\\definecolor{darkgreen}{RGB}{0,100,50}

% ── Entornos ──────────────────────────────────────────
\\newenvironment{resol}{%
  \\begin{tcolorbox}[colback=solbg,colframe=darkgreen,
    title={\\textbf{\\textcolor{darkgreen}{Solución (Guía del Profesor)}}},
    fonttitle=\\bfseries,boxrule=0.8pt,arc=4pt]
}{\\end{tcolorbox}}

\\newenvironment{calc}{%
  \\begin{tcolorbox}[colback=white,colframe=darkgreen!50,
    boxrule=0.5pt,arc=3pt,left=6pt,right=6pt,top=4pt,bottom=4pt]
  \\ttfamily\\small
}{\\end{tcolorbox}}

\\newenvironment{conclu}{%
  \\medskip\\begin{tcolorbox}[colback=darkgreen!8,colframe=darkgreen,
    boxrule=0.6pt,arc=3pt]\\small\\bfseries
}{\\end{tcolorbox}}

\\setlist[enumerate]{leftmargin=*,labelsep=5mm}
\\setlist[itemize]{leftmargin=*,labelsep=3mm}

\\begin{document}

\\begin{center}
  {\\LARGE \\textbf{EJERCICIO DE PRÁCTICA}}\\\\[0.4cm]
  {\\Large \\textbf{${esc(tl).toUpperCase()}}}\\\\[0.2cm]
  {\\small \\textcolor{gray}{Generado con datos de mercado --- ${esc(ts)}}}
\\end{center}
\\vspace{0.5cm}
`;

  const ctx = ex.context
    ? `\\begin{tcolorbox}[colback=contexto,colframe=darkgreen!70!black,title=Contexto económico,fonttitle=\\bfseries]\n${esc(ex.context)}\n\\end{tcolorbox}\n\n`
    : "";

  const body =
`\\section*{${esc(ex.title)}}

${ctx}${esc(ex.body)}

\\vspace{0.4cm}

\\begin{center}
\\begin{tabular}{>{\\bfseries}l r}
\\toprule
\\multicolumn{2}{c}{\\textbf{Datos del mercado}} \\\\
\\midrule
${ex.dataRows.map(r=>`${esc(r.key)} & ${esc(r.val)} \\\\`).join("\n")}
\\bottomrule
\\end{tabular}
\\end{center}

\\vspace{0.5cm}

\\textbf{Se pide:}

\\begin{enumerate}[label=\\alph*)]
${ex.questions.map(q=>`  \\item ${esc(q.text)}`).join("\n")}
\\end{enumerate}
`;

  const src = ex.source
    ? `\n{\\footnotesize \\textit{${esc(ex.source.label)}. Enlace: \\url{${ex.source.url}}}}\n`
    : "";

  let sol = "";
  if(withSolution && ex.solution){
    const steps = ex.solution.steps.map((s,i)=>`
  \\subsection*{${i+1}. ${esc(s.label)}}
  ${s.text ? esc(s.text) : ""}
  ${s.formula ? `\\begin{calc}\n${fml(s.formula)}\n\\end{calc}` : ""}
  ${s.result ? `\\begin{conclu}\n${esc(s.result)}\n\\end{conclu}` : ""}
`).join("\n");
    sol = `\n\\newpage\n\\begin{resol}\n${steps}\n\\end{resol}\n`;
  }

  return preamble + body + src + sol + "\n\\end{document}";
}

// ─── DATA FETCH ────────────────────────────────────────────
async function fetchLiveData(){
  const d = { rates:{}, crypto:{}, timestamp: new Date().toLocaleString("es-ES") };
  try{ const r=await fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,GBP,JPY,CHF,SEK,NOK,KRW"); if(r.ok){const j=await r.json(); d.rates=j.rates; d.ratesDate=j.date;} }catch{}
  try{ const r=await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,eur"); if(r.ok){const j=await r.json(); d.crypto.btc_usd=j.bitcoin?.usd; d.crypto.btc_eur=j.bitcoin?.eur; d.crypto.eth_usd=j.ethereum?.usd; d.crypto.eth_eur=j.ethereum?.eur;} }catch{}
  return d;
}

// ─── GENERATORS ────────────────────────────────────────────
function genArbitrajeSimple(live){
  const base=live.rates.USD?1/live.rates.USD:1.08;
  const p=[{name:"Frankfurt (BCE)",rate:parseFloat((base*rand(0.995,1.000)).toFixed(4))},{name:"Nueva York (NY Fed)",rate:parseFloat((base*rand(1.000,1.006)).toFixed(4))}];
  const [lo,hi]=p[0].rate<p[1].rate?[p[0],p[1]]:[p[1],p[0]];
  const cap=choose([500000,1000000,2000000]);
  const usd=parseFloat((cap/lo.rate).toFixed(2));
  const eur=parseFloat((usd*hi.rate).toFixed(2));
  const ben=parseFloat((eur-cap).toFixed(2));
  const ren=parseFloat(((ben/cap)*100).toFixed(4));
  return {
    topicId:"t5_arbitraje_simple",
    context:`Datos en tiempo real del mercado de divisas (${live.ratesDate||"hoy"}). Las cotizaciones reflejan el tipo de cambio spot EUR/USD en distintas plazas financieras.`,
    title:"Arbitraje Simple EUR/USD entre Dos Plazas",
    body:"Un operador de divisas observa las siguientes cotizaciones spot del dólar en dos plazas financieras internacionales:",
    dataRows:[
      {key:`E€/$ en ${p[0].name}`,val:`${fmtN(p[0].rate,4)} €/$`},
      {key:`E€/$ en ${p[1].name}`,val:`${fmtN(p[1].rate,4)} €/$`},
      {key:"Capital disponible",val:`${fmtK(cap)} €`},
    ],
    questions:[
      {label:"a)",text:"¿Existe una oportunidad de arbitraje? Justifique comparando los tipos de cambio."},
      {label:"b)",text:"Si existe arbitraje, describa la secuencia exacta de operaciones a realizar."},
      {label:"c)",text:`Calcule el beneficio potencial con un capital de ${fmtK(cap)} €.`},
      {label:"d)",text:"¿Qué ocurrirá con ambos tipos de cambio como consecuencia del arbitraje masivo?"},
    ],
    solution:{steps:[
      {label:"Identificación del arbitraje",text:`E€/$ en ${lo.name} = ${fmtN(lo.rate,4)} < E€/$ en ${hi.name} = ${fmtN(hi.rate,4)}. El dólar es más barato en ${lo.name}. Existe oportunidad de arbitraje.`,formula:`E€/$ (${lo.name}) = ${fmtN(lo.rate,4)} < E€/$ (${hi.name}) = ${fmtN(hi.rate,4)}  → Arbitraje posible`},
      {label:"Secuencia de operaciones",text:`Comprar $ en ${lo.name} (más baratos) y vender en ${hi.name} (más caros).`,formula:`Paso 1: ${fmtK(cap)} € ÷ ${fmtN(lo.rate,4)} €/$ = ${fmtK(usd)} $\nPaso 2: ${fmtK(usd)} $ × ${fmtN(hi.rate,4)} €/$ = ${fmtK(eur)} €`},
      {label:"Beneficio y rentabilidad",text:"",formula:`Beneficio = ${fmtK(eur)} − ${fmtK(cap)} = ${fmtK(ben)} €\nRentabilidad = ${ren}%`,result:`Ganancia: ${fmtK(ben)} € (${ren}%)`},
      {label:"Efecto en los mercados",text:`El arbitraje masivo presionará al alza E€/$ en ${lo.name} y a la baja en ${hi.name}, hasta que se igualen.`,formula:`E€/$ (${lo.name}) ↑  y  E€/$ (${hi.name}) ↓  →  equilibrio: E€/$ (${lo.name}) = E€/$ (${hi.name})`},
    ]},
    source:{label:"Fuente: Frankfurter API (BCE)",url:"https://www.ecb.europa.eu/stats/policy_and_exchange_rates"},
  };
}

function genArbitrajeTriangular(live){
  const rU=live.rates.USD||1.08,rG=live.rates.GBP||0.86,rJ=live.rates.JPY||163,rC=live.rates.CHF||0.94;
  const sc=choose([
    {c1:"€",c2:"$",c3:"£",r12:1/rU,r23:rG/rU,r13:rG},
    {c1:"€",c2:"$",c3:"¥",r12:1/rU,r23:rJ/rU,r13:rJ},
    {c1:"€",c2:"$",c3:"CHF",r12:1/rU,r23:rC/rU,r13:rC},
  ]);
  const {c1,c2,c3}=sc;
  const cross=parseFloat((sc.r12*sc.r23).toFixed(4));
  const disc=rand(0.008,0.018,4);
  const quoted=parseFloat((cross*(1-disc)).toFixed(4));
  const cap=choose([100000,200000,500000]);
  const s2=parseFloat((cap*sc.r12).toFixed(4));
  const s3=parseFloat((s2*sc.r23).toFixed(4));
  const s4=parseFloat((s3/sc.r13).toFixed(4));
  const ben=parseFloat((s4-cap).toFixed(2));
  const ren=parseFloat(((ben/cap)*100).toFixed(4));
  return {
    topicId:"t5_arbitraje_triangular",
    context:`Cotizaciones en tiempo real del mercado interbancario (${live.ratesDate||"hoy"}). Los tipos cruzados se calculan usando el dólar como moneda vehicular.`,
    title:`Arbitraje Triangular ${c1}/${c2}/${c3}`,
    body:"Un banco de inversión observa las siguientes cotizaciones simultáneas en el mercado interbancario:",
    dataRows:[
      {key:`E${c2}/${c1} (directo)`,val:`${fmtN(sc.r12,4)} ${c2}/${c1}`},
      {key:`E${c3}/${c2} (cruzado vía ${c2})`,val:`${fmtN(sc.r23,4)} ${c3}/${c2}`},
      {key:`E${c3}/${c1} (directo cotizado)`,val:`${fmtN(quoted,4)} ${c3}/${c1}`},
      {key:"Capital inicial",val:`${fmtK(cap)} ${c1}`},
    ],
    questions:[
      {label:"a)",text:`Calcule el tipo cruzado E${c3}/${c1} implícito usando el ${c2} como moneda vehicular.`},
      {label:"b)",text:`Compare el tipo cruzado con el cotizado. ¿Existe oportunidad de arbitraje triangular?`},
      {label:"c)",text:`Describa la secuencia de operaciones y calcule el beneficio con ${fmtK(cap)} ${c1}.`},
      {label:"d)",text:"¿Por qué estas oportunidades desaparecen casi instantáneamente en los mercados modernos?"},
    ],
    solution:{steps:[
      {label:"Tipo cruzado implícito",text:`Usando el ${c2} como moneda vehicular:`,formula:`E${c3}/${c1} (cruzado) = E${c2}/${c1} × E${c3}/${c2}\n= ${fmtN(sc.r12,4)} × ${fmtN(sc.r23,4)}\n= ${fmtN(cross,4)} ${c3}/${c1}`},
      {label:"Detección del arbitraje",text:"Comparamos cruzado implícito vs cotizado:",formula:`E${c3}/${c1} cruzado = ${fmtN(cross,4)}\nE${c3}/${c1} cotizado = ${fmtN(quoted,4)}\n→ ${fmtN(quoted,4)} < ${fmtN(cross,4)} → ARBITRAJE POSIBLE`},
      {label:"Secuencia de operaciones",text:"",formula:`Paso 1: ${fmtK(cap)} ${c1} × ${fmtN(sc.r12,4)} = ${fmtN(s2,2)} ${c2}\nPaso 2: ${fmtN(s2,2)} ${c2} × ${fmtN(sc.r23,4)} = ${fmtN(s3,2)} ${c3}\nPaso 3: ${fmtN(s3,2)} ${c3} ÷ ${fmtN(sc.r13,4)} = ${fmtK(s4)} ${c1}`,result:`Beneficio: ${fmtK(ben)} ${c1} (${ren}%)`},
      {label:"Por qué desaparecen en la práctica",text:`Los algoritmos HFT detectan y ejecutan arbitrajes en microsegundos. Equilibrio: E${c3}/${c1} cotizado = E${c2}/${c1} × E${c3}/${c2}`,formula:`Equilibrio: E${c3}/${c1} (directo) = E${c2}/${c1} × E${c3}/${c2}  →  beneficio = 0`},
    ]},
    source:{label:"Fuente: Frankfurter API (BCE)",url:"https://www.ecb.europa.eu"},
  };
}

function genArbitrajeCrypto(live){
  const base=live.crypto.btc_usd||67500;
  const prem=rand(0.03,0.12,4);
  const e1=parseFloat(base.toFixed(0));
  const e2=parseFloat((base*(1+prem)).toFixed(0));
  const eu=live.rates.USD||1.08;
  const cap=choose([10000,25000,50000]);
  const btc=parseFloat((cap/(e1/eu)).toFixed(6));
  const usd=parseFloat((btc*e2).toFixed(2));
  const eur=parseFloat((usd/eu).toFixed(2));
  const ben=parseFloat((eur-cap).toFixed(2));
  const ren=parseFloat(((ben/cap)*100).toFixed(2));
  const exc=choose([
    {e1:"Binance (internacional)",e2:"Upbit (Corea del Sur)",prem:"Kimchi Premium"},
    {e1:"Binance",e2:"Bitfinex (Hong Kong)",prem:"Asia Premium"},
    {e1:"Coinbase (EE.UU.)",e2:"WazirX (India)",prem:"India Premium"},
  ]);
  return {
    topicId:"t5_arbitraje_crypto",
    context:`El fenómeno del "${exc.prem}" describe situaciones en que el Bitcoin cotiza a precios distintos en diferentes exchanges internacionales, generando oportunidades de arbitraje similares a las del mercado de divisas convencional.`,
    title:`Arbitraje con Bitcoin: ${exc.prem}`,
    body:`Un inversor europeo observa las siguientes cotizaciones del Bitcoin:`,
    dataRows:[
      {key:`BTC en ${exc.e1}`,val:`${fmtK(e1)} $/BTC`},
      {key:`BTC en ${exc.e2}`,val:`${fmtK(e2)} $/BTC`},
      {key:"Prima implícita",val:`+${(prem*100).toFixed(2)}%`},
      {key:"E€/$ (mercado)",val:`${fmtN(1/eu,4)} €/$`},
      {key:"Capital del inversor",val:`${fmtK(cap)} €`},
    ],
    questions:[
      {label:"a)",text:`Calcule el tipo de cambio cruzado E€/BTC en cada exchange.`},
      {label:"b)",text:"Identifique la oportunidad de arbitraje y explique la estrategia."},
      {label:"c)",text:`Ejecute la operación paso a paso con ${fmtK(cap)} € y calcule el beneficio bruto.`},
      {label:"d)",text:"¿Por qué este arbitraje persiste más tiempo que en el mercado de divisas? Mencione dos fricciones."},
    ],
    solution:{steps:[
      {label:"Tipos cruzados E€/BTC",text:"Convertimos el precio en $ a € usando el tipo EUR/USD:",formula:`E€/BTC (${exc.e1}) = ${fmtK(e1)} $ ÷ ${fmtN(eu,4)} $/€ = ${fmtK(e1/eu)} €/BTC\nE€/BTC (${exc.e2}) = ${fmtK(e2)} $ ÷ ${fmtN(eu,4)} $/€ = ${fmtK(e2/eu)} €/BTC`},
      {label:"Identificación del arbitraje",text:`${exc.e1} ofrece Bitcoin más barato. Estrategia: comprar en ${exc.e1} y vender en ${exc.e2}.`,formula:`Prima = (${fmtK(e2)} − ${fmtK(e1)}) / ${fmtK(e1)} = ${(prem*100).toFixed(2)}%`},
      {label:"Ejecución del arbitraje",text:"",formula:`Paso 1: ${fmtK(cap)} € × ${fmtN(eu,4)} = ${fmtK(cap*eu)} $\nPaso 2: ${fmtK(cap*eu)} $ ÷ ${fmtK(e1)} = ${btc} BTC\nPaso 3: ${btc} BTC × ${fmtK(e2)} = ${fmtK(usd)} $\nPaso 4: ${fmtK(usd)} $ ÷ ${fmtN(eu,4)} = ${fmtK(eur)} €`,result:`Beneficio bruto: ${fmtK(ben)} € (${ren}%) — antes de comisiones`},
      {label:"Fricciones de mercado",text:"1) Controles de capital impiden mover fondos libremente entre exchanges. 2) Tiempos de confirmación blockchain (10-60 min) crean riesgo de precio en tránsito. 3) Límites KYC/AML en exchanges asiáticos.",formula:`Beneficio real ≈ Beneficio bruto − Comisiones (0.1-0.5%) − Costes transferencia − Riesgo precio`},
    ]},
    source:{label:"Fuente: CoinGecko API + Frankfurter API",url:"https://www.coingecko.com"},
  };
}

function genPCI(live){
  const eu=1/(live.rates.USD||1.08);
  const rE=rand(2.5,4.5,2), rU=rand(4.0,5.5,2);
  const cap=choose([100000,500000,1000000]);
  const pl=choose([3,6,12]);
  const fE=rE/100*(pl/12), fU=rU/100*(pl/12);
  const fwd=parseFloat((eu*(1+fE)/(1+fU)).toFixed(4));
  const rdE=parseFloat((cap*fE).toFixed(2));
  const rdU=parseFloat((cap/eu*(1+fU)*fwd-cap).toFixed(2));
  return {
    topicId:"t5_pci",
    context:`La PCI garantiza la neutralidad entre depósitos en distintas divisas cuando se usa cobertura forward. Es la condición de no-arbitraje fundamental del mercado de divisas.`,
    title:`Paridad Cubierta de Intereses EUR/USD (${pl} meses)`,
    body:`Un gestor de activos europeo evalúa si es más rentable mantener un depósito en euros o en dólares con cobertura forward durante ${pl} meses.`,
    dataRows:[
      {key:"E$/€ spot actual",val:`${fmtN(1/eu,4)} $/€`},
      {key:"Tipo de interés anual (€)",val:`${rE}%`},
      {key:"Tipo de interés anual ($)",val:`${rU}%`},
      {key:"Plazo",val:`${pl} meses`},
      {key:"Capital",val:`${fmtK(cap)} €`},
    ],
    questions:[
      {label:"a)",text:`Calcule el tipo forward F€/$ a ${pl} meses aplicando la condición PCI.`},
      {label:"b)",text:`¿Cotiza el dólar a prima o a descuento a plazo? Calcule el porcentaje.`},
      {label:"c)",text:`Compare el rendimiento de un depósito en € vs. uno en $ con cobertura forward, con ${fmtK(cap)} €.`},
      {label:"d)",text:"¿Qué ocurriría si el tipo forward cotizado difiriese del calculado por la PCI? Explique el mecanismo de arbitraje."},
    ],
    solution:{steps:[
      {label:"Cálculo del tipo forward por PCI",text:"Aplicamos la fórmula de la PCI:",formula:`F€/$ = E€/$ × (1 + R€ × t) / (1 + R$ × t)\n= ${fmtN(eu,4)} × (1 + ${rE}/100 × ${pl}/12) / (1 + ${rU}/100 × ${pl}/12)\n= ${fmtN(eu,4)} × ${fmtN(1+fE,6)} / ${fmtN(1+fU,6)}\n= ${fmtN(fwd,4)} €/$`},
      {label:"Prima/descuento a plazo",text:`Como F€/$ ${fwd>eu?">":" <"} E€/$, el dólar está a ${fwd>eu?"PRIMA":"DESCUENTO"}:`,formula:`Prima/descuento = (F€/$ − E€/$) / E€/$ = (${fmtN(fwd,4)} − ${fmtN(eu,4)}) / ${fmtN(eu,4)}\n= ${((fwd-eu)/eu*100).toFixed(4)}%`},
      {label:"Equivalencia de rendimientos",text:`Con ${fmtK(cap)} € durante ${pl} meses:`,formula:`Depósito en € → +${fmtK(rdE)} €\nDepósito en $ con forward → +${fmtK(rdU)} €\n→ Diferencia ≈ 0 (PCI se cumple)`,result:"Los rendimientos son equivalentes bajo PCI: no hay arbitraje posible"},
      {label:"Arbitraje si PCI no se cumple",text:"Si F cotizado ≠ F PCI: pedir prestado en la divisa más barata e invertir en la más cara con cobertura forward, hasta que F cotizado = F PCI.",formula:`Beneficio arbitraje = Capital × |F cotizado − F PCI| / F PCI`},
    ]},
    source:{label:"Fuente: BCE (tipos referencia) + Frankfurter API",url:"https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates"},
  };
}

function genPDI(live){
  const eu=1/(live.rates.USD||1.08);
  const rE=rand(2.5,4.5,2), rU=rand(4.0,5.5,2);
  const diff=rU-rE;
  const Ee=parseFloat((eu*(1+rE/100)/(1+rU/100)).toFixed(4));
  const cap=choose([100000,500000]);
  return {
    topicId:"t5_pdi",
    context:`La PDI determina la cotización actual del tipo de cambio a partir de las expectativas sobre su evolución futura. Es la condición de equilibrio fundamental del mercado de divisas sin cobertura.`,
    title:"Paridad Descubierta de Intereses y Tipo de Cambio Esperado",
    body:`Un inversor europeo analiza la condición de PDI entre el euro y el dólar.`,
    dataRows:[
      {key:"E€/$ spot actual",val:`${fmtN(eu,4)} €/$`},
      {key:"R€ (tipo de interés anual)",val:`${rE}%`},
      {key:"R$ (tipo de interés anual)",val:`${rU}%`},
      {key:"Diferencial R$ − R€",val:`${diff.toFixed(2)} p.p.`},
      {key:"Capital",val:`${fmtK(cap)} €`},
    ],
    questions:[
      {label:"a)",text:"Explique la lógica de la PDI. ¿Por qué tipos de interés más altos no implican mayor rentabilidad en esa divisa?"},
      {label:"b)",text:`Dado que R$ > R€ en ${diff.toFixed(2)} p.p., ¿qué debe ocurrir con E^e€/$? Calcule el tipo de cambio esperado.`},
      {label:"c)",text:`Si E^e€/$ = ${fmtN(Ee*1.02,4)} €/$ (mayor que el implícito por PDI), ¿cuál sería la estrategia óptima? Calcule los rendimientos.`},
      {label:"d)",text:"¿Por qué la PDI puede no cumplirse en periodos de turbulencia financiera o con controles de capital?"},
    ],
    solution:{steps:[
      {label:"Lógica de la PDI",text:"Si R$ > R€, los inversores compran $, apreciando el $ hoy. La mayor demanda de $ sube E^e€/$ ($ se deprecia en el futuro). En equilibrio, ambas fuerzas se cancelan.",formula:`PDI: (1 + R€) = (1 + R$) × (E^e€/$ / E€/$)`},
      {label:"Tipo de cambio esperado implícito",text:"Despejamos E^e€/$:",formula:`E^e€/$ = E€/$ × (1 + R€) / (1 + R$)\n= ${fmtN(eu,4)} × (1 + ${rE/100}) / (1 + ${rU/100})\n= ${fmtN(Ee,4)} €/$`,result:`E^e€/$ = ${fmtN(Ee,4)} €/$ → el $ se deprecia un ${diff.toFixed(2)}% (compensa el diferencial de tipos)`},
      {label:"Estrategia si E^e ≠ PDI",text:`Si E^e€/$ = ${fmtN(Ee*1.02,4)} > ${fmtN(Ee,4)} (PDI), el $ se deprecia MENOS → conviene invertir en $:`,formula:`Rdto en € (depósito €): ${cap} × ${rE/100} = +${fmtK(cap*rE/100)} €\nRdto en $ (sin cobertura) > Rdto €  →  Estrategia: invertir en dólares`},
      {label:"Límites de la PDI",text:"La PDI puede fallar por: aversión al riesgo cambiario (prima de riesgo), controles de capital, asimetría de información, carry trade especulativo.",formula:`PDI con prima: (1 + R€) = (1 + R$) × (E^e€/$ / E€/$) + ρ`},
    ]},
    source:{label:"Fuente: BCE + Fed (tipos oficiales)",url:"https://www.ecb.europa.eu"},
  };
}

function genPoliticaMonetaria(live){
  const r0=rand(3.0,5.0,2), r1=rand(1.5,3.5,2);
  const eu0=1/(live.rates.USD||1.08);
  const eu1=parseFloat((eu0*(1-(r0-r1)/100*1.5)).toFixed(4));
  const m0=rand(12,16,1), m1=parseFloat((m0*(1+rand(0.05,0.15,3))).toFixed(1));
  const rF=rand(4.0,5.5,2);
  return {
    topicId:"t6_corto",
    context:`El BCE ajusta sus tipos de interés, afectando a la oferta monetaria y al tipo de cambio del euro. A corto plazo los precios son rígidos (P fijo), por lo que la política monetaria opera a través de los tipos de interés.`,
    title:"Efecto de un Cambio en la Política Monetaria del BCE sobre el EUR/USD",
    body:`El BCE anuncia una reducción de su tipo de interés de referencia. Analice el impacto sobre el tipo de cambio EUR/USD a corto plazo.`,
    dataRows:[
      {key:"Tipo BCE (inicial)",val:`${r0}%`},
      {key:"Tipo BCE (nuevo)",val:`${r1}%`},
      {key:"Tipo Fed (sin cambios)",val:`${rF}%`},
      {key:"E$/€ inicial",val:`${fmtN(1/eu0,4)} $/€`},
      {key:"M3 inicial (Eurozona)",val:`${m0} billones €`},
      {key:"M3 nuevo (tras expansión)",val:`${m1} billones €`},
    ],
    questions:[
      {label:"a)",text:"¿Cómo afecta la bajada de tipos al mercado de dinero (oferta y demanda de liquidez real)?"},
      {label:"b)",text:"A través de la PDI, explique por qué la bajada de tipos provoca una depreciación del euro."},
      {label:"c)",text:"Describa el desplazamiento en el diagrama de oferta/demanda de dinero real y el efecto en el mercado de divisas."},
      {label:"d)",text:"¿Por qué el efecto a largo plazo puede ser diferente al de corto plazo? Mencione las expectativas de inflación y el overshooting."},
    ],
    solution:{steps:[
      {label:"Mecanismo de transmisión (mercado de dinero)",text:`Bajada de tipos BCE: R€ ${r0}% → ${r1}%. Con P fijo a c/p, M^S/P sube → curva de oferta de liquidez real se desplaza a la derecha → R€ baja.`,formula:`M^S↑ → M^S/P↑ (P fijo a c/p) → R€↓ (de ${r0}% a ${r1}%)`},
      {label:"Efecto sobre E vía PDI",text:"Si R€ baja y R$ permanece igual, los depósitos en € son menos atractivos → los inversores venden € y compran $ → el € se deprecia:",formula:`PDI: R€ = R$ + (E^e$/€ − E$/€) / E$/€\nSi R€↓ y E^e fijo → E$/€ debe bajar (el $ se aprecia)\nE$/€ inicial = ${fmtN(1/eu0,4)} → E$/€ nuevo ≈ ${fmtN(1/eu1,4)} $/€`},
      {label:"Descripción gráfica",text:"Diagrama 1 (Mercado de dinero): M^S/P se desplaza a la DERECHA → R€ baja. Diagrama 2 (Mercado de divisas): La curva de rentabilidad en € se desplaza hacia abajo → E$/€ baja (depreciación del €).",formula:`R€↓ → Rentabilidad €↓ → Demanda de €↓ → E$/€↓ (depreciación del €)`},
      {label:"Diferencia C/P vs L/P",text:"A largo plazo, la expansión monetaria genera inflación (P sube). La PPA implica depreciación permanente proporcional. Efecto Overshooting (Dornbusch): a c/p E cae MÁS que en el l/p, luego se aprecia parcialmente.",formula:`L/P: ΔM^S → ΔP (PPA) → ΔE proporcional\nOvershooting (Dornbusch): a c/p E cae MÁS → luego converge al valor de l/p`},
    ]},
    source:{label:"Fuente: BCE (M3, tipos de referencia)",url:"https://www.ecb.europa.eu/stats"},
  };
}

function genPPA(live){
  const eu=1/(live.rates.USD||1.08);
  const iE=rand(1.5,4.5,1), iU=rand(2.0,5.5,1);
  const diff=iU-iE;
  const anos=choose([1,2,5]);
  const Eppa=parseFloat((eu*Math.pow((1+iU/100)/(1+iE/100),anos)).toFixed(4));
  return {
    topicId:"t6_ppa",
    context:`La PPA relaciona los tipos de cambio con los diferenciales de inflación entre países. Es la principal teoría del tipo de cambio a largo plazo y la base del modelo monetario del tipo de cambio.`,
    title:"PPA Relativa y Predicción del Tipo de Cambio EUR/USD",
    body:`Utilice la PPA relativa para predecir la evolución del tipo de cambio EUR/USD a partir de los diferenciales de inflación.`,
    dataRows:[
      {key:"E€/$ spot actual (BCE)",val:`${fmtN(eu,4)} €/$`},
      {key:"Inflación esperada Eurozona (π€)",val:`${iE}% anual`},
      {key:"Inflación esperada EE.UU. (π$)",val:`${iU}% anual`},
      {key:"Diferencial (π$ − π€)",val:`${diff.toFixed(1)} p.p.`},
      {key:"Horizonte temporal",val:`${anos} año${anos>1?"s":""}`},
    ],
    questions:[
      {label:"a)",text:"Enuncie la PPA relativa. ¿Qué predice sobre el tipo de cambio cuando la inflación difiere entre países?"},
      {label:"b)",text:`Calcule el tipo de cambio E€/$ predicho por la PPA relativa dentro de ${anos} año${anos>1?"s":""}.`},
      {label:"c)",text:`¿Se aprecia o deprecia el euro? Calcule la variación porcentual acumulada del tipo de cambio.`},
      {label:"d)",text:"Explique dos razones por las que la PPA falla a corto plazo y mencione evidencia empírica relevante."},
    ],
    solution:{steps:[
      {label:"PPA relativa (enunciado y fórmula)",text:"La PPA relativa establece que el tipo de cambio varía proporcionalmente al diferencial de inflación:",formula:`ΔE€/$ / E€/$ ≈ π$ − π€\nForma exacta: E€/$,t = E€/$,0 × [(1 + π$)/(1 + π€)]^t`},
      {label:"Predicción del tipo de cambio",text:`Aplicando la PPA relativa a ${anos} año${anos>1?"s":""}:`,formula:`E€/$ (PPA) = ${fmtN(eu,4)} × [(1 + ${iU}/100) / (1 + ${iE}/100)]^${anos}\n= ${fmtN(eu,4)} × ${fmtN(Math.pow((1+iU/100)/(1+iE/100),anos),6)}\n= ${fmtN(Eppa,4)} €/$`,result:`Predicción PPA: E€/$ = ${fmtN(Eppa,4)} €/$ en ${anos} año${anos>1?"s":""}`},
      {label:"Dirección del ajuste cambiario",text:`Como π$ (${iU}%) ${iU>iE?">":" <"} π€ (${iE}%), el dólar ${iU>iE?"se deprecia":"se aprecia"}:`,formula:`ΔE€/$ = (${fmtN(Eppa,4)} − ${fmtN(eu,4)}) / ${fmtN(eu,4)} × 100\n= ${(((Eppa-eu)/eu)*100).toFixed(2)}%`},
      {label:"Limitaciones de la PPA",text:"1) Bienes no comerciables (Efecto Balassa-Samuelson). 2) Barreras comerciales y costes de transporte. 3) A c/p dominan factores financieros. Evidencia: Big Mac Index muestra desviaciones de ±30-40%.",formula:`TCR: q = E€/$ × P$ / P€\nPPA implica q = 1 constante a l/p`},
    ]},
    source:{label:"Fuente: Eurostat (HICP) + BLS (CPI) + Frankfurter API",url:"https://ec.europa.eu/eurostat"},
  };
}

function genTipoCambioReal(live){
  const eu=1/(live.rates.USD||1.08);
  const PE=rand(108,130,1), PU=rand(115,145,1);
  const q=parseFloat((eu*PU/PE).toFixed(4));
  const a=3, iE=rand(2,5,1), iU=rand(3,6,1), dE=rand(-0.05,0.05,4);
  const PE2=parseFloat((PE*Math.pow(1+iE/100,a)).toFixed(1));
  const PU2=parseFloat((PU*Math.pow(1+iU/100,a)).toFixed(1));
  const eu2=parseFloat((eu*(1+dE)).toFixed(4));
  const q2=parseFloat((eu2*PU2/PE2).toFixed(4));
  return {
    topicId:"t6_tipo_real",
    context:`El tipo de cambio real (TCR) mide la competitividad exterior de una economía, corrigiendo el tipo nominal por el diferencial de precios. Es variable clave para el análisis de la balanza por cuenta corriente.`,
    title:"Tipo de Cambio Real EUR/USD y Competitividad de la Eurozona",
    body:`Analice la evolución del tipo de cambio real entre la Eurozona y EE.UU. utilizando índices de precios oficiales.`,
    dataRows:[
      {key:"E€/$ nominal actual",val:`${fmtN(eu,4)} €/$`},
      {key:"IPC Eurozona (base 2015=100)",val:`${PE}`},
      {key:"IPC EE.UU. (base 2015=100)",val:`${PU}`},
      {key:`Inflación media Eurozona (${a}a)`,val:`${iE}%`},
      {key:`Inflación media EE.UU. (${a}a)`,val:`${iU}%`},
      {key:`Variación E€/$ nominal (${a}a)`,val:`${(dE*100).toFixed(2)}%`},
    ],
    questions:[
      {label:"a)",text:"Defina el tipo de cambio real (TCR) y explique su interpretación en términos de competitividad."},
      {label:"b)",text:"Calcule el TCR actual entre Eurozona y EE.UU. ¿Está el euro sobrevaluado o infravaluado en términos reales?"},
      {label:"c)",text:`Calcule el TCR dentro de ${a} años con las tasas dadas. ¿Mejora o empeora la competitividad de la Eurozona?`},
      {label:"d)",text:"¿Cómo afecta una apreciación real del euro a las exportaciones e importaciones? Explique el mecanismo de ajuste."},
    ],
    solution:{steps:[
      {label:"Definición del TCR",text:"El TCR ajusta el tipo nominal por el diferencial de precios:",formula:`q€/$ = E€/$ × (P$ / P€)\nSi q > 1: dólar relativamente caro → euro sobrevaluado en términos reales`},
      {label:"Cálculo del TCR actual",text:"",formula:`q€/$ = ${fmtN(eu,4)} × ${PU} / ${PE}\n= ${fmtN(eu,4)} × ${fmtN(PU/PE,4)}\n= ${fmtN(q,4)}`,result:`TCR = ${fmtN(q,4)} → ${q>1?"q > 1: euro SOBREVALUADO en términos reales":"q < 1: euro INFRAVALORADO en términos reales"}`},
      {label:`TCR proyectado en ${a} años`,text:"Con las tasas dadas:",formula:`IPC Eurozona t+${a}: ${PE} × (1+${iE/100})^${a} = ${PE2}\nIPC EE.UU. t+${a}: ${PU} × (1+${iU/100})^${a} = ${PU2}\nE€/$ t+${a}: ${fmtN(eu,4)} × (1+${dE.toFixed(4)}) = ${fmtN(eu2,4)}\nq t+${a} = ${fmtN(eu2,4)} × ${PU2} / ${PE2} = ${fmtN(q2,4)}`,result:`Variación TCR = ${(((q2-q)/q)*100).toFixed(2)}% → ${q2>q?"Apreciación real: PIERDE competitividad":"Depreciación real: GANA competitividad"}`},
      {label:"Mecanismo de ajuste",text:"Si el euro se aprecia en términos reales: (1) Exportaciones caen (menos competitivas en precio). (2) Importaciones aumentan (extranjero más barato). Resultado: deterioro de la balanza comercial → presión depreciadora sobre el euro.",formula:`q↑ → Exportaciones↓, Importaciones↑ → BC deteriora → presión bajista sobre E€/$`},
    ]},
    source:{label:"Fuente: Eurostat (HICP) + BLS (CPI) + Frankfurter API",url:"https://ec.europa.eu/eurostat"},
  };
}

const GENERATORS = {
  t5_arbitraje_simple: genArbitrajeSimple,
  t5_arbitraje_triangular: genArbitrajeTriangular,
  t5_arbitraje_crypto: genArbitrajeCrypto,
  t5_pci: genPCI,
  t5_pdi: genPDI,
  t6_corto: genPoliticaMonetaria,
  t6_ppa: genPPA,
  t6_tipo_real: genTipoCambioReal,
};

// ─── LATEX MODAL COMPONENT ────────────────────────────────
function LatexModal({ ex, topicObj, ts, onClose }) {
  const [tab, setTab] = React.useState("alumno");
  const [copied, setCopied] = React.useState(false);
  const textareaRef = React.useRef(null);

  const code = buildLatex(ex, tab === "profesor", topicObj, ts);

  const copy = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      textareaRef.current.setSelectionRange(0, 99999);
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch(err) {}
    }
  };

  const dataUri = "data:text/plain;charset=utf-8," + encodeURIComponent(code);
  const filename = ex.topicId + "_" + tab + ".tex";

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>Exportar LaTeX -- {ex.title.slice(0, 45)}{ex.title.length > 45 ? "..." : ""}</h2>
          <button className="btn-close" onClick={onClose}>x Cerrar</button>
        </div>

        <div className="modal-tabs">
          <button className={"modal-tab " + (tab === "alumno" ? "active" : "")} onClick={() => setTab("alumno")}>
            Version Alumno (sin solucion)
          </button>
          <button className={"modal-tab " + (tab === "profesor" ? "active" : "")} onClick={() => setTab("profesor")}>
            Version Profesor (con solucion)
          </button>
        </div>

        <textarea
          ref={textareaRef}
          readOnly
          value={code}
          onClick={e => e.target.select()}
          style={{
            flex: 1,
            overflow: "auto",
            padding: "1.25rem 1.5rem",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.77rem",
            lineHeight: "1.75",
            color: "#e2e8f0",
            background: "#0d1117",
            border: "none",
            outline: "none",
            resize: "none",
            minHeight: "340px",
            width: "100%",
            whiteSpace: "pre",
          }}
        />

        <div className="modal-footer">
          <button className="btn btn-latex" onClick={copy}>
            Copiar codigo
          </button>
          <a
            href={dataUri}
            download={filename}
            className="btn btn-primary"
            style={{ textDecoration: "none" }}
          >
            Descargar .tex
          </a>
          <span style={{ fontFamily: "IBM Plex Mono,monospace", fontSize: "0.75rem", color: "var(--accent3)", opacity: copied ? 1 : 0, transition: "opacity 0.3s" }}>
            Copiado al portapapeles
          </span>
        </div>
      </div>
    </div>
  );
}


// ─── LATEX BUILDER FOR CUSTOM EXERCISE ───────────────────
function buildLatexCustom(ex, withSolution, ts) {
  const tl = ex.topicLabel || "Ejercicio Personalizado";
  const preamble =
`\\documentclass[12pt,a4paper]{article}

% ── Paquetes ──────────────────────────────────────────
\\usepackage[utf8]{inputenc}
\\usepackage[spanish]{babel}
\\usepackage{geometry}
\\geometry{margin=2.5cm}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{eurosym}
\\usepackage{wasysym}
\\usepackage{xcolor}
\\usepackage{enumitem}
\\usepackage{booktabs}
\\usepackage{array}
\\usepackage{hyperref}
\\usepackage{fancyhdr}
\\usepackage{tcolorbox}
\\tcbuselibrary{skins}

% ── Pagina ────────────────────────────────────────────
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{${esc(tl)}}
\\lhead{Ejercicio Personalizado}
\\cfoot{\\thepage}

% ── Colores ───────────────────────────────────────────
\\definecolor{contexto}{RGB}{230,250,240}
\\definecolor{solbg}{RGB}{240,255,240}
\\definecolor{darkgreen}{RGB}{0,100,50}

% ── Entornos ──────────────────────────────────────────
\\newenvironment{resol}{%
  \\begin{tcolorbox}[colback=solbg,colframe=darkgreen,
    title={\\textbf{\\textcolor{darkgreen}{Solucion (Guia del Profesor)}}},
    fonttitle=\\bfseries,boxrule=0.8pt,arc=4pt]
}{\\end{tcolorbox}}

\\newenvironment{calc}{%
  \\begin{tcolorbox}[colback=white,colframe=darkgreen!50,
    boxrule=0.5pt,arc=3pt,left=6pt,right=6pt,top=4pt,bottom=4pt]
  \\ttfamily\\small
}{\\end{tcolorbox}}

\\newenvironment{conclu}{%
  \\medskip\\begin{tcolorbox}[colback=darkgreen!8,colframe=darkgreen,
    boxrule=0.6pt,arc=3pt]\\small\\bfseries
}{\\end{tcolorbox}}

\\setlist[enumerate]{leftmargin=*,labelsep=5mm}
\\setlist[itemize]{leftmargin=*,labelsep=3mm}

\\begin{document}

\\begin{center}
  {\\LARGE \\textbf{EJERCICIO PERSONALIZADO}}\\\\[0.4cm]
  {\\Large \\textbf{${esc(tl).toUpperCase()}}}\\\\[0.2cm]
  {\\small \\textcolor{gray}{Generado con IA y datos oficiales --- ${esc(ts)}}}
\\end{center}
\\vspace{0.5cm}
`;

  const ctx = ex.context
    ? `\\begin{tcolorbox}[colback=contexto,colframe=darkgreen!70!black,title=Contexto economico,fonttitle=\\bfseries]\n${esc(ex.context)}\n\\end{tcolorbox}\n\n`
    : "";

  const dataTable = ex.dataRows && ex.dataRows.length > 0
    ? `\\begin{center}\n\\begin{tabular}{>{\\bfseries}l r}\n\\toprule\n\\multicolumn{2}{c}{\\textbf{Datos del ejercicio}} \\\\\n\\midrule\n${ex.dataRows.map(r => `${esc(r.key)} & ${esc(r.val)} \\\\`).join("\n")}\n\\bottomrule\n\\end{tabular}\n\\end{center}\n\n`
    : "";

  const body =
`\\section*{${esc(ex.title)}}

${ctx}${esc(ex.body)}

\\vspace{0.4cm}

${dataTable}\\textbf{Se pide:}

\\begin{enumerate}[label=\\alph*)]
${ex.questions.map(q => `  \\item ${esc(q.text)}`).join("\n")}
\\end{enumerate}
`;

  let sol = "";
  if (withSolution && ex.solution) {
    const steps = ex.solution.steps.map((s, i) => `
  \\subsection*{${i+1}. ${esc(s.label)}}
  ${s.text ? esc(s.text) : ""}
  ${s.formula ? `\\begin{calc}\n${s.formula.split("\n").map(l => esc(l)).join("\\\\\n")}\n\\end{calc}` : ""}
  ${s.result ? `\\begin{conclu}\n${esc(s.result)}\n\\end{conclu}` : ""}
  ${s.commonErrors ? `\\medskip\\textbf{\\textcolor{purple}{Errores frecuentes:}} ${esc(s.commonErrors)}` : ""}
`).join("\n");
    sol = `\n\\newpage\n\\begin{resol}\n${steps}\n\\end{resol}\n`;
  }

  const sources = ex.sources && ex.sources.length > 0
    ? `\n\\vspace{0.4cm}\n\\noindent\\textbf{Fuentes:} \\begin{itemize}\n${ex.sources.map(s => `  \\item ${esc(s.label)}: \\url{${s.url}}`).join("\n")}\n\\end{itemize}\n`
    : "";

  return preamble + body + sources + sol + "\n\\end{document}";
}

// ─── CLARIFICATION CONFIG ─────────────────────────────────
const CLARIF_QUESTIONS = [
  {
    id: "tematicas",
    label: "Tematicas a combinar en el ejercicio",
    hint: "Puedes seleccionar varias para crear un ejercicio que las integre.",
    type: "multi",
    options: [
      "Arbitraje simple (dos plazas)",
      "Arbitraje triangular",
      "Arbitraje con criptomonedas",
      "Paridad Cubierta de Intereses (PCI)",
      "Paridad Descubierta de Intereses (PDI)",
      "Politica monetaria a c/p (BCE/Fed)",
      "Paridad del Poder Adquisitivo (PPA)",
      "Tipo de Cambio Real (TCR)"
    ]
  },
  {
    id: "dificultad",
    label: "Nivel de dificultad",
    hint: "Avanzado incluye preguntas de analisis critico y limitaciones teoricas.",
    type: "single",
    options: ["Basico (calculos directos)", "Intermedio (varios pasos)", "Avanzado (multitematico + reflexion critica)"]
  },
  {
    id: "activos",
    label: "Divisas o activos involucrados",
    hint: "Selecciona los pares o activos que deben aparecer en los datos.",
    type: "multi",
    options: ["EUR/USD", "EUR/GBP", "EUR/JPY", "EUR/CHF", "USD/TRY (lira)", "BTC/USD", "ETH/USD", "S&P 500 / indices"]
  },
  {
    id: "horizonte",
    label: "Horizonte temporal",
    hint: "El horizonte define si usamos modelos de c/p (rigidez de precios) o l/p (PPA, TCR).",
    type: "single",
    options: ["Corto plazo (dias / semanas)", "Medio plazo (3-12 meses)", "Largo plazo (1-5 anos)", "Mixto (c/p y l/p en el mismo ejercicio)"]
  },
  {
    id: "tipoTC",
    label: "Convencion del tipo de cambio",
    hint: "Ejemplo directo: 1 EUR = 1,08 USD (cuantos USD por 1 EUR). Ejemplo indirecto: 1 USD = 0,93 EUR (cuantos EUR por 1 USD).",
    type: "single",
    options: [
      "Directo: precio del extranjero en moneda nacional (ej: 1 USD = 0,93 EUR)",
      "Indirecto: precio de la moneda nacional en extranjera (ej: 1 EUR = 1,08 USD)",
      "Indistinto / que la IA elija el mas pedagogico"
    ]
  },
  {
    id: "datos",
    label: "Fuente y tipo de datos",
    hint: "Los datos historicos deben especificarse en el contexto (fecha, evento). Los datos manuales se introducen abajo.",
    type: "multi",
    options: [
      "Datos en tiempo real (BCE / CoinGecko)",
      "Datos historicos del evento descrito",
      "Datos introducidos manualmente por el profesor",
      "Mezcla: reales + ajustes del profesor"
    ]
  }
];

// ─── CUSTOM EXERCISE COMPONENT ────────────────────────────
function CustomExercise({ liveData }) {
  const [step, setStep] = React.useState(1); // 1=context, 2=clarif, 3=generating, 4=result
  const [contextText, setContextText] = React.useState("");
  const [clarif, setClarif] = React.useState({});
  const [manualData, setManualData] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [showSol, setShowSol] = React.useState(false);
  const [showLatexModal, setShowLatexModal] = React.useState(false);
  const [latexTab, setLatexTab] = React.useState("alumno");
  const [copied, setCopied] = React.useState(false);
  const textareaRef = React.useRef(null);
  const [error, setError] = React.useState(null);

  const toggleClarif = (qid, opt, isSingle) => {
    setClarif(prev => {
      const cur = prev[qid] || [];
      if (isSingle) return { ...prev, [qid]: [opt] };
      if (cur.includes(opt)) return { ...prev, [qid]: cur.filter(x => x !== opt) };
      return { ...prev, [qid]: [...cur, opt] };
    });
  };

  const buildPrompt = () => {
    const rates = liveData.rates;
    const crypto = liveData.crypto;
    const liveStr = [
      rates.USD ? `EUR/USD spot: ${(1/rates.USD).toFixed(4)}` : null,
      rates.GBP ? `EUR/GBP spot: ${(1/rates.GBP).toFixed(4)}` : null,
      rates.JPY ? `EUR/JPY spot: ${(1/rates.JPY).toFixed(2)}` : null,
      rates.CHF ? `EUR/CHF spot: ${(1/rates.CHF).toFixed(4)}` : null,
      crypto.btc_usd ? `BTC/USD: ${crypto.btc_usd}` : null,
      crypto.eth_usd ? `ETH/USD: ${crypto.eth_usd}` : null,
    ].filter(Boolean).join(", ");

    return `Eres un profesor universitario experto en Relaciones Economicas Internacionales. Debes generar un ejercicio practico complejo y riguroso para estudiantes universitarios de 3er/4o ano de Economia o ADE.

CONTEXTO ECONOMICO QUE HA DADO EL PROFESOR:
${contextText}

PARAMETROS DEL EJERCICIO:
- Tematicas a combinar: ${(clarif.tematicas || []).join(", ")}
- Nivel de dificultad: ${(clarif.dificultad || ["Avanzado"])[0]}
- Divisas y activos: ${(clarif.activos || []).join(", ")}
- Horizonte temporal: ${(clarif.horizonte || ["Mixto"])[0]}
- Convencion tipo de cambio: ${(clarif.tipoTC || ["Indistinto"])[0]}
- Fuente de datos: ${(clarif.datos || []).join(", ")}
${manualData ? `- Datos manuales del profesor: ${manualData}` : ""}

DATOS DE MERCADO EN TIEMPO REAL (usa estos como base numerica):
${liveStr || "No disponibles, usa datos realistas recientes"}

INSTRUCCIONES ESTRICTAS:
1. El ejercicio debe tener un CONTEXTO NARRATIVO largo y detallado (minimo 120 palabras), como en los mejores casos de estudio universitarios. Menciona el evento economico real, paises, fechas y mecanismo de transmision.
2. Incluye una TABLA DE DATOS con 5-8 variables numericas concretas. Los datos deben ser coherentes entre si y con el contexto. Para datos historicos, usa cifras reales documentadas. Cita la fuente oficial de cada dato.
3. Formula 6 PREGUNTAS PROGRESIVAS (a-f): las 3 primeras son de calculo directo, las 2 siguientes de analisis multitematico, y la ultima de reflexion critica o discusion teorica.
4. La SOLUCION debe incluir: pasos detallados con formulas, resultados numericos, y para cada paso los errores mas frecuentes de los estudiantes.
5. Incluye una lista de FUENTES OFICIALES con URLs reales verificables (BCE, Fed, Eurostat, BLS, Banco Mundial, etc.).

FORMATO DE RESPUESTA: Responde UNICAMENTE con el siguiente formato XML (sin texto antes ni despues):

<exercise>
<topicLabel>titulo tematico del ejercicio</topicLabel>
<title>titulo completo del ejercicio</title>
<context>contexto narrativo detallado, minimo 120 palabras, puede tener saltos de linea</context>
<body>enunciado introductorio del ejercicio</body>
<dataRows>
  <row><key>nombre del dato 1</key><val>valor con unidades</val></row>
  <row><key>nombre del dato 2</key><val>valor con unidades</val></row>
</dataRows>
<questions>
  <question><label>a)</label><text>texto de la pregunta a</text></question>
  <question><label>b)</label><text>texto de la pregunta b</text></question>
  <question><label>c)</label><text>texto de la pregunta c</text></question>
  <question><label>d)</label><text>texto de la pregunta d</text></question>
  <question><label>e)</label><text>texto de la pregunta e</text></question>
  <question><label>f)</label><text>texto de la pregunta f</text></question>
</questions>
<solution>
  <step>
    <label>titulo del paso 1</label>
    <text>explicacion del paso</text>
    <formula>calculo paso a paso con saltos de linea si es necesario</formula>
    <result>resultado final del paso</result>
    <errors>errores frecuentes de los estudiantes en este paso</errors>
  </step>
</solution>
<sources>
  <source><label>nombre de la fuente</label><url>https://url-oficial.org</url></source>
</sources>
</exercise>`;
  };

  // Parse the XML response from the AI into a structured object
  const parseXMLResponse = (raw) => {
    const get = (tag) => {
      const m = raw.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].trim() : "";
    };
    const getAll = (tag) => {
      const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "g");
      const results = [];
      let m;
      while ((m = re.exec(raw)) !== null) results.push(m[1].trim());
      return results;
    };

    // dataRows: <row><key>…</key><val>…</val></row>
    const dataRows = [];
    const rowRe = /<row>([\s\S]*?)<\/row>/g;
    let rowM;
    while ((rowM = rowRe.exec(raw)) !== null) {
      const inner = rowM[1];
      const km = inner.match(/<key>([\s\S]*?)<\/key>/);
      const vm = inner.match(/<val>([\s\S]*?)<\/val>/);
      if (km && vm) dataRows.push({ key: km[1].trim(), val: vm[1].trim() });
    }

    // questions: <question><label>…</label><text>…</text></question>
    const questions = [];
    const qRe = /<question>([\s\S]*?)<\/question>/g;
    let qM;
    while ((qM = qRe.exec(raw)) !== null) {
      const inner = qM[1];
      const lm = inner.match(/<label>([\s\S]*?)<\/label>/);
      const tm = inner.match(/<text>([\s\S]*?)<\/text>/);
      if (lm && tm) questions.push({ label: lm[1].trim(), text: tm[1].trim() });
    }

    // steps: <step><label>…</label><text>…</text><formula>…</formula><result>…</result><errors>…</errors></step>
    const steps = [];
    const sRe = /<step>([\s\S]*?)<\/step>/g;
    let sM;
    while ((sM = sRe.exec(raw)) !== null) {
      const inner = sM[1];
      const lm = inner.match(/<label>([\s\S]*?)<\/label>/);
      const tm = inner.match(/<text>([\s\S]*?)<\/text>/);
      const fm = inner.match(/<formula>([\s\S]*?)<\/formula>/);
      const rm = inner.match(/<result>([\s\S]*?)<\/result>/);
      const em = inner.match(/<errors>([\s\S]*?)<\/errors>/);
      steps.push({
        label:        lm ? lm[1].trim() : "",
        text:         tm ? tm[1].trim() : "",
        formula:      fm ? fm[1].trim() : "",
        result:       rm ? rm[1].trim() : "",
        commonErrors: em ? em[1].trim() : "",
      });
    }

    // sources: <source><label>…</label><url>…</url></source>
    const sources = [];
    const srcRe = /<source>([\s\S]*?)<\/source>/g;
    let srcM;
    while ((srcM = srcRe.exec(raw)) !== null) {
      const inner = srcM[1];
      const lm = inner.match(/<label>([\s\S]*?)<\/label>/);
      const um = inner.match(/<url>([\s\S]*?)<\/url>/);
      if (lm && um) sources.push({ label: lm[1].trim(), url: um[1].trim() });
    }

    const result = {
      topicLabel: get("topicLabel"),
      title:      get("title"),
      context:    get("context"),
      body:       get("body"),
      dataRows,
      questions,
      solution: { steps },
      sources,
    };

    if (!result.title || questions.length === 0)
      throw new Error("La respuesta no contiene los campos requeridos (title, questions).");

    return result;
  };

  const generate = async () => {
    setStep(3);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt() })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Error ${response.status}`);
      const parsed = parseXMLResponse(data.text);
      setResult(parsed);
      setStep(4);
    } catch(e) {
      setError("Error al generar el ejercicio: " + e.message);
      setStep(2);
    }
  };

    const latexCode = result
    ? buildLatexCustom(result, latexTab === "profesor", liveData.timestamp)
    : "";

  const copyLatex = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      textareaRef.current.setSelectionRange(0, 99999);
      try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2200); } catch {}
    }
  };

  const STEPS_LABELS = ["Contexto", "Aclaraciones", "Generando...", "Resultado"];

  return (
    <div className="custom-panel">
      <div className="progress-bar">
        {STEPS_LABELS.map((l, i) => (
          <div key={i} className={"progress-step" + (i + 1 < step ? " done" : i + 1 === step ? " active" : "")} title={l} />
        ))}
      </div>

      <h2>Ejercicio Personalizable con IA</h2>
      <p className="sub">Describe el escenario economico y la IA generara un ejercicio complejo adaptado a tus parametros de clase.</p>

      {/* ── STEP 1: CONTEXT ── */}
      {step === 1 && (
        <div>
          <div style={{marginBottom:"0.75rem"}}>
            <span className="step-badge">Paso 1</span>
            <span style={{fontSize:"0.92rem",fontWeight:600,color:"var(--text)"}}>Describe el contexto economico</span>
          </div>
          <p style={{fontSize:"0.85rem",color:"var(--muted)",marginBottom:"0.75rem"}}>
            Escribe el escenario o evento economico de referencia. Puedes mencionar: paises involucrados, fechas, tipo de crisis o politica, activos de interes.
          </p>
          <textarea
            className="custom-textarea"
            placeholder={"Ejemplo: Quiero un ejercicio sobre la crisis de la lira turca en 2021, cuando el banco central de Turquia bajo los tipos de interes pese a la alta inflacion, provocando una fuerte depreciacion del USD/TRY y un aumento del diferencial de tipos con la Fed..."}
            value={contextText}
            onChange={e => setContextText(e.target.value)}
          />
          <div style={{marginTop:"1rem",display:"flex",gap:"0.75rem"}}>
            <button
              className="btn btn-primary"
              disabled={contextText.trim().length < 30}
              onClick={() => setStep(2)}
            >
              Continuar a Aclaraciones
            </button>
            {contextText.trim().length < 30 && (
              <span style={{fontSize:"0.78rem",color:"var(--muted)",alignSelf:"center",fontStyle:"italic"}}>
                Escribe al menos 30 caracteres para continuar.
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 2: CLARIFICATIONS ── */}
      {step === 2 && (
        <div>
          <div style={{marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
            <span className="step-badge">Paso 2</span>
            <span style={{fontSize:"0.92rem",fontWeight:600,color:"var(--text)"}}>Especifica los parametros del ejercicio</span>
            <button className="btn btn-outline" style={{marginLeft:"auto",fontSize:"0.72rem",padding:"0.3rem 0.75rem"}} onClick={() => setStep(1)}>
              Volver
            </button>
          </div>
          <div style={{background:"var(--tag-bg)",border:"1px solid var(--accent)",borderRadius:"6px",padding:"0.75rem 1rem",marginBottom:"1.25rem",fontSize:"0.83rem",color:"#bfdbfe"}}>
            <strong>Tu contexto:</strong> {contextText.slice(0,180)}{contextText.length > 180 ? "..." : ""}
          </div>

          {error && <div className="error-box" style={{marginBottom:"1rem"}}>ERROR: {error}</div>}

          <div className="clarif-box">
            <h3>Parametros de aclaracion</h3>
            {CLARIF_QUESTIONS.map(q => (
              <div className="clarif-row" key={q.id}>
                <label>{q.label}</label>
                <span className="hint">{q.hint}</span>
                <div className="clarif-opts">
                  {q.options.map(opt => {
                    const sel = (clarif[q.id] || []).includes(opt);
                    return (
                      <button
                        key={opt}
                        className={"clarif-opt" + (sel ? (q.id === "tematicas" || q.id === "activos" || q.id === "datos" ? " sel" : " sel-green") : "")}
                        onClick={() => toggleClarif(q.id, opt, q.type === "single")}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {(clarif.datos || []).includes("Datos introducidos manualmente por el profesor") && (
              <div className="clarif-row">
                <label>Datos numericos manuales</label>
                <span className="hint">Introduce los datos que quieres que aparezcan en el ejercicio (tipo de cambio, tipos de interes, precios, etc.)</span>
                <textarea
                  className="custom-textarea"
                  style={{minHeight:"80px",marginTop:"0.25rem"}}
                  placeholder={"Ejemplo: EUR/USD = 1,0850; tipo BCE = 4,25%; tipo Fed = 5,50%; inflacion UE = 2,3%"}
                  value={manualData}
                  onChange={e => setManualData(e.target.value)}
                />
              </div>
            )}
          </div>

          <div style={{marginTop:"1.25rem",display:"flex",gap:"0.75rem",alignItems:"center"}}>
            <button
              className="btn btn-primary"
              onClick={generate}
            >
              Generar Ejercicio con IA
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: GENERATING ── */}
      {step === 3 && (
        <div className="ai-thinking">
          <div className="ring-big" />
          <p>La IA esta analizando el contexto y generando el ejercicio...</p>
          <p style={{fontSize:"0.78rem",color:"#334155"}}>Consultando datos en tiempo real y construyendo la solucion completa. Esto puede tardar 10-20 segundos.</p>
        </div>
      )}

      {/* ── STEP 4: RESULT ── */}
      {step === 4 && result && (
        <div className="custom-ex-result">
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.25rem",flexWrap:"wrap"}}>
            <span className="step-badge">Resultado</span>
            <span style={{fontSize:"0.85rem",color:"var(--accent3)",fontFamily:"IBM Plex Mono,monospace"}}>
              Ejercicio generado con IA
            </span>
            <button className="btn btn-outline" style={{marginLeft:"auto",fontSize:"0.72rem",padding:"0.3rem 0.75rem"}} onClick={() => { setStep(2); setResult(null); setShowSol(false); }}>
              Nuevo ejercicio
            </button>
          </div>

          <div className="ex-card" style={{marginBottom:"0"}}>
            <div className="ex-tag">IA · {result.topicLabel || "Ejercicio Personalizado"}</div>

            {result.context && (
              <div className="ex-context">
                {result.context}
              </div>
            )}

            <h2 className="ex-title">{result.title}</h2>
            <p className="ex-body">{result.body}</p>

            {result.dataRows && result.dataRows.length > 0 && (
              <div className="ex-data-table">
                {result.dataRows.map((r, i) => (
                  <div className="row" key={i}>
                    <span className="key">{r.key}</span>
                    <span className="val">{r.val}</span>
                  </div>
                ))}
              </div>
            )}

            <p style={{fontSize:"0.85rem",color:"var(--muted)",marginBottom:"0.75rem",fontStyle:"italic"}}>Se pide:</p>
            <ul className="ex-questions">
              {(result.questions || []).map((q, i) => (
                <li key={i} data-label={q.label}>{q.text}</li>
              ))}
            </ul>

            {result.sources && result.sources.length > 0 && (
              <div className="source-badge" style={{flexDirection:"column",alignItems:"flex-start",gap:"0.25rem"}}>
                <strong style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"0.65rem",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--muted)"}}>Fuentes oficiales:</strong>
                <ul className="custom-source-list">
                  {result.sources.map((s, i) => (
                    <li key={i}>{s.label}: <a href={s.url} target="_blank" rel="noreferrer">{s.url}</a></li>
                  ))}
                </ul>
              </div>
            )}

            {/* EXPORT */}
            <div className="export-section">
              <div className="export-label">Exportar a LaTeX</div>
              <div className="export-btns">
                <button className="btn btn-latex" onClick={() => { setLatexTab("alumno"); setShowLatexModal(true); }}>
                  Ver codigo LaTeX
                </button>
                <a
                  href={"data:text/plain;charset=utf-8," + encodeURIComponent(buildLatexCustom(result, false, liveData.timestamp))}
                  download={"ejercicio_personalizado_alumno.tex"}
                  className="btn btn-latex"
                  style={{textDecoration:"none"}}
                >
                  Descargar .tex Alumno
                </a>
                <a
                  href={"data:text/plain;charset=utf-8," + encodeURIComponent(buildLatexCustom(result, true, liveData.timestamp))}
                  download={"ejercicio_personalizado_profesor.tex"}
                  className="btn btn-latex-sol"
                  style={{textDecoration:"none"}}
                >
                  Descargar .tex Profesor (con solucion)
                </a>
              </div>
            </div>

            {/* SOLUTION */}
            <div style={{marginTop:"1rem"}}>
              <button className="btn btn-sol" onClick={() => setShowSol(s => !s)}>
                {showSol ? "Ocultar Solucion" : "Ver Solucion (Profesor)"}
              </button>
            </div>

            {showSol && result.solution && (
              <div className="sol-panel" style={{marginTop:"1rem"}}>
                <h3>Solucion — Guia del Profesor</h3>
                {result.solution.steps.map((step, i) => (
                  <div className="sol-step" key={i}>
                    <div className="sol-step-label">{step.label}</div>
                    {step.text && <p>{step.text}</p>}
                    {step.formula && <code className="sol-formula">{step.formula}</code>}
                    {step.result && <span className="sol-result">Resultado: {step.result}</span>}
                    {step.commonErrors && (
                      <div className="errors-panel">
                        <h4>Errores frecuentes</h4>
                        <ul><li>{step.commonErrors}</li></ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LATEX MODAL */}
      {showLatexModal && result && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowLatexModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Exportar LaTeX — Ejercicio Personalizado</h2>
              <button className="btn-close" onClick={() => setShowLatexModal(false)}>x Cerrar</button>
            </div>
            <div className="modal-tabs">
              <button className={"modal-tab" + (latexTab === "alumno" ? " active" : "")} onClick={() => setLatexTab("alumno")}>
                Version Alumno (sin solucion)
              </button>
              <button className={"modal-tab" + (latexTab === "profesor" ? " active" : "")} onClick={() => setLatexTab("profesor")}>
                Version Profesor (con solucion)
              </button>
            </div>
            <textarea
              ref={textareaRef}
              readOnly
              value={latexCode}
              onClick={e => e.target.select()}
              style={{
                flex:1, overflow:"auto", padding:"1.25rem 1.5rem",
                fontFamily:"'IBM Plex Mono',monospace", fontSize:"0.77rem",
                lineHeight:"1.75", color:"#e2e8f0", background:"#0d1117",
                border:"none", outline:"none", resize:"none",
                minHeight:"340px", width:"100%", whiteSpace:"pre"
              }}
            />
            <div className="modal-footer">
              <button className="btn btn-latex" onClick={copyLatex}>Copiar codigo</button>
              <a
                href={"data:text/plain;charset=utf-8," + encodeURIComponent(latexCode)}
                download={"ejercicio_personalizado_" + latexTab + ".tex"}
                className="btn btn-primary"
                style={{textDecoration:"none"}}
              >
                Descargar .tex
              </a>
              <span style={{fontFamily:"IBM Plex Mono,monospace",fontSize:"0.75rem",color:"var(--accent3)",opacity:copied?1:0,transition:"opacity 0.3s"}}>
                Copiado
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────
export default function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [live, setLive] = useState({ rates:{}, crypto:{}, timestamp:"—" });
  const [loadingData, setLoadingData] = useState(true);
  const [exercise, setExercise] = useState(null);
  const [showSol, setShowSol] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [showLatex, setShowLatex] = useState(false);

  useEffect(() => {
    setLoadingData(true);
    fetchLiveData().then(d => { setLive(d); setLoadingData(false); }).catch(() => setLoadingData(false));
  }, []);

  const generate = useCallback(() => {
    if (!selectedTopic) return;
    setGenerating(true); setShowSol(false); setError(null); setShowLatex(false);
    setTimeout(() => {
      try {
        const gen = GENERATORS[selectedTopic];
        if (!gen) throw new Error("Generador no disponible");
        setExercise(gen(live));
      } catch(e) { setError(e.message); }
      finally { setGenerating(false); }
    }, 300);
  }, [selectedTopic, live]);

  const topicsByTheme = {
    "Tema 5 — Mercado de Divisas": TOPICS.filter(t => t.theme === "Tema 5"),
    "Tema 6 — Tipos de Cambio C/P y L/P": TOPICS.filter(t => t.theme === "Tema 6"),
  };

  const cur = TOPICS.find(t => t.id === exercise?.topicId);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="app-shell">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="logo">Generador de<br />Ejercicios<br /><span>Forex & Finanzas</span></div>
          {Object.entries(topicsByTheme).map(([theme, topics]) => (
            <div key={theme}>
              <div className="sidebar-label">{theme}</div>
              {topics.map(t => (
                <button key={t.id}
                  className={`topic-btn ${selectedTopic === t.id ? "active" : ""}`}
                  onClick={() => { setSelectedTopic(t.id); setExercise(null); setShowSol(false); setShowLatex(false); }}
                >
                  <span className="topic-num">{t.emoji} {t.theme}</span>{t.label}
                </button>
              ))}
            </div>
          ))}
          <div style={{ marginTop:"0.5rem" }}>
            <div className="sidebar-label">Avanzado</div>
            <button
              className={"topic-btn" + (selectedTopic === "custom" ? " active" : "")}
              onClick={() => { setSelectedTopic("custom"); setExercise(null); setShowSol(false); setShowLatex(false); }}
            >
              <span className="topic-num">✨ Personalizable</span>Ejercicio con IA
            </button>
          </div>

          <div style={{ marginTop:"auto", paddingTop:"1rem", borderTop:"1px solid var(--border)" }}>
            <div className="sidebar-label">Datos en vivo</div>
            {loadingData
              ? <span style={{ color:"var(--muted)", fontSize:"0.75rem" }}>Cargando…</span>
              : <div style={{ fontFamily:"IBM Plex Mono,monospace", fontSize:"0.7rem", color:"var(--muted)", lineHeight:"1.8" }}>
                  {live.rates.USD && <div>EUR/USD: <span style={{color:"var(--accent2)"}}>{(1/live.rates.USD).toFixed(4)}</span></div>}
                  {live.rates.GBP && <div>EUR/GBP: <span style={{color:"var(--accent2)"}}>{(1/live.rates.GBP).toFixed(4)}</span></div>}
                  {live.crypto.btc_usd && <div>BTC: <span style={{color:"var(--accent2)"}}>${live.crypto.btc_usd.toLocaleString("es-ES")}</span></div>}
                  <div style={{marginTop:"0.5rem",color:"#334155"}}>Act: {live.timestamp}</div>
                </div>
            }
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <div className="page-header">
            <h1>Generador de Ejercicios Prácticos</h1>
            <p>Datos en tiempo real · Mercado de divisas · Finanzas internacionales · Criptomonedas</p>
          </div>

          {!loadingData && live.rates.USD && (
            <div className="data-strip">
              {[
                {label:"EUR/USD",val:(1/live.rates.USD).toFixed(4)},
                {label:"EUR/GBP",val:live.rates.GBP?(1/live.rates.GBP).toFixed(4):"—"},
                {label:"EUR/JPY",val:live.rates.JPY?(1/live.rates.JPY).toFixed(2):"—"},
                {label:"EUR/CHF",val:live.rates.CHF?(1/live.rates.CHF).toFixed(4):"—"},
                {label:"BTC/USD",val:live.crypto.btc_usd?`$${live.crypto.btc_usd.toLocaleString("es-ES")}`:"—"},
                {label:"ETH/USD",val:live.crypto.eth_usd?`$${live.crypto.eth_usd.toLocaleString("es-ES")}`:"—"},
              ].map(({label,val}) => (
                <div className="data-pill" key={label}>
                  <span className="label">{label}</span><span className="val">{val}</span>
                </div>
              ))}
            </div>
          )}

          {selectedTopic === "custom" ? (
            <CustomExercise liveData={live} />
          ) : (
            <>
              <div className="controls-bar">
                <button className="btn btn-primary" onClick={generate} disabled={!selectedTopic||generating||loadingData}>
                  {generating ? <><span className="loading-ring"></span> Generando...</> : "Generar Ejercicio"}
                </button>
                {exercise && <>
                  <button className="btn btn-sol" onClick={() => setShowSol(s => !s)}>
                    {showSol ? "Ocultar Solucion" : "Ver Solucion (Profesor)"}
                  </button>
                  <button className="btn btn-outline" onClick={generate}>Nuevo Ejercicio</button>
                </>}
                {!selectedTopic && (
                  <span style={{ color:"var(--muted)", fontFamily:"IBM Plex Mono,monospace", fontSize:"0.8rem" }}>
                    Selecciona una tematica del panel izquierdo
                  </span>
                )}
              </div>

              {error && <div className="error-box">Error: {error}</div>}

              {!exercise && !generating && (
                <div className="empty-state">
                  <div className="icon">📐</div>
                  <h2>{selectedTopic ? "Listo para generar" : "Selecciona una tematica"}</h2>
                  <p style={{ fontSize:"0.9rem", maxWidth:"360px", margin:"0 auto" }}>
                    {selectedTopic ? "Pulsa Generar Ejercicio para crear un nuevo ejercicio con datos reales de mercado." : "Elige un tema del panel lateral para empezar."}
                  </p>
                </div>
              )}

              {exercise && !generating && (
                <div className="ex-card">
                  <div className="ex-tag">{cur?.emoji} {cur?.theme} · {cur?.label}</div>
                  {exercise.context && <div className="ex-context">{exercise.context}</div>}
                  <h2 className="ex-title">{exercise.title}</h2>
                  <p className="ex-body">{exercise.body}</p>
                  <div className="ex-data-table">
                    {exercise.dataRows.map((r,i) => (
                      <div className="row" key={i}>
                        <span className="key">{r.key}</span>
                        <span className="val">{r.val}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize:"0.85rem", color:"var(--muted)", marginBottom:"0.75rem", fontStyle:"italic" }}>Se pide:</p>
                  <ul className="ex-questions">
                    {exercise.questions.map((q,i) => <li key={i} data-label={q.label}>{q.text}</li>)}
                  </ul>

                  {exercise.source && (
                    <div className="source-badge">
                      <a href={exercise.source.url} target="_blank" rel="noreferrer">{exercise.source.label}</a>
                      {" · "} Generado: {live.timestamp}
                    </div>
                  )}

                  <div className="export-section">
                    <div className="export-label">Exportar a LaTeX</div>
                    <div className="export-btns">
                      <button className="btn btn-latex" onClick={() => setShowLatex(true)}>
                        Ver codigo LaTeX
                      </button>
                      <a
                        href={"data:text/plain;charset=utf-8," + encodeURIComponent(buildLatex(exercise, false, cur, live.timestamp))}
                        download={exercise.topicId + "_alumno.tex"}
                        className="btn btn-latex"
                        style={{ textDecoration: "none" }}
                      >
                        Descargar .tex Alumno
                      </a>
                      <a
                        href={"data:text/plain;charset=utf-8," + encodeURIComponent(buildLatex(exercise, true, cur, live.timestamp))}
                        download={exercise.topicId + "_profesor.tex"}
                        className="btn btn-latex-sol"
                        style={{ textDecoration: "none" }}
                      >
                        Descargar .tex Profesor
                      </a>
                    </div>
                  </div>

                  {showSol && exercise.solution && (
                    <div className="sol-panel">
                      <h3>Solucion - Guia del Profesor</h3>
                      {exercise.solution.steps.map((step,i) => (
                        <div className="sol-step" key={i}>
                          <div className="sol-step-label">{step.label}</div>
                          {step.text && <p>{step.text}</p>}
                          {step.formula && <code className="sol-formula">{step.formula}</code>}
                          {step.result && <span className="sol-result">{step.result}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {showLatex && exercise && (
                <LatexModal ex={exercise} topicObj={cur} ts={live.timestamp} onClose={() => setShowLatex(false)} />
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
