const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "Claude Code SDLC Masterclass";
pres.title = "Claude Code SDLC Masterclass";

// ---- palette ----
const BG = "F7F6F2", DARK = "26215C", INK = "26215C", BODY = "3A3A42", MUTED = "6E6E78", WHITE = "FFFFFF";
const A = {
  L2: { fill: "EAE9E3", line: "888780", text: "444441", name: "L2 assisted" },
  L3: { fill: "DCF0E9", line: "0F6E56", text: "0F6E56", name: "L3 supervised" },
  L4: { fill: "E7E5FA", line: "534AB7", text: "3C3489", name: "L4 delegated" },
};
const TEAL = "0F6E56", PURPLE = "534AB7";
const HEAD = "Trebuchet MS", FONT = "Calibri", MONO = "Consolas";
const W = 13.3, H = 7.5, M = 0.7;
const mkShadow = () => ({ type: "outer", color: "26215C", blur: 7, offset: 3, angle: 135, opacity: 0.10 });

function levelOf(s) { return s.includes("L4") ? A.L4 : s.includes("L3") ? A.L3 : A.L2; }

function footer(slide, n) {
  slide.addText("Claude Code SDLC Masterclass", { x: M, y: H - 0.42, w: 6, h: 0.3, fontFace: FONT, fontSize: 9, color: MUTED, align: "left", margin: 0 });
  slide.addText(String(n), { x: W - 1.1, y: H - 0.42, w: 0.4, h: 0.3, fontFace: FONT, fontSize: 9, color: MUTED, align: "right", margin: 0 });
}
function kicker(slide, text, color) {
  slide.addShape(pres.shapes.RECTANGLE, { x: M, y: 0.62, w: 0.16, h: 0.16, fill: { color: color || TEAL } });
  slide.addText(text.toUpperCase(), { x: M + 0.26, y: 0.5, w: 11, h: 0.4, fontFace: HEAD, fontSize: 12, bold: true, color: color || TEAL, charSpacing: 2, margin: 0, valign: "middle" });
}
function title(slide, text, size) {
  slide.addText(text, { x: M, y: 0.92, w: W - 2 * M, h: 0.9, fontFace: HEAD, fontSize: size || 30, bold: true, color: INK, margin: 0 });
}
function content(opts) { const s = pres.addSlide(); s.background = { color: BG }; return s; }
function chip(slide, x, y, level) {
  const a = A[level];
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 1.7, h: 0.42, rectRadius: 0.08, fill: { color: a.fill }, line: { color: a.line, width: 1 } });
  slide.addText(a.name, { x, y, w: 1.7, h: 0.42, fontFace: HEAD, fontSize: 11, bold: true, color: a.text, align: "center", valign: "middle", margin: 0 });
}

// ============================================================ 1. TITLE
(() => {
  const s = pres.addSlide(); s.background = { color: DARK };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.35, h: H, fill: { color: PURPLE } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 0, w: 0.12, h: H, fill: { color: TEAL } });
  s.addText("CLAUDE CODE", { x: 1.0, y: 1.7, w: 11, h: 0.5, fontFace: HEAD, fontSize: 16, bold: true, color: "AFA9EC", charSpacing: 4, margin: 0 });
  s.addText("SDLC Masterclass", { x: 0.95, y: 2.15, w: 11.5, h: 1.3, fontFace: HEAD, fontSize: 54, bold: true, color: WHITE, margin: 0 });
  s.addText("Learn the tool by shipping embedded C — requirement to release.", { x: 1.0, y: 3.55, w: 11, h: 0.6, fontFace: FONT, fontSize: 20, color: "CADCFC", margin: 0 });
  s.addText([
    { text: "For embedded / Linux / device-driver engineers.   ", options: { color: "AFA9EC" } },
    { text: "~4 hours, hands-on.", options: { color: "9FE1CB" } },
  ], { x: 1.0, y: 4.3, w: 11, h: 0.5, fontFace: FONT, fontSize: 14, margin: 0 });
  s.addText("L2 assisted   ·   L3 supervised   ·   L4 delegated", { x: 1.0, y: 6.4, w: 11, h: 0.4, fontFace: HEAD, fontSize: 13, bold: true, color: "7F77DD", charSpacing: 1, margin: 0 });
})();

