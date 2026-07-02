# Instructor Answer Key — Seeded Defects in `firmware-lab`

> **CONFIDENTIAL — instructor answer key.** This file lives in the *course* repo, never in
> `firmware-lab`. The student repo ships a green build and passing tests; the bugs are in
> untested edge paths so static tools stay quiet and dynamic analysis (ASan / fuzzing) is
> what exposes them. That contrast *is* the lesson.
>
> **Self-study learner? ⚠️ Spoilers below — stop here.** The entire value of Modules 4–6 is
> driving Claude from *symptom* to *root cause* yourself (symptoms are in
> `firmware-lab/requirements/backlog.md`). Reading this key first robs you of exactly that
> rep. Come back only after you've fixed a bug — or been genuinely stuck past the point of
> learning.

Line numbers are approximate (they drift as students edit). Each defect maps to a
symptom-only ticket in `firmware-lab/requirements/backlog.md`.

---

## BUG-1 / FR-8 / SEC-1 — `proto_decode` frame overflow (the headline)

**File:** `src/protocol.c`, `proto_decode()`
**Backlog symptom:** "Device resets when the collector replies with certain short frames."

```c
uint8_t len = buf[0];               /* attacker-controlled, 0..255 */
size_t  payload_len = (size_t)len - 1;
...
memcpy(out->payload, &buf[2], payload_len);   /* (a) and (b) below */
*consumed = (size_t)len + 1;
```

Three distinct flaws:
1. **Output overflow (a):** `payload_len` is never checked against `PROTO_MAX_PAYLOAD` (62).
   A frame with `LEN=0xFF` writes 254 bytes into a 62-byte `out->payload`. Confirmed: under
   `-fstack-protector-all` it aborts with stack-smashing; under ASan it's a
   `stack-buffer-overflow` WRITE. This is the libFuzzer crash in SEC-1.
2. **Input over-read (b):** never checks `buf_len >= (size_t)len + 1`, so `memcpy` reads past
   the input buffer for short frames — the "certain *short* frames" in the ticket.
3. **Underflow:** `len == 0` makes `payload_len = (size_t)-1` (huge), an instant catastrophic
   `memcpy`.

**Fix:** validate before copying —
```c
if (buf_len < 2) return -1;
uint8_t len = buf[0];
if (len < 1) return -1;
size_t payload_len = (size_t)len - 1;
if (payload_len > PROTO_MAX_PAYLOAD) return -1;
if (buf_len < (size_t)len + 1) return -1;       /* whole frame present */
```
**Teaches:** trust-boundary validation (NFR-3); why the green unit suite missed it (only
well-formed frames tested); fuzzing finds what example-based tests don't.

---

## BUG-2 — `config_load` device_id overflow

**File:** `src/config.c`, `config_load()`
**Backlog symptom:** "Long `device_id` corrupts neighbouring settings."

```c
if (cJSON_IsString(id)) {
    strcpy(cfg->device_id, id->valuestring);   /* no bound vs CONFIG_DEVICE_ID_MAX (32) */
}
```
A `device_id` longer than 31 chars overflows the fixed array and smears the adjacent
`gw_config_t` fields — exactly "corrupted neighbouring settings."

**Fix:** `strncpy(cfg->device_id, id->valuestring, CONFIG_DEVICE_ID_MAX - 1);` and
NUL-terminate (or reject over-long ids).
**Teaches:** `strcpy` vs `strncpy`; struct-adjacent corruption; cppcheck *may* hint, ASan
nails it.

---

## BUG-3 — `config_load` NULL deref on missing `port`

**File:** `src/config.c`, `config_load()`
**Backlog symptom:** "`uplink` object with no `port` key hard-faults the device."

```c
cJSON *uplink = cJSON_GetObjectItem(root, "uplink");
if (uplink != NULL) {
    cJSON *port = cJSON_GetObjectItem(uplink, "port");
    cfg->uplink_port = (uint16_t)port->valueint;   /* port may be NULL */
}
```
`cJSON_GetObjectItem` returns NULL when the key is absent; `port->valueint` then dereferences
NULL. Note the inconsistency with the *other* fields, which correctly guard with
`cJSON_IsNumber` — a good code-review talking point.

**Fix:** `if (cJSON_IsNumber(port)) cfg->uplink_port = (uint16_t)port->valueint;`
**Teaches:** partial-input handling; consistency as a review signal; `gcc -fanalyzer` /
`scan-build` can flag the null path.

---

## BUG-4 — `rb_peek` missing wrap

**File:** `src/ring_buffer.c`, `rb_peek()`
**Backlog symptom:** "After the FIFO is busy a while, `peek` occasionally returns garbage."

```c
*out = rb->buf[rb->tail + offset];     /* no % rb->size */
```
Once `tail` is high and the buffered data wraps the array end, `tail + offset` indexes past the
backing array — an out-of-bounds read that returns whatever is adjacent in memory. The baseline
test only peeks at `tail == 0`, so it passes.

**Exact repro (validated under ASan on Linux):** on a size-8 buffer — fill 7, drain 6 (so
`tail == 6` with one element at index 6), then `put` 2 more (head wraps to index 0). Data now
occupies indices 6, 7, 0. `peek(2)` computes `buf[6+2] = buf[8]` → one past the end. ASan:
`stack-buffer-overflow READ ... in rb_peek`. On the fixed code `peek(2)` returns the element at
`(6+2) % 8 == 0`.

> **⚠ Instructor caution (this bit us — now fixed).** "Drive *many put/get cycles* then peek"
> does **not** reproduce BUG-4: paired put/get keeps `head` and `tail` level, so `tail+offset`
> never crosses the boundary and the test passes on buggy *and* fixed code. The regression test
> must engineer the wrap as above. Use this as a live teaching moment: *a test that doesn't
> recreate the condition is worse than no test — it manufactures false confidence.*

**Fix:** `*out = rb->buf[(rb->tail + offset) % rb->size];`
**Teaches:** wraparound bugs only appear when data spans the boundary; why a passing test can
give false confidence; ASan read-overflow detection; the discipline of proving a regression
test fails on the *unfixed* code before trusting it.

---

## Suggested mapping to modules

| Module | Defects used | Tool emphasis |
|---|---|---|
| 5 Debug | BUG-3 (crash, gdb), BUG-4 (ASan read), BUG-2 (ASan write) | gdb, ASan, hypothesis loop |
| 6 Security | BUG-1 (fuzz + fix + regression corpus), BUG-2 | libFuzzer, cppcheck/scan-build, secret-scan hook |
| 4 Test | add the missing tests that *would* have caught BUG-1/BUG-4 | coverage, property tests |
| 3 Implement | FR-7 CRC feature (not a bug — net-new) | clang-format hook, CLAUDE.md rules |

Keep the answer key closed during labs; reveal per-bug after attendees have driven Claude to
the root cause themselves.
