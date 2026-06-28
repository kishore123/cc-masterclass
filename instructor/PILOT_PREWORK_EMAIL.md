# Pilot pre-work email (copy-paste ready)

Send this to the pilot group **at least 3 days before** the session. The 20 minutes of setup
here is what protects the live time — a room debugging `apt` is the session failing. The
commands below were verified from a clean clone on Ubuntu 26.04 (WSL2).

---

**Subject: Before the Claude Code masterclass pilot — 20 min of setup (please do by [DATE])**

Hi all,

Thanks for piloting the Claude Code SDLC masterclass with me. You're the first run, so part of
your job is to tell me where it's rough — but first we need everyone's environment working.
Please do these four steps and reply **"verified"** (or send me the error) by **[DATE]**.

It's ~20 minutes. Don't skip step 4.

**1. Install Claude Code and sign in.**
Run `claude` once and confirm `/help` works.

**2. Get a Linux build environment.**
- **macOS / Linux:** you're set — you already have `gcc`/`clang` and `make`.
- **Windows:** install **WSL2 (Ubuntu)** — we need AddressSanitizer and a fuzzer, which do not
  run on native Windows. In PowerShell: `wsl --install -d Ubuntu`, reboot if prompted, then
  open the Ubuntu terminal for the next steps.

**3. Install the toolchain** (run inside WSL/Ubuntu, or your Mac/Linux terminal):
```bash
sudo apt update && sudo apt install -y build-essential clang cppcheck gdb git
```
(macOS: `xcode-select --install` covers gcc/clang/make; `brew install cppcheck` for the rest.)

**4. Clone the lab and verify it builds — do NOT skip this:**
```bash
git clone https://github.com/kishore123/firmware-lab.git
cd firmware-lab
make && make test
./build/sensor-gw
```
You should see a clean build, **"13 Tests 0 Failures"**, and the gateway print a few lines.

Reply **"verified"** when that passes, or paste the error and I'll help.

**What to bring / expect:** a laptop with the above working, ~3 hours, and a willingness to
say "this instruction didn't work." We'll take one feature from a requirement all the way to a
tested, fuzzed change — and you'll learn Claude Code by doing it.

See you [DATE/TIME].

[Your name]

---

### Instructor notes (don't send)

- Have 1–2 spare WSL images or a cloud dev container ready for stragglers.
- The single highest-risk step is #2/#3 on Windows. Chase non-replies a day early.
- Mac on Apple Silicon: all labs work natively; no WSL needed.
- If someone truly can't get sanitizers working, pair them with a neighbor for Modules 5–6.
