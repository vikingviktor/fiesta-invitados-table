# Project rules
- Use the versioned official wedding_seating_plan record as the sole source of tables and individual assignments; retain legacy records only as historical data because companions and children may sit independently.
- Store grid placement in a separate versioned wedding_seating_plan record and derive table footprints from official modules; the map may only reposition tables, rotate them 90°, or change grid dimensions.
- Validate modular seating layouts through the shared seating utility before saving; use compare-and-swap revisions to prevent overwriting another editor.
- Keep per-person menu overrides and name annotations inside official seating records, and derive seat display and exports from the shared seating utility so moving a person preserves their details.
- Keep Guest types centralized in src/types/guestTypes.ts and map database snake_case to UI camelCase.
- Generate seating PNGs from the rendered official plan with html2canvas-pro at full table width; prepare the blob before the final download click to preserve mobile user activation.