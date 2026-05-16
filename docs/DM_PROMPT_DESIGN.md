# DM Prompt Design

## Goal

Produce **deterministic decision fields** across different LLMs (GPT-4, Claude, Llama) while allowing **free-form narrative variance**.

## Technique: RNG Seed in Prompt

We explicitly embed the RNG seed in the prompt text so every LLM participating in consensus receives the exact same input:
```
You MUST seed your dice rolls using this string: "{rng_seed}"
- Hash this string mentally and use it to produce reproducible rolls
```

This leverages the fact that LLMs, given identical system prompts + identical seed descriptions, will produce highly correlated numeric outputs within the bounds of our validator tolerance (±2 for HP changes).

## Prompt Structure

```
1. GAME RULES (D&D 5e simplified)     → establishes shared ruleset
2. DETERMINISTIC DICE ROLLING         → RNG seed + consistency instructions
3. CURRENT STATE                      → adventure, room, monster, character sheet
4. RECENT EVENTS (last 10)            → narrative context & continuity
5. PLAYER'S ACTION                    → the input to adjudicate
6. YOUR TASK                          → step-by-step instructions
7. OUTPUT (JSON ONLY)                 → strict schema with typed fields
8. CRITICAL RULES                     → hard constraints (loot pool, victory conditions)
```

## Why JSON-Only Output

- Easier to parse in Python (`json.loads`)
- Schema enforcement reduces hallucination
- Validators can do strict field comparison

## Critical Rules to Prevent Divergence

| Rule | Purpose |
|------|---------|
| Loot ONLY from loot_pool | Prevents LLM from inventing items |
| victory = true ONLY in final room after boss | Prevents premature wins |
| If action impossible → critical_failure | Handles edge cases consistently |
| Round dice results to integers | Keeps comparisons clean |

## Validator Tolerance Strategy

We accept **same outcome fields** with **±2 tolerance on numeric deltas**. Why ±2?
- Different LLMs may round edge cases differently
- Small HP variance doesn't change game trajectory
- Keeps consensus rate high while maintaining integrity

If validators disagree, the transaction is marked **undetermined** and can be retried.