// ============================================================ 2. OUTCOMES
(() => {
  const s = content(); kicker(s, "why we're here", TEAL); title(s, "What you'll leave with");
  const cards = [
    ["ti", "Use every building block", "Prompts, skills, MCP, sub-agents, orchestration, dynamic workflows — and know which to reach for.", TEAL],
    ["ti", "Run the full SDLC with Claude", "Requirements to release, on real C firmware — not slideware.", PURPLE],
    ["ti", "Judge autonomy per stage", "Decide L2 / L3 / L4 for each stage and defend it to your safety process.", TEAL],
    ["ti", "Install & adapt the toolkit", "Take cc-masterclass-kit home and run it on your own repos Monday.", PURPLE],
  ];
  const cw = 5.7, ch = 1.95, gx = 0.5, gy = 0.4, x0 = M, y0 = 2.0;
  cards.forEach((c, i) => {
    const x = x0 + (i % 2) * (cw + gx), y = y0 + Math.floor(i / 2) * (ch + gy);
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: cw, h: ch, fill: { color: WHITE }, line: { color: "E2E0D8", width: 1 }, shadow: mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.1, h: ch, fill: { color: c[3] } });
    s.addText(c[1], { x: x + 0.35, y: y + 0.25, w: cw - 0.6, h: 0.5, fontFace: HEAD, fontSize: 18, bold: true, color: INK, margin: 0 });
    s.addText(c[2], { x: x + 0.35, y: y + 0.8, w: cw - 0.6, h: 1.0, fontFace: FONT, fontSize: 14, color: BODY, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
  });
  footer(s, 2);
})();

// ============================================================ 3. AGENT LOOP (hero)
(() => {
  const s = content(); kicker(s, "the mental model", TEAL); title(s, "Everything is context + tools + a loop");
  const boxes = [
    [2.7, 2.4, "1", "read context", TEAL],
    [7.3, 2.4, "2", "pick a tool", TEAL],
    [7.3, 4.5, "3", "run it locally", PURPLE],
    [2.7, 4.5, "4", "read the result", PURPLE],
  ];
  const bw = 3.3, bh = 1.0;
  boxes.forEach(b => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: b[0], y: b[1], w: bw, h: bh, rectRadius: 0.1, fill: { color: WHITE }, line: { color: b[4], width: 1.5 }, shadow: mkShadow() });
    s.addShape(pres.shapes.OVAL, { x: b[0] + 0.25, y: b[1] + 0.28, w: 0.44, h: 0.44, fill: { color: b[4] } });
    s.addText(b[2], { x: b[0] + 0.25, y: b[1] + 0.28, w: 0.44, h: 0.44, fontFace: HEAD, fontSize: 15, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
    s.addText(b[3], { x: b[0] + 0.85, y: b[1], w: bw - 1.0, h: bh, fontFace: HEAD, fontSize: 16, bold: true, color: INK, valign: "middle", margin: 0 });
  });
  const arr = (x, y, w, h) => s.addShape(pres.shapes.LINE, { x, y, w, h, line: { color: "888780", width: 2, endArrowType: "triangle" } });
  arr(6.0, 2.9, 1.3, 0);     // top L->R
  arr(8.95, 3.4, 0, 1.1);    // right down
  arr(7.3, 5.0, -1.3, 0);    // bottom R->L
  arr(4.35, 4.5, 0, -1.1);   // left up
  s.addShape(pres.shapes.OVAL, { x: 5.85, y: 3.45, w: 1.6, h: 1.0, fill: { color: "EFEDFB" }, line: { color: PURPLE, width: 1 } });
  s.addText("the loop", { x: 5.85, y: 3.45, w: 1.6, h: 1.0, fontFace: HEAD, fontSize: 13, bold: true, color: PURPLE, align: "center", valign: "middle", margin: 0 });
  s.addText("Every feature — commands, skills, MCP, sub-agents, hooks, plugins — is just a different way to package and scope these three.",
    { x: M, y: 6.25, w: W - 2 * M, h: 0.7, fontFace: FONT, fontSize: 15, italic: true, color: MUTED, align: "center", margin: 0 });
  footer(s, 3);
})();

