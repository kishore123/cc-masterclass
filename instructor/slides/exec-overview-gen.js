// Executive overview deck (3 slides) — for pitching the workshop to leadership.
// Rebuild: node exec-overview-gen.js  (needs pptxgenjs, same as gen.js)
const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "Claude Code SDLC Masterclass";
pres.title = "Claude Code SDLC Masterclass — Executive Overview";

const BG = "F7F6F2", DARK = "26215C", INK = "26215C", BODY = "3A3A42", MUTED = "6E6E78", WHITE = "FFFFFF";
const TEAL = "0F6E56", PURPLE = "534AB7";
const HEAD = "Trebuchet MS", FONT = "Calibri";
const W = 13.3, H = 7.5, M = 0.7;
const mkShadow = () => ({ type: "outer", color: "26215C", blur: 7, offset: 3, angle: 135, opacity: 0.10 });

function footer(slide, n) {
  slide.addText("Claude Code SDLC Masterclass — executive overview", { x: M, y: H - 0.42, w: 7, h: 0.3, fontFace: FONT, fontSize: 9, color: MUTED, align: "left", margin: 0 });
  slide.addText(String(n), { x: W - 1.1, y: H - 0.42, w: 0.4, h: 0.3, fontFace: FONT, fontSize: 9, color: MUTED, align: "right", margin: 0 });
}
function kicker(slide, text, color) {
  slide.addShape(pres.shapes.RECTANGLE, { x: M, y: 0.62, w: 0.16, h: 0.16, fill: { color: color || TEAL } });
  slide.addText(text.toUpperCase(), { x: M + 0.26, y: 0.5, w: 11, h: 0.4, fontFace: HEAD, fontSize: 12, bold: true, color: color || TEAL, charSpacing: 2, margin: 0, valign: "middle" });
}
function title(slide, text) {
  slide.addText(text, { x: M, y: 0.92, w: W - 2 * M, h: 0.9, fontFace: HEAD, fontSize: 30, bold: true, color: INK, margin: 0 });
}
function card(slide, x, y, w, h, header, headerColor) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.1, fill: { color: WHITE }, line: { color: "E3E1DA", width: 1 }, shadow: mkShadow() });
  slide.addText(header, { x: x + 0.3, y: y + 0.22, w: w - 0.6, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: headerColor || INK, margin: 0 });
}
function bullets(slide, x, y, w, h, items, size) {
  slide.addText(
    items.map((t, i) => ({ text: t, options: { bullet: { code: "2022", indent: 12 }, breakLine: true, paraSpaceAfter: 6 } })),
    { x, y, w, h, fontFace: FONT, fontSize: size || 13, color: BODY, valign: "top", margin: 0 }
  );
}

// ============================================================ 1. WHAT IT IS
(() => {
  const s = pres.addSlide(); s.background = { color: DARK };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 0.35, h: H, fill: { color: PURPLE } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.35, y: 0, w: 0.12, h: H, fill: { color: TEAL } });
  s.addText("UPCOMING WORKSHOP", { x: 1.0, y: 1.0, w: 11, h: 0.5, fontFace: HEAD, fontSize: 15, bold: true, color: "AFA9EC", charSpacing: 4, margin: 0 });
  s.addText("Claude Code SDLC Masterclass", { x: 0.95, y: 1.45, w: 11.8, h: 1.2, fontFace: HEAD, fontSize: 44, bold: true, color: WHITE, margin: 0 });
  s.addText("Engineers learn AI-assisted development by shipping real embedded C —\none backlog item taken from requirement to a signed, tagged release.", { x: 1.0, y: 2.7, w: 11.5, h: 0.95, fontFace: FONT, fontSize: 19, color: "CADCFC", margin: 0 });

  const rows = [
    ["Who", "Embedded / Linux / device-driver engineers working in C — hands-on on a real firmware lab repo, not slideware."],
    ["Format", "~4 hours in-person, instructor-led · take-home deep-dive track · full self-study path for anyone who misses it."],
    ["The lens", "Not just “how to use the tool” — at every SDLC stage: how much autonomy should AI get here, and why?"],
    ["Status", "Materials complete · security labs dry-run validated (WSL2/clang) · pilot run-sheet and pre-work kit ready."],
  ];
  rows.forEach((r, i) => {
    const y = 4.0 + i * 0.68;
    s.addText(r[0].toUpperCase(), { x: 1.0, y, w: 1.7, h: 0.55, fontFace: HEAD, fontSize: 13, bold: true, color: "9FE1CB", valign: "middle", margin: 0 });
    s.addText(r[1], { x: 2.8, y, w: 9.8, h: 0.55, fontFace: FONT, fontSize: 14, color: "E8E6F5", valign: "middle", margin: 0 });
  });
})();

