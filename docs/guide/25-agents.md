## Switch agents and delegate work

The coordinator owns the active session and integrates work. A different harness can resume from the same repository without needing the old chat. Parallel workers use isolated worktrees and return evidence to the coordinator.

### Switch after a rate limit or at a natural boundary

Ask the outgoing agent to save a handoff. It runs:

```bash
bash scripts/os.sh switch "Implementation is saved; next inspect the preview and run the task checks. See the task and verification evidence."
```

Use a real note with changed paths, remaining decisions and evidence. `switch` checkpoints, writes a session handoff and ends the session while preserving the task claim. It does not launch the next harness.

Open the same product checkout in the new harness and say “Onboard from the saved handoff and continue.” The incoming agent runs:

```bash
bash scripts/os.sh onboard
bash scripts/os.sh next
```

Onboard starts a session and prints a packet with intent, state, current work and continuity information. Read the referenced files before acting. Once consumed, archive the handoff so it does not remain a pending next action.

### If the outgoing agent cannot respond

Check whether it is actually stopped. A fresh lock defaults to a 120-minute live-session window, configurable with `OS_LOCK_TTL_MIN`. If you explicitly authorize replacing a stopped session, the incoming agent can run:

```bash
bash scripts/os.sh onboard --takeover
```

The old journal is preserved as a crash artifact. A stale lock follows crash recovery automatically. Review uncommitted changes and saved checkpoints before resuming; a preserved journal does not prove all previous operations completed. Never use takeover to run two coordinators in the same checkout.

### Identity and usage follow different evidence

The OS attempts harness detection. Optional environment variables improve session labels when the values are known:

```bash
export HARNESS_NAME="codex"
export MODEL_NAME="ACTUAL_MODEL_ID"
export AGENT_ROLE="executor"
```

These labels do not change the model selected in your harness. Imported usage keeps the model actually reported by the source; missing identity remains unknown. A provider such as DeepSeek, a harness such as OpenCode and a control surface such as T3 are separate concepts. Naming them is not the same as installing an adapter or launching a tool.

### Prepare independent workers

Use workers only when the task can be split into independently useful, nonoverlapping work. The agent records `parallel.suitable`, a reason, dependencies and the expected result, plus explicit `files_allowed`. Commit the shared base and task contract so each worktree receives the same requirements.

```bash
bash scripts/os.sh work assess TASK-002
bash scripts/os.sh work dispatch TASK-002 worker-a --harness codex
bash scripts/os.sh work status
```

Replace `codex` with the installed executable you intend to use. Dispatch checks that it answers `--version`, that interview readiness and dependencies are satisfied, and that file ownership does not overlap an active worker. It prepares `.agent-os-worktrees/worker-a` and a worker prompt at the committed base.

**Dispatch prepares isolation; it does not start a running agent.** Launch the returned prompt yourself or through your harness's authorized agent facility in that worktree. The worker sets `OS_WORKER_ID=worker-a`, reads `.agent-os-worker.json` and the task, and does not onboard or mutate coordinator state.

### Receive and integrate a result

The worker commits its work and returns a result record. For example, the coordinator saves a real result at `project-state/worker-result.json`:

```json
{
  "worker": "worker-a",
  "commit": "ACTUAL_WORKER_HEAD_COMMIT",
  "verification": "Paths and results of the checks actually performed"
}
```

Then:

```bash
bash scripts/os.sh work result project-state/worker-result.json
bash scripts/os.sh work integrate worker-a
bash scripts/os.sh verify-task TASK-002
```

Result validation checks the worker's HEAD and changed paths against ownership. Integration cherry-picks its commit range into the coordinator checkout, which must have unrelated changes saved. Conflicts require normal Git resolution or `git cherry-pick --abort`; do not mark a partial integration complete. Rerun relevant combined checks and import the worker's usage with explicit parent and session attribution. Independent work passing in isolation is not evidence that the combined result works.

Keep the worktree until its work and evidence are integrated. Inspect Git status before retiring it with normal `git worktree` operations. There is no OS command that silently cleans unfinished worker changes.
