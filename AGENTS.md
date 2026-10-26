# Project rules
- Use the versioned official wedding_seating_plan record as the sole source of tables and individual assignments; retain legacy records only as historical data because companions and children may sit independently.
- Store grid placement in a separate versioned wedding_seating_plan record and derive table footprints from official modules; the map may only reposition tables, rotate them 90°, or change grid dimensions.
- Validate modular seating layouts through the shared seating utility before saving; use compare-and-swap revisions to prevent overwriting another editor.
- Keep Guest types centralized in src/types/guestTypes.ts and map database snake_case to UI camelCase.