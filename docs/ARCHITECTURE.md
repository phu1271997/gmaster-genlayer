# GMaster Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 14)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Landing    │  │   Tavern     │  │  Adventure   │           │
│  │      /       │  │   /tavern    │  │ /adventure/  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐                              │
│  │  Inventory   │  │ Hall of Fame │                              │
│  │ /inventory   │  │/hall-of-fame │                              │
│  └──────────────┘  └──────────────┘                              │
│                                                                  │
│  Wallet: MetaMask → genlayer-js → studionet RPC                  │
│  State: React hooks + polling (5s) for on-chain reads            │
│  Styling: TailwindCSS v4 + shadcn/ui + dark fantasy theme        │
│  Animation: framer-motion (combat shake, dice spin, overlays)    │
│  Toasts: sonner (thematic success/error messages)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ JSON-RPC (read/writeContract)
┌─────────────────────────────────────────────────────────────────┐
│              GENLAYER STUDIO (studionet)                         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              INTELLIGENT CONTRACT (Python)               │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐               │    │
│  │  │Character │  │   Game   │  │   Item   │  Dataclasses  │    │
│  │  └──────────┘  └──────────┘  └──────────┘               │    │
│  │         TreeMap[u256,Character]  characters              │    │
│  │         DynArray[Game]           games                   │    │
│  │         TreeMap[u256,str]        game_event_log_json     │    │
│  │         DynArray[Item]           items                   │    │
│  │         TreeMap[Address,str]     player_item_ids_json    │    │
│  │                                                          │    │
│  │  ┌────────────────────────────────────────────────────┐  │    │
│  │  │  NON-DETERMINISTIC CORE: take_action()              │  │    │
│  │  │  • Leader LLM runs DM prompt + RNG seed             │  │    │
│  │  │  • Validator re-runs same prompt                    │  │    │
│  │  │  • Consensus on decision fields (not narrative)     │  │    │
│  │  │  • run_nondet_unsafe(leader_fn, validator_fn)       │  │    │
│  │  └────────────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Consensus: Leader + Validators agree on dice & outcome fields   │
│  Storage: Auto-persisted on-chain (no external DB needed)        │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Character Creation** → `create_character(name, char_class)` → stores in `characters[Address]`
2. **Start Adventure** → `start_adventure(adventure_id)` → appends to `games[]`, mints empty log
3. **Take Turn** → `take_action(game_id, action)`:
   - Copies game + char + log into memory
   - Constructs DM prompt with RNG seed
   - `run_nondet_unsafe`: leader LLM → validators re-run → compare decision fields
   - Deterministically apply HP, loot, room advances, death/victory
   - Append narrative to JSON event log
4. **Read State** → `get_game`, `get_character`, `get_event_log` + frontend polling

## Why JSON Strings for Nested Data

GenLayer storage does not support nested `DynArray` or `TreeMap` inside `@allow_storage` dataclasses (Rule 6). We serialize:
- `game.state_json` → current monster, room description, rooms cleared
- `game_event_log_json[game_id]` → JSON array of log entries
- `player_item_ids_json[address]` → JSON array of item ID ints

This keeps storage flat and avoids `gl.storage.inmem_allocate` complexity.

## Frontend Polling Strategy

Adventure page polls every 5 seconds for:
- `get_game`
- `get_character`
- `get_event_log`
- `get_player_items`

This gives near-real-time updates without WebSockets (not available on studionet). Polling pauses on tab blur and resumes on focus.