// ============================================================ 4. CAPABILITY LADDER (hero)
(() => {
  const s = content(); kicker(s, "the through-line", PURPLE); title(s, "The capability ladder rises with autonomy");
  // legend
  const leg = [["EAE9E3", "888780", "L2 assisted"], ["DCF0E9", "0F6E56", "L3 supervised"], ["E7E5FA", "534AB7", "L4 delegated"]];
  let lx = M;
  leg.forEach(l => { s.addShape(pres.shapes.RECTANGLE, { x: lx, y: 1.78, w: 0.22, h: 0.22, fill: { color: l[0] }, line: { color: l[1], width: 1 } }); s.addText(l[2], { x: lx + 0.3, y: 1.72, w: 2.2, h: 0.34, fontFace: FONT, fontSize: 12, color: BODY, valign: "middle", margin: 0 }); lx += 2.7; });
  const rungs = [
    ["6", "dynamic workflow", "picks its own next step", A.L4],
    ["5", "orchestration", "many agents, one task", A.L4],
    ["4", "sub-agent", "delegated context, scoped tools", A.L3],
    ["3", "MCP tool", "reach beyond the repo", A.L3],
    ["2", "skill", "auto-selected, bundles code", A.L2],
    ["1", "prompt / command", "a saved instruction", A.L2],
  ];
  const bx = M, bw = 8.4, bh = 0.62, pitch = 0.74, y0 = 2.3;
  rungs.forEach((r, i) => {
    const y = y0 + i * pitch, a = r[3];
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: bx, y, w: bw, h: bh, rectRadius: 0.06, fill: { color: a.fill }, line: { color: a.line, width: 1.25 } });
    s.addShape(pres.shapes.OVAL, { x: bx + 0.18, y: y + 0.11, w: 0.4, h: 0.4, fill: { color: a.line } });
    s.addText(r[0], { x: bx + 0.18, y: y + 0.11, w: 0.4, h: 0.4, fontFace: HEAD, fontSize: 13, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
    s.addText(r[1], { x: bx + 0.78, y, w: 3.0, h: bh, fontFace: HEAD, fontSize: 15, bold: true, color: a.text, valign: "middle", margin: 0 });
    s.addText(r[2], { x: bx + 3.7, y, w: bw - 3.85, h: bh, fontFace: FONT, fontSize: 13, color: BODY, valign: "middle", margin: 0 });
  });
  // autonomy arrow on right
  const ax = bx + bw + 0.55;
  s.addShape(pres.shapes.LINE, { x: ax, y: y0 + 5 * pitch + bh, w: 0, h: -(5 * pitch + bh - 0.1), line: { color: PURPLE, width: 2.5, endArrowType: "triangle" } });
  s.addText("more autonomy", { x: ax + 0.15, y: 2.3, w: 3.2, h: 5.2, fontFace: HEAD, fontSize: 13, bold: true, color: PURPLE, valign: "middle", margin: 0, rotate: 90 });
  footer(s, 4);
})();

// ============================================================ 5. AUTONOMY LADDER (hero)
(() => {
  const s = content(); kicker(s, "the spine of the course", TEAL); title(s, "Three levels of autonomy");
  const cols = [
    [A.L2, "L2", "Assisted", ["Human, every step", "Expert pair: suggest, draft, explain", "Permission prompts, plan mode", "Every action"]],
    [A.L3, "L3", "Supervised", ["Claude runs a workflow", "Execute commands, skills, sub-agents", "Hooks, rules, scoped tools", "At defined checkpoints"]],
    [A.L4, "L4", "Delegated", ["Claude, headless", "Run unattended: CI, claude -p, SDK", "Policy-as-code, sandbox, audit log", "Outcome audit only"]],
  ];
  const labels = ["Who drives", "Claude's job", "Guardrails", "Human gate"];
  const cw = 3.85, gx = 0.27, x0 = M, y0 = 1.95, ch = 4.35;
  cols.forEach((c, i) => {
    const a = c[0], x = x0 + i * (cw + gx);
    s.addShape(pres.shapes.RECTANGLE, { x, y: y0, w: cw, h: ch, fill: { color: WHITE }, line: { color: "E2E0D8", width: 1 }, shadow: mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y: y0, w: cw, h: 0.95, fill: { color: a.line } });
    s.addText(c[1], { x: x + 0.3, y: y0 + 0.12, w: cw - 0.6, h: 0.5, fontFace: HEAD, fontSize: 26, bold: true, color: WHITE, margin: 0 });
    s.addText(c[2], { x: x + 1.15, y: y0 + 0.27, w: cw - 1.3, h: 0.45, fontFace: HEAD, fontSize: 16, color: "FFFFFF", valign: "middle", margin: 0 });
    c[3].forEach((v, r) => {
      const ry = y0 + 1.15 + r * 0.78;
      s.addText(labels[r], { x: x + 0.3, y: ry, w: cw - 0.6, h: 0.25, fontFace: HEAD, fontSize: 10.5, bold: true, color: a.text, charSpacing: 1, margin: 0 });
      s.addText(v, { x: x + 0.3, y: ry + 0.24, w: cw - 0.6, h: 0.5, fontFace: FONT, fontSize: 12.5, color: BODY, margin: 0, valign: "top" });
    });
  });
  s.addText("L2 you approve each step   ·   L3 you approve at checkpoints   ·   L4 you audit outcomes",
    { x: M, y: 6.55, w: W - 2 * M, h: 0.45, fontFace: HEAD, fontSize: 14, bold: true, color: INK, align: "center", margin: 0 });
  footer(s, 5);
})();

