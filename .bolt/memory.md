# Project memory

## Product intent & audience

- Dota AI Coach for DotA Allstars 7.03b2 (legacy Warcraft 3 mod).
- Tactical pre-game planning tool: hero drafting, position assignment, tower state, farm allocation on a battle map.

## Brand personality & voice

- Utility-focused coaching UI; terse, state-driven.

## Visual design & UX direction

- Battle map with fixed percentage-based positions relative to map container; responsive on resize.
- Hero markers show portrait/icon + name; occupied positions are interactive.
- Farm markers are yellow, always visible.
- Selection model: click occupied position to select (highlight), click same-team target to move/swap, click selected again to cancel. No drag-and-drop.
- Edit actions (replace/remove/solo farm) exposed via a small edit control (pencil) rather than primary click.
- Two factions: Sentinel and Scourge; positions/towers/farm pairs carry fixed team ownership.

## Decisions, constraints & rationale

- 10 fixed hero positions (5 per team); coordinates preserved, not modified.
- 12 tower positions with ALIVE/DESTROYED toggle; coordinates preserved.
- Exactly 4 farm markers: F01/F02 = one team pair, F03/F04 = opposing team pair; pairs never mix across teams. Team ownership follows existing map geography/faction layout, not arbitrary assignment.
- Solo farm: one per team max; assigning assigns both of that team's farm markers to the hero; replaces previous same-team solo farm; disabling clears both markers but keeps them visible; hero stays in its existing position.
- Cross-team swaps rejected; duplicate hero assignments prevented.
- Build: TypeScript + Vite; production build used as type/build check.
- Not implemented: neutral camps, secret shops, auto tracking, auto game-state detection, extra hero positions, redesigns.

## Open questions & assumptions

- Farm pair-to-faction mapping inferred from existing map/faction layout; verify F01/F02 and F03/F04 team labels match Sentinel/Scourge as intended.
- No browser tool available in workspace; interaction tests are code-path review only, not runtime UI tests.