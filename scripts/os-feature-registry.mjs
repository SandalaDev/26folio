#!/usr/bin/env node
// Registry and evidence rules for privacy-bounded Agent OS operation telemetry.
// Observation policies are machine-readable. "log-start" is reserved for the
// dispatcher features present when commands.jsonl was introduced; "marker"
// starts at an explicit observation-start event written by telemetry v2.

export const OPPORTUNITY_TYPES = {
  session: "each completed session in the feature observation window",
  "task-session": "each dated task-attributed session in the observation window",
  "long-session": "each dated session over the documented duration threshold",
  "completed-task": "each resolved task completion in the observation window",
  "handoff-event": "each dated crash or session handoff in the observation window",
  "dependency-plan": "each dependency plan with a reliable date in the observation window",
  "feature-branch": "each dated session on a non-trunk branch in the observation window",
  unknown: "no defensible denominator; raw use only",
};

export const THRESHOLDS = {
  minOpportunities: 10,
  underusedUtilization: 0.10,
  overuseMaterialFactor: 1.5,
  overuseMinSessions: 3,
  automationMinUses: 5,
  automationMinSuccessRate: 0.90,
  pruningMinOpportunities: 10,
  failingMinFailures: 3,
  failingRate: 0.20,
  failingMinUsesForRate: 5,
  coreUtilization: 0.50,
  coreSuccessRate: 0.80,
  longSessionMinutes: 60,
};

const dispatcher = (id, commands, options = {}) => ({
  id, commands, observationPolicy: "log-start", introducedAt: "telemetry-v1",
  pruneable: false, automatable: false, opportunity: "unknown",
  maxUsesPerOpportunity: null, ...options,
});
const entrypoint = (id, commands, options = {}) => ({
  id, commands, observationPolicy: "marker", introducedAt: "telemetry-v2",
  pruneable: false, automatable: false, opportunity: "unknown",
  maxUsesPerOpportunity: null, ...options,
});

// A cadence is declared only where the operation has one defensible maximum
// meaningful use per opportunity. Features without one still expose raw
// uses/session and repeated sequences, but abstain from an overuse conclusion.
export const FEATURES = [
  dispatcher("session-start", ["start", "onboard"], { opportunity: "session", maxUsesPerOpportunity: 1 }),
  dispatcher("session-end", ["end"], { opportunity: "session", maxUsesPerOpportunity: 1 }),
  dispatcher("session-checkpoint", ["checkpoint"], { pruneable: true, automatable: true, opportunity: "long-session", maxUsesPerOpportunity: 2 }),
  dispatcher("session-switch", ["switch"], { opportunity: "handoff-event", maxUsesPerOpportunity: 1 }),
  dispatcher("task-claim", ["claim"], { opportunity: "task-session", maxUsesPerOpportunity: 1 }),
  dispatcher("task-done", ["done"], { opportunity: "completed-task", maxUsesPerOpportunity: 1 }),
  dispatcher("task-release", ["release"], { pruneable: true, automatable: true, opportunity: "task-session", maxUsesPerOpportunity: 1 }),
  dispatcher("memory-decide", ["decide"]),
  dispatcher("session-context", ["context"], { pruneable: true, automatable: true, opportunity: "session" }),
  dispatcher("dependency-plan", ["deps"], { opportunity: "dependency-plan" }),
  dispatcher("rc-workflow", ["rc"], { opportunity: "unknown" }),
  dispatcher("migration-workflow", ["migrate"], { opportunity: "unknown" }),
  dispatcher("branch-pr", ["pr"], { automatable: true, opportunity: "feature-branch", maxUsesPerOpportunity: 1 }),
  dispatcher("branch-sync", ["sync"], { automatable: true, opportunity: "feature-branch", maxUsesPerOpportunity: 1 }),
  dispatcher("state-check", ["check"], { pruneable: true, automatable: true, opportunity: "session" }),
  dispatcher("state-status", ["status"], { pruneable: true, automatable: true, opportunity: "session" }),
  dispatcher("view-render", ["render"], { automatable: true, opportunity: "session" }),
  dispatcher("system-doctor", ["doctor"], { automatable: true }),
  entrypoint("project-intake", ["intake:brief", "intake:interview", "intake:ready", "intake:status"]),
  entrypoint("work-shaping", ["new-task:task", "new-task:epic"]),
  entrypoint("branch-workflow", ["branch:start", "branch:base", "branch:guard", "branch:sync-dev", "branch:cleanup", "branch:promote"]),
  entrypoint("skill-governance", ["skills:validate", "skills:audit", "skills:add"]),
  entrypoint("system-setup", ["setup:run"]),
  entrypoint("template-update", ["template-update:apply"]),
  entrypoint("frontend-elicitation", ["elicit:questionnaire", "elicit:ready", "elicit:preview", "elicit:status"]),
];