// ============================================================ 6. THE LAB
(() => {
  const s = content(); kicker(s, "the hands-on lab", TEAL); title(s, "firmware-lab — a sensor gateway in C");
  s.addText([
    { text: "What it is.  ", options: { bold: true, color: INK } },
    { text: "A host-buildable embedded-C firmware: simulated I2C sensor → wire-frame protocol → simulated UART uplink, plus a debug CLI. Builds in seconds with gcc / make — no hardware, no cross-toolchain.", options: { color: BODY } },
  ], { x: M, y: 2.0, w: 7.0, h: 1.5, fontFace: FONT, fontSize: 14.5, margin: 0, lineSpacingMultiple: 1.1, valign: "top" });
  const facts = [
    ["Green baseline", "13 Unity tests pass, CI green — yet 4 latent bugs lurk."],
    ["The flagship feature", "FR-7: add a CRC-16 to the wire frame, built across the course."],
    ["Real attack surface", "Untrusted input at proto_decode, config_load, the CLI."],
    ["The backlog drives it", "Each lab takes one item requirement → tagged release."],
  ];
  facts.forEach((f, i) => {
    const y = 3.7 + i * 0.78;
    s.addShape(pres.shapes.OVAL, { x: M, y: y + 0.04, w: 0.16, h: 0.16, fill: { color: TEAL } });
    s.addText([{ text: f[0] + ".  ", options: { bold: true, color: INK } }, { text: f[1], options: { color: BODY } }], { x: M + 0.32, y, w: 6.7, h: 0.7, fontFace: FONT, fontSize: 13.5, margin: 0, valign: "top" });
  });
  // module map card
  const mx = 8.1, mw = 4.5, my = 2.0, mh = 4.55;
  s.addShape(pres.shapes.RECTANGLE, { x: mx, y: my, w: mw, h: mh, fill: { color: WHITE }, line: { color: "E2E0D8", width: 1 }, shadow: mkShadow() });
  s.addText("module map", { x: mx + 0.3, y: my + 0.2, w: mw - 0.6, h: 0.35, fontFace: HEAD, fontSize: 12, bold: true, color: MUTED, charSpacing: 1, margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: mx + 1.45, y: my + 0.65, w: 1.6, h: 0.5, rectRadius: 0.06, fill: { color: "E7E5FA" }, line: { color: PURPLE, width: 1 } });
  s.addText("main.c", { x: mx + 1.45, y: my + 0.65, w: 1.6, h: 0.5, fontFace: MONO, fontSize: 12, bold: true, color: "3C3489", align: "center", valign: "middle", margin: 0 });
  const mods = ["cli.c", "protocol.c", "config.c", "ring_buffer.c", "hal/ (sensor, uart)"];
  mods.forEach((m, i) => {
    const y = my + 1.5 + i * 0.56;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: mx + 0.5, y, w: 3.5, h: 0.44, rectRadius: 0.05, fill: { color: "DCF0E9" }, line: { color: TEAL, width: 1 } });
    s.addText(m, { x: mx + 0.5, y, w: 3.5, h: 0.44, fontFace: MONO, fontSize: 12, color: "0F6E56", align: "center", valign: "middle", margin: 0 });
    s.addShape(pres.shapes.LINE, { x: mx + 2.25, y: y - 0.12, w: 0, h: 0.12, line: { color: "B4B2A9", width: 1 } });
  });
  footer(s, 6);
})();

