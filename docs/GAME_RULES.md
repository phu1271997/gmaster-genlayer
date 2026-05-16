# GMaster Game Rules

## Character Stats

| Stat  | Range | Modifier Formula     |
|-------|-------|----------------------|
| STR   | 8–18  | `(STR - 10) // 2`    |
| DEX   | 8–18  | `(DEX - 10) // 2`    |
| INT   | 8–18  | `(INT - 10) // 2`    |
| WIS   | 8–18  | `(WIS - 10) // 2`    |

## Starting HP by Class

| Class   | HP  | Stats (STR / DEX / INT / WIS) |
|---------|-----|-------------------------------|
| Warrior | 14  | 16 / 12 /  8 / 10            |
| Rogue   | 11  | 10 / 16 / 12 /  8            |
| Mage    |  8  |  8 / 12 / 16 / 14            |
| Cleric  | 12  | 12 / 10 / 10 / 16            |

## Dice Mechanics

All dice rolls are performed by an LLM seeded deterministically by:
```
RNG_SEED = "{game_id}-{turn_count}-{action[:32]}"
```

Multiple validators independently re-run the same prompt with the seed and must agree on the outcome.

### Skill Check
```
d20 + modifier vs DC
DC 5  = trivial
DC 10 = easy
DC 15 = medium
DC 20 = hard
DC 25 = very hard
```
- Roll ≥ DC → **success**
- Natural 20 → **critical_success** (auto succeed + bonus)
- Natural 1 → **critical_failure** (auto fail + complication)

### Combat
```
Attack Roll: d20 + STR_mod or DEX_mod vs monster AC (typically 10–16)
Hit Damage:  weapon die (d6 default) + modifier
Player AC:   10 + DEX_mod (no armor v1)
```

## Loot & Items

Items dropped by the DM must come from the adventure's `loot_pool`. Valid item types:
- `weapon` — used in combat (cosmetic equip v1)
- `armor` — worn (cosmetic equip v1)
- `consumable` — Health Potions heal +10 HP on use
- `treasure` — no combat effect
- `victory_token` — commemorates dungeon completion

## Death

If `death = true` in a DM response, or HP reaches 0:
- `character.is_alive = false`
- `game.is_active = false`
- Player must create a new character at `/tavern`

## Victory

`victory = true` **only** when:
- Player is in the **final room**
- The **boss** is defeated
- Awards:
  - Victory Token (on-chain item)
  - +100 EXP
  - `character.victories++`

## Equivalence Principle (Consensus)

For non-deterministic operations, validators compare **decision fields** (not narrative):
- Strict equality: `outcome`, `room_advances`, `combat_ends`, `game_ends`, `victory`, `death`
- Set equality: `loot_dropped`
- ±2 tolerance: `hp_change`, `monster_hp_change`
- **Ignored**: `narrative`, `dice_rolls` arrays

This ensures different LLMs (GPT, Claude, Llama) can reach consensus on game state while freely varying prose.