const commandToFeature = new Map();
for (const feature of FEATURES) for (const command of feature.commands) commandToFeature.set(command, feature);

export function featureForCommand(command) { return commandToFeature.get(command) || null; }
export function featureById(id) { return FEATURES.find(feature => feature.id === id) || null; }
export function featureForEvent(event) {
  return featureById(event?.feature) || featureForCommand(event?.action || event?.cmd) || null;
}

export function repetitionEvidence(feature, stats, thresholds = THRESHOLDS) {
  const opportunities = stats.opportunities;
  const uses = stats.uses || 0;
  const sessions = stats.sessionsWithUse || 0;
  const cadence = Number(feature.maxUsesPerOpportunity);
  if (opportunities == null || !(cadence > 0)) {
    return { status: "under-observed", ratio: opportunities > 0 ? uses / opportunities : null,
      rationale: cadence > 0 ? "The opportunity denominator is unknown." : "No defensible expected cadence; raw repetition only." };
  }
  if (opportunities < thresholds.minOpportunities) {
    return { status: "under-observed", ratio: opportunities > 0 ? uses / opportunities : 0,
      rationale: `Only ${opportunities} aligned opportunities; the repetition sample is too small.` };
  }
  const ratio = opportunities > 0 ? uses / opportunities : 0;
  const materiallyHigh = ratio > cadence * thresholds.overuseMaterialFactor;
  if (materiallyHigh && sessions < thresholds.overuseMinSessions) {
    return { status: "one-session burst", ratio,
      rationale: `${uses} uses exceed the ${cadence}/opportunity cadence, but occur across only ${sessions} distinct session(s).` };
  }
  if (materiallyHigh) {
    return { status: "overused", ratio,
      rationale: `${uses} uses across ${opportunities} opportunities and ${sessions} sessions exceed the declared ${cadence}/opportunity cadence.` };
  }
  return { status: "healthy cadence", ratio,
    rationale: `${uses} uses across ${opportunities} opportunities stay within the declared ${cadence}/opportunity cadence.` };
}

export function classify(feature, stats, thresholds = THRESHOLDS) {
  const uses = stats.uses || 0;
  const failures = stats.failures || 0;
  const successes = uses - failures;
  const successRate = uses > 0 ? successes / uses : null;
  const failureRate = uses > 0 ? failures / uses : null;
  const opportunities = stats.opportunities;
  const repetition = repetitionEvidence(feature, stats, thresholds);

  if (failures >= thresholds.failingMinFailures
    || (uses >= thresholds.failingMinUsesForRate && failureRate > thresholds.failingRate)) {
    return { classification: "failing", automationCandidate: false, repetition,
      rationale: `${failures} failure(s) across ${uses} use(s); investigate before judging utilization.` };
  }
  const automationCandidate = repetition.status === "overused" && feature.automatable
    && uses >= thresholds.automationMinUses && successRate >= thresholds.automationMinSuccessRate;
  if (repetition.status === "overused") {
    return { classification: "overused", automationCandidate, repetition, rationale: repetition.rationale };
  }
  if (opportunities == null) {
    return { classification: "under-observed", automationCandidate: false, repetition,
      rationale: "No aligned opportunity denominator; raw use only, so underuse is not inferred." };
  }
  if (opportunities < thresholds.minOpportunities) {
    return { classification: "under-observed", automationCandidate: false, repetition,
      rationale: `Only ${opportunities} aligned opportunities; the utilization sample is too small.` };
  }
  const utilization = opportunities > 0 ? uses / opportunities : 0;
  if (feature.pruneable && failures === 0 && utilization < thresholds.underusedUtilization) {
    return { classification: "pruning candidate", automationCandidate: false, repetition,
      rationale: `${opportunities} aligned opportunities, ${uses} use(s), and no failures hiding use; human review is required.` };
  }
  if (utilization < thresholds.underusedUtilization) {
    return { classification: "underused", automationCandidate: false, repetition,
      rationale: `${opportunities} aligned opportunities but only ${uses} use(s) (${Math.round(utilization * 100)}%).` };
  }
  if (utilization >= thresholds.coreUtilization && successRate != null && successRate >= thresholds.coreSuccessRate) {
    return { classification: "core", automationCandidate: false, repetition,
      rationale: `Used in ${Math.round(utilization * 100)}% of aligned opportunities at ${Math.round(successRate * 100)}% success.` };
  }
  return { classification: "healthy", automationCandidate: false, repetition,
    rationale: `Used in ${Math.round(utilization * 100)}% of aligned opportunities.` };
}