// ============================================================ 7. TWO REPOS (hero)
(() => {
  const s = content(); kicker(s, "how the pieces fit", PURPLE); title(s, "Two repos: the work and the learning");
  const card = (x, name, tag, color, items) => {
    const w = 5.2, y = 2.0, h = 4.0;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: WHITE }, line: { color: "E2E0D8", width: 1 }, shadow: mkShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.85, fill: { color } });
    s.addText(name, { x: x + 0.3, y: y + 0.12, w: w - 0.6, h: 0.4, fontFace: MONO, fontSize: 18, bold: true, color: WHITE, margin: 0 });
    s.addText(tag, { x: x + 0.3, y: y + 0.5, w: w - 0.6, h: 0.3, fontFace: FONT, fontSize: 12, color: "F4F4FA", margin: 0 });
    items.forEach((it, i) => {
      const iy = y + 1.1 + i * 0.66;
      s.addShape(pres.shapes.OVAL, { x: x + 0.32, y: iy + 0.05, w: 0.14, h: 0.14, fill: { color } });
      s.addText(it, { x: x + 0.6, y: iy, w: w - 0.9, h: 0.6, fontFace: FONT, fontSize: 13, color: BODY, margin: 0, valign: "top" });
    });
  };
  card(M, "firmware-lab", "the work — what you build on", TEAL, ["Backlog + draft spec", "Seeded bugs + FR-7 feature", "Tests, CI, build", "What every student clones"]);
  card(7.4, "cc-masterclass", "the learning — how to do it", PURPLE, ["11 SDLC modules", "Instructor guide + answer key", "The .claude/ artifacts you build", "cc-masterclass-kit plugin"]);
  // middle connector
  s.addShape(pres.shapes.LINE, { x: 5.95, y: 4.0, w: 1.4, h: 0, line: { color: "888780", width: 2, beginArrowType: "triangle", endArrowType: "triangle" } });
  s.addText("the lab is the work; the course is how to do it with Claude Code, autonomy chosen per stage.",
    { x: M, y: 6.35, w: W - 2 * M, h: 0.5, fontFace: FONT, fontSize: 14, italic: true, color: MUTED, align: "center", margin: 0 });
  footer(s, 7);
})();