// ============================================================ 2. WHAT'S COVERED
(() => {
  const s = pres.addSlide(); s.background = { color: BG };
  kicker(s, "What's covered", TEAL);
  title(s, "The full lifecycle — with security threaded through, not bolted on");

  const cw = 5.85, ch = 4.15, cy = 1.95;
  card(s, M, cy, cw, ch, "The SDLC spine (11 modules)", INK);
  bullets(s, M + 0.3, cy + 0.72, cw - 0.6, ch - 0.95, [
    "Requirements → Design → Implementation → Test → Debug → Security → Build/CI → Release → Orchestration → Capstone",
    "Each stage pairs with the right Claude Code capability: plan mode, sub-agents, hooks, skills, MCP, headless CI agents",
    "One continuous thread: the same feature and the same seeded defects carry across every module — work compounds",
    "Capstone: each engineer ships a backlog item end-to-end, choosing the autonomy level per stage and defending it",
  ]);

  card(s, M + cw + 0.35, cy, cw, ch, "The security thread (every stage)", TEAL);
  bullets(s, M + cw + 0.65, cy + 0.72, cw - 0.6, ch - 0.95, [
    "Design: threat-model the wire format before code exists (ADR records mitigations and non-goals)",
    "Verify: fuzzing finds a real buffer overflow the green test suite hid — in under 30 seconds",
    "Guardrails: secret-scan gates, scoped permissions, prompt-injection defenses for CI agents",
    "Ship: supply-chain hygiene (SBOM, pinned actions), signed tags + artifact digests, post-release CVE watch",
  ]);

  s.addText([
    { text: "The through-line — the autonomy ladder:  ", options: { bold: true, color: INK } },
    { text: "L2 AI assists every step  ·  L3 AI runs workflows, humans gate  ·  L4 AI runs unattended, humans audit. Teams leave knowing which stage belongs where.", options: { color: BODY } },
  ], { x: M, y: 6.35, w: W - 2 * M, h: 0.6, fontFace: FONT, fontSize: 13, margin: 0 });
  footer(s, 2);
})();

// ============================================================ 3. BENEFITS
(() => {
  const s = pres.addSlide(); s.background = { color: BG };
  kicker(s, "Why it's worth it", PURPLE);
  title(s, "What the team walks away with");

  const cw = 5.85, ch = 1.95;
  const cells = [
    ["Judgment, not just tool skills", "A shared, defensible rubric for where AI can run delegated (build fixes, scanning, first-pass review) and where humans must stay in the loop (design, release go/no-go).", INK],
    ["A toolkit installable Monday", "The cc-masterclass-kit plugin ships with the course: code/security/design reviewers, test generation, release notes, crash triage — adapted to our repos in the capstone.", PURPLE],
    ["Faster engineering cycles", "Automated first-pass PR review, headless build-fixer loops, fuzzing and static analysis running unattended in CI — humans spend their time on judgment calls.", TEAL],
    ["Lower risk, demonstrated", "Guardrails are policy-as-code, not trust: hooks that block secrets and unsafe edits regardless of what the AI decides. (The course's own secret-scan hook blocked its author mid-edit.)", INK],
  ];
  cells.forEach((c, i) => {
    const x = M + (i % 2) * (cw + 0.35), y = 1.95 + Math.floor(i / 2) * (ch + 0.3);
    card(s, x, y, cw, ch, c[0], c[2]);
    s.addText(c[1], { x: x + 0.3, y: y + 0.62, w: cw - 0.6, h: ch - 0.8, fontFace: FONT, fontSize: 12.5, color: BODY, valign: "top", margin: 0 });
  });

  s.addText([
    { text: "The ask:  ", options: { bold: true, color: INK } },
    { text: "4 focused hours per engineer + a 20-minute setup pre-work. Runs on attendees' laptops; all materials, labs, and the pilot kit are ready now.", options: { color: BODY } },
  ], { x: M, y: 6.5, w: W - 2 * M, h: 0.5, fontFace: FONT, fontSize: 14, margin: 0 });
  footer(s, 3);
})();

pres.writeFile({ fileName: "exec-overview.pptx" }).then(() => console.log("WROTE exec-overview.pptx"));
