// Model roster for the eval harness.
//
// IMPORTANT: these slugs are the *intended* tier mapping per vendor, sourced
// from August 2026 leaderboard research. Exact OpenRouter slugs change fast.
// Run `npm run verify-models` to check every slug resolves on OpenRouter
// before spending money.

export const VENDORS = {
  anthropic: {
    label: 'Anthropic',
    tiers: {
      cheap: 'anthropic/claude-haiku-4-5',
      standard: 'anthropic/claude-sonnet-4-5',
      frontier: 'anthropic/claude-opus-4-5',
      apex: 'anthropic/claude-fable-5',
    },
  },
  openai: {
    label: 'OpenAI',
    tiers: {
      cheap: 'openai/gpt-5-nano',
      standard: 'openai/gpt-5.1-mini',
      frontier: 'openai/gpt-5.1',
      apex: 'openai/gpt-5.1-max',
    },
  },
  gemini: {
    label: 'Google (Gemini)',
    tiers: {
      cheap: 'google/gemini-3-flash',
      standard: 'google/gemini-3-pro',
      frontier: 'google/gemini-3-ultra',
      apex: 'google/gemini-3-ultra',
    },
  },
  openweights: {
    label: 'Open-weight',
    tiers: {
      cheap: 'qwen/qwen3-coder-30b-a3b',
      standard: 'deepseek/deepseek-v4-pro',
      frontier: 'z-ai/glm-5.2',
      apex: 'z-ai/glm-5.2',
    },
  },
};

export const TIER_ORDER = ['cheap', 'standard', 'frontier', 'apex'];

export const ARMS = {
  'all-frontier': { description: 'every unit on the frontier tier (status quo)' },
  'all-standard': { description: 'every unit on the standard tier (cheap status quo)' },
  'tiered': { description: 'tiered-dispatch skill policy with escalation' },
};

export const DEFAULT_SEEDS = 5;
export const MAX_TIER_RETRIES = 1; // hysteresis: max ONE retry per tier
export const MAX_ATTEMPTS_PER_UNIT = 8; // hard safety cap against runaway escalation