// ============================================================ 8-16. ANCHOR SLIDES
const anchors = [
  ["Module 1 · Requirements", "Requirements", "Elicit, don't assume.", "The model's failure mode is confident invention — prompt it to ask every open question before it drafts a line.", "Prompting · plan mode · capture a command · MCP to the issue tracker", "Turn backlog FR-7 into a testable spec with acceptance criteria + a traceability row.", "L3"],
  ["Module 2 · Design", "Design", "Fan out, then decide on paper.", "Read-only exploration returns conclusions, not file dumps; the decision earns a durable ADR.", "Explore / Plan sub-agents · plan mode · ADRs", "Design the CRC change; a design-reviewer sub-agent critiques the ADR before you commit.", "L3"],
  ["Module 3 · Implementation", "Implementation", "Guardrails replace supervision.", "Rules, hooks, and scoped permissions watch the work so you review the diff, not each keystroke.", "CLAUDE.md rules · format-on-edit hook · permission deny-rules", "Implement FR-7; the hook auto-formats; edits to vendor/ are blocked.", "L3"],
  ["Module 4 · Test", "Test", "Tests are self-checking.", "Generation is delegable because a wrong test goes red — but green never means correct.", "test-writer sub-agent · test-gen skill · coverage", "Write the tests that expose BUG-1 and BUG-4 the green suite hid.", "L4"],
  ["Module 5 · Debug", "Debug", "A loop of evidence.", "Give symptoms, not answers; make the agent show you the faulting line, not guess at it.", "Driving gdb + AddressSanitizer · triage sub-agent", "Root-cause three seeded bugs from field tickets alone.", "L3"],
  ["Module 6 · Security", "Security", "Split finding from judging.", "Scanning and fuzzing are delegable to L4; triage stays human. Fuzzing finds what tests miss.", "/security-review · gate hooks · libFuzzer · security-reviewer", "Fuzz proto_decode → BUG-1 in seconds; a hook blocks a planted secret.", "L4"],
  ["Module 7 · Build & Integrate", "Build & integrate", "The first true L4.", "Objective oracle + sandbox + audit log make unattended autonomy genuinely safe here.", "Headless claude -p · build-fixer loop · /code-review · CI bot", "Break the build; an L4 fixer loop repairs it; agent review stacks before human review.", "L4"],
  ["Module 8 · Release", "Release", "Automate the typing, not the call.", "Notes, changelog, and tag checks are delegable; the go/no-go to ship stays human.", "release-notes skill · semver hook · /schedule", "Cut v1.1.0: the agent drafts notes from commits, you approve the tag.", "L4"],
  ["Module 9 · Orchestration", "Orchestration & dynamic workflow", "Compose — and know when not to.", "Static pipeline vs. a workflow that picks its own next step. Don't orchestrate what one session does better.", "Task fan-out · orchestrator command · Agent SDK · /loop", "/ship-feature: plan → implementer + reviewer + tester → merge, on a real backlog item.", "L4"],
];
anchors.forEach((m, idx) => {
  const s = content();
  const lvl = levelOf(m[6]);
  kicker(s, m[0], lvl.line);
  title(s, m[1], 28);
  // left: the lesson
  s.addText("THE LESSON", { x: M, y: 2.1, w: 6.5, h: 0.3, fontFace: HEAD, fontSize: 12, bold: true, color: lvl.line, charSpacing: 2, margin: 0 });
  s.addText(m[2], { x: M, y: 2.45, w: 6.6, h: 0.9, fontFace: HEAD, fontSize: 24, bold: true, color: INK, margin: 0, valign: "top" });
  s.addText(m[3], { x: M, y: 3.5, w: 6.6, h: 2.0, fontFace: FONT, fontSize: 16, color: BODY, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
  // right card
  const rx = 7.7, rw = 4.9, ry = 2.1, rh = 4.3;
  s.addShape(pres.shapes.RECTANGLE, { x: rx, y: ry, w: rw, h: rh, fill: { color: WHITE }, line: { color: "E2E0D8", width: 1 }, shadow: mkShadow() });
  s.addText("CLAUDE CODE", { x: rx + 0.35, y: ry + 0.3, w: rw - 0.7, h: 0.3, fontFace: HEAD, fontSize: 11, bold: true, color: MUTED, charSpacing: 1.5, margin: 0 });
  s.addText(m[4], { x: rx + 0.35, y: ry + 0.62, w: rw - 0.7, h: 1.1, fontFace: FONT, fontSize: 15, bold: true, color: lvl.text, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
  s.addShape(pres.shapes.LINE, { x: rx + 0.35, y: ry + 1.95, w: rw - 0.7, h: 0, line: { color: "E2E0D8", width: 1 } });
  s.addText("HANDS-ON", { x: rx + 0.35, y: ry + 2.1, w: rw - 0.7, h: 0.3, fontFace: HEAD, fontSize: 11, bold: true, color: MUTED, charSpacing: 1.5, margin: 0 });
  s.addText(m[5], { x: rx + 0.35, y: ry + 2.42, w: rw - 0.7, h: 1.2, fontFace: FONT, fontSize: 14.5, color: BODY, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
  chip(s, rx + 0.35, ry + rh - 0.62, m[6].includes("L4") ? "L4" : m[6].includes("L3") ? "L3" : "L2");
  footer(s, 8 + idx);
});

// ============================================================ 17. MATRIX
(() => {
  const s = content(); kicker(s, "the course spine", PURPLE); title(s, "SDLC × autonomy: the ceiling per stage");
  const rows = [
    ["Requirements", "Prompting, plan mode, command", "L3", "human owns intent"],
    ["Design", "Explore sub-agents, ADR", "L3", "judgment human-gated"],
    ["Implementation", "Rules, hooks, permissions", "L3", "rules + tests + review"],
    ["Test", "test-writer, coverage", "L4", "suite is self-checking"],
    ["Debug", "gdb, ASan, triage", "L3", "interactive by nature"],
    ["Security scan", "fuzzing, gate hooks", "L4", "scan delegable, triage human"],
    ["Build / integrate", "headless, CI bot", "L4", "oracle + sandbox + audit"],
    ["Release", "release-notes, semver hook", "L3/L4", "automate, human ships"],
    ["Orchestration", "fan-out, Agent SDK", "L4", "when durability is needed"],
  ];
  const head = [
    { text: "Stage", options: { fill: { color: DARK }, color: WHITE, bold: true, fontFace: HEAD, align: "left" } },
    { text: "Primitive focus", options: { fill: { color: DARK }, color: WHITE, bold: true, fontFace: HEAD, align: "left" } },
    { text: "Ceiling", options: { fill: { color: DARK }, color: WHITE, bold: true, fontFace: HEAD, align: "center" } },
    { text: "Why", options: { fill: { color: DARK }, color: WHITE, bold: true, fontFace: HEAD, align: "left" } },
  ];
  const body = rows.map((r, i) => {
    const a = levelOf(r[2]); const z = i % 2 ? "F1EFE8" : WHITE;
    return [
      { text: r[0], options: { fill: { color: z }, color: INK, bold: true, fontFace: FONT, align: "left" } },
      { text: r[1], options: { fill: { color: z }, color: BODY, fontFace: FONT, align: "left" } },
      { text: r[2], options: { fill: { color: a.fill }, color: a.text, bold: true, fontFace: HEAD, align: "center" } },
      { text: r[3], options: { fill: { color: z }, color: MUTED, fontFace: FONT, align: "left", italic: true } },
    ];
  });
  s.addTable([head, ...body], { x: M, y: 2.0, w: W - 2 * M, colW: [2.7, 4.3, 1.3, 3.6], rowH: 0.46, fontSize: 13, valign: "middle", border: { type: "solid", color: "E2E0D8", pt: 1 }, margin: [2, 6, 2, 6] });
  footer(s, 17);
})();

// ============================================================ 18. RUBRIC
(() => {
  const s = content(); kicker(s, "the closing discussion", TEAL); title(s, "Your team's autonomy rubric — fill it in");
  s.addText("There are no universal answers. A medical or automotive team sits lower than a hobby project. The win is a shared, written, defensible position.",
    { x: M, y: 1.95, w: W - 2 * M, h: 0.6, fontFace: FONT, fontSize: 14, italic: true, color: MUTED, margin: 0 });
  const rows = [["Requirements", "L3"], ["Design", "L3"], ["Implementation", "L3"], ["Test", "L4"], ["Debug", "L3"], ["Security scan", "L4"], ["Build / integrate", "L4"], ["Release", "L3/L4"], ["Orchestration", "L4"]];
  const head = [
    { text: "Stage", options: { fill: { color: DARK }, color: WHITE, bold: true, fontFace: HEAD } },
    { text: "Typical ceiling", options: { fill: { color: DARK }, color: WHITE, bold: true, fontFace: HEAD, align: "center" } },
    { text: "Your team's call", options: { fill: { color: DARK }, color: WHITE, bold: true, fontFace: HEAD, align: "center" } },
    { text: "Rationale", options: { fill: { color: DARK }, color: WHITE, bold: true, fontFace: HEAD, align: "center" } },
  ];
  const body = rows.map((r, i) => {
    const a = levelOf(r[1]); const z = i % 2 ? "F1EFE8" : WHITE;
    return [
      { text: r[0], options: { fill: { color: z }, color: INK, bold: true, fontFace: FONT } },
      { text: r[1], options: { fill: { color: a.fill }, color: a.text, bold: true, fontFace: HEAD, align: "center" } },
      { text: "", options: { fill: { color: "FCFBF8" } } },
      { text: "", options: { fill: { color: "FCFBF8" } } },
    ];
  });
  s.addTable([head, ...body], { x: M, y: 2.7, w: W - 2 * M, colW: [2.8, 2.2, 3.4, 3.5], rowH: 0.42, fontSize: 13, valign: "middle", border: { type: "solid", color: "E2E0D8", pt: 1 }, margin: [2, 6, 2, 6] });
  footer(s, 18);
})();

// ============================================================ 19. ROLLOUT
(() => {
  const s = content(); kicker(s, "from this room to the org", PURPLE); title(s, "Roll out: one toolkit, managed-local");
  // code card
  const cx = M, cw = 6.3, cy = 2.1, ch = 3.0;
  s.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: cw, h: ch, fill: { color: "1E1B3A" } });
  s.addText("install the team toolkit", { x: cx + 0.35, y: cy + 0.25, w: cw - 0.7, h: 0.35, fontFace: HEAD, fontSize: 12, bold: true, color: "9FE1CB", charSpacing: 1, margin: 0 });
  s.addText([
    { text: "claude plugin marketplace add \\\n  kishore123/cc-masterclass\n\n", options: { color: "CADCFC", breakLine: true } },
    { text: "claude plugin install \\\n  cc-masterclass-kit@cc-masterclass\n\n", options: { color: "CADCFC", breakLine: true } },
    { text: "claude plugin update cc-masterclass-kit", options: { color: "7F77DD" } },
  ], { x: cx + 0.35, y: cy + 0.75, w: cw - 0.7, h: 2.0, fontFace: MONO, fontSize: 13.5, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
  const pts = [
    ["The hub is a git repo", "The marketplace is the source of truth; update re-pulls — versioned, auditable, rollback-able."],
    ["Guardrails ship too", "The secret-scan gate and format hook travel in the plugin, so everyone inherits the same policy."],
    ["Repo-specific stays in-repo", "Project skills live with the code and version with it — no drift."],
  ];
  pts.forEach((p, i) => {
    const y = 2.15 + i * 1.5;
    s.addShape(pres.shapes.RECTANGLE, { x: 7.5, y, w: 0.1, h: 1.25, fill: { color: PURPLE } });
    s.addText(p[0], { x: 7.75, y, w: 4.9, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: INK, margin: 0 });
    s.addText(p[1], { x: 7.75, y: y + 0.42, w: 4.85, h: 0.95, fontFace: FONT, fontSize: 13, color: BODY, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
  });
  footer(s, 19);
})();

// ============================================================ 20. RESOURCES
(() => {
  const s = content(); kicker(s, "take it with you", TEAL); title(s, "Where everything lives");
  const cols = [
    ["START HERE", TEAL, [
      ["COURSE.md", "the SDLC × autonomy map + module index"],
      ["SELF_STUDY.md", "self-directed path: one day, or 5–6 evenings"],
      ["firmware-lab", "clone, make, make test — then work the backlog"],
    ]],
    ["REFERENCE", PURPLE, [
      ["README.md", "how every Claude Code primitive works"],
      ["instructor/", "run sheet, answer key, lab-validation status"],
      ["cc-masterclass-kit", "the installable plugin + marketplace"],
    ]],
  ];
  cols.forEach((c, i) => {
    const x = M + i * 6.1;
    s.addText(c[0], { x, y: 2.1, w: 5.6, h: 0.35, fontFace: HEAD, fontSize: 13, bold: true, color: c[1], charSpacing: 2, margin: 0 });
    c[2].forEach((it, r) => {
      const y = 2.6 + r * 1.15;
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: 5.6, h: 0.95, fill: { color: WHITE }, line: { color: "E2E0D8", width: 1 }, shadow: mkShadow() });
      s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.09, h: 0.95, fill: { color: c[1] } });
      s.addText(it[0], { x: x + 0.3, y: y + 0.14, w: 5.2, h: 0.35, fontFace: MONO, fontSize: 14, bold: true, color: INK, margin: 0 });
      s.addText(it[1], { x: x + 0.3, y: y + 0.5, w: 5.2, h: 0.4, fontFace: FONT, fontSize: 12.5, color: BODY, margin: 0 });
    });
  });
  s.addText("github.com/kishore123/cc-masterclass   ·   github.com/kishore123/firmware-lab",
    { x: M, y: 6.5, w: W - 2 * M, h: 0.4, fontFace: MONO, fontSize: 13, color: MUTED, align: "center", margin: 0 });
  footer(s, 20);
})();

// ============================================================ 21. CLOSING
(() => {
  const s = pres.addSlide(); s.background = { color: DARK };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.35, h: H, fill: { color: TEAL } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 0, w: 0.12, h: H, fill: { color: PURPLE } });
  s.addText("Go ship.", { x: 1.0, y: 2.4, w: 11, h: 1.2, fontFace: HEAD, fontSize: 52, bold: true, color: WHITE, margin: 0 });
  s.addText("Pick a backlog item. Take it requirement → tagged release. Choose your autonomy at each step — and defend it.",
    { x: 1.0, y: 3.75, w: 10.5, h: 1.0, fontFace: FONT, fontSize: 19, color: "CADCFC", margin: 0, lineSpacingMultiple: 1.15 });
  s.addText("github.com/kishore123/cc-masterclass", { x: 1.0, y: 5.5, w: 11, h: 0.4, fontFace: MONO, fontSize: 15, color: "9FE1CB", margin: 0 });
  footer(s, 21);
})();

pres.writeFile({ fileName: "cc-masterclass-deck.pptx" }).then(f => console.log("WROTE", f));
