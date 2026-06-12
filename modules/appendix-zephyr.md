# Appendix — Zephyr (instructor demo + take-home)

**Your question:** *"Is Zephyr too much to handle? Our team uses it for some devices."*

**Short answer:** Zephyr is too heavy to be the *lab* for a 4-hour workshop, but it's perfect
as a **15-minute instructor demo** and a **take-home track**. Here's the reasoning and the
material.

## Why Zephyr isn't the main lab

The workshop's value is in the **agentic loop running fast on code everyone can build in
seconds**. Zephyr works against that in a classroom:

| Friction | Impact on a 4-hour, few-hundred-person session |
|---|---|
| `west` + Zephyr SDK + Python venv install (GB-scale) | pre-work failures eat live time; stragglers stall |
| 30–90s incremental builds, even on `native_sim` | the edit→build→read loop that makes Claude shine gets sluggish |
| Board/overlay/Kconfig/devicetree surface area | attention goes to Zephyr mechanics, not Claude Code or SDLC |
| ASan/fuzzing story is indirect on target builds | the security module gets harder, not clearer |

`firmware-lab` deliberately strips all that: plain `gcc`/`make`, sub-second builds, host ASan
and libFuzzer — so 100% of the time goes to **learning Claude Code across the SDLC**. The
embedded *idioms* (HAL, ring buffer, register map, wire framing, trust boundaries) are all
there; only the toolchain tax is removed.

## Why Zephyr still belongs in the course

Your team ships it, so the natural question is *"does any of this transfer to our real Zephyr
tree?"* — and the honest answer is **yes, all of it**. The primitives and the autonomy ladder
are toolchain-agnostic. Show that explicitly so nobody dismisses the workshop as "only works
on toy code."

## The 15-minute demo (do this live near the end, or in the full-day version)

On a **pre-built** Zephyr `native_sim` sample (build it before the session — never live):

1. **`CLAUDE.md` for a Zephyr repo** — show one with the real house rules: "build with
   `west build -b native_sim`", "don't edit `zephyr/` or `modules/`", "respect Kconfig", "no
   blocking calls in ISRs". Same idea as the lab's, different specifics.
2. **Explore fan-out on devicetree** — "Which overlays define a `uart` node and where's the
   driver bound?" A read-only `Explore` sweep over `.dts`/`.overlay`/`Kconfig` is exactly the
   Module 2 move, and it's *more* valuable here because the tree is huge.
3. **A build-aware command** — a `/zephyr-build` command that knows your board/overlay flags,
   so `west build` quirks are encoded once (the rule-of-three capture, Module 1).
4. **The autonomy point** — debugging on hardware stays **L2** (you're at the JTAG probe);
   `west build` + twister test runs are delegable to **L4** in CI, just like Module 7. Same
   ladder, real tree.

## Take-home track

Give attendees a short worksheet: point Claude Code at their *own* Zephyr repo and (a) run
`/init`, (b) do an `Explore` fan-out to map a subsystem, (c) capture one `west` ritual as a
command, (d) write a `CLAUDE.md` with their real house rules. Everything they learned on
`firmware-lab` ports directly; this proves it on the code they actually ship.

## If you later want a Zephyr lab repo

If a future, longer course warrants it: fork a single `native_sim` sample (e.g.
`samples/subsys/console` or a `sensor` sample), pin the SDK in a **devcontainer/Codespace** so
setup is one click, pre-warm the build cache, and seed the *same* four defect classes
(unbounded decode, strcpy overflow, null deref, wrap bug) into the sample's app code. The
module text transfers nearly verbatim — only the build/run commands change.

⬅ Back to [COURSE.md](../COURSE.md)
