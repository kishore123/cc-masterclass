Orchestrate a fan-out: split the task below into independent subtasks and run them as parallel sub-agents, then merge.

Steps:
1. Break the task into 2–4 genuinely independent subtasks — none may depend on another's output. If the task is inherently sequential, say so and work it directly instead of fanning out.
2. Spawn one read-only Explore sub-agent per subtask, all in a single message so they run in parallel. Each prompt must be self-contained (workers don't see this conversation): state the repo path, the one question to answer, and that the worker must return only its conclusions, not file dumps.
3. When all workers return, merge: reconcile overlaps, flag any disagreements explicitly, and report one synthesized answer followed by a short per-worker appendix.

Task: $ARGUMENTS
