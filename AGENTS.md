# Project rules
- Keep the shared modular seating plan in its own versioned Supabase record; preserve legacy map and household table assignments because individual seats include children and independently seated companions.
- Validate modular seating layouts through the shared seating utility before saving; use compare-and-swap revisions to prevent overwriting another editor.
- Keep Guest types centralized in src/types/guestTypes.ts and map database snake_case to UI camelCase.