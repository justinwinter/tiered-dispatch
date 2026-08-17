// Model roster for the eval harness.
//
// Slugs verified against the OpenRouter /models endpoint on 2026-08-17.

export const VENDORS = {
  anthropic: {
    label: 'Anthropic',
    tiers: {
      cheap: 'anthropic/claude-haiku-4.5',
      standard: 'anthropic/claude-sonnet-5',
      frontier: 'anthropic/claude-opus-5',
      apex: 'anthropic/claude-fable-5',
    },
  },
  openai: {
    label: 'OpenAI',
    tiers: {
      cheap: 'openai/gpt-5-nano',
      standard: 'openai/gpt-5.6-terra',
      frontier: 'openai/gpt-5.6-sol',
      apex: 'openai/gpt-5.6-sol-pro',
    },
  },
  gemini: {
    label: 'Google (Gemini)',
    tiers: {
      cheap: 'google/gemini-3.5-flash-lite',
      standard: 'google/gemini-3.5-flash',
      frontier: 'google/gemini-3.1-pro-preview',
      apex: 'google/gemini-3.1-pro-preview',
    },
  },
  openweights: {
    label: 'Open-weight',
    tiers: {
      cheap: 'qwen/qwen3-coder-30b-a3b-instruct',
      standard: 'deepseek/deepseek-v4-flash',
      frontier: 'deepseek/deepseek-v4-pro',
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