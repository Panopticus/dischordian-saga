# Rebuild Notes

## Current State (screenshot)
- Server is running, no TS errors
- The current homepage shows the Awakening boot sequence (intercepting signal, access granted)
- The old sidebar AppShell is still active — need to integrate CommandConsole
- The new CommandConsole.tsx and SettingsPage.tsx are created but not wired into App.tsx yet

## Next Steps
1. Wire CommandConsole into App.tsx replacing AppShell for post-awakening routes
2. Add SettingsPage route
3. Build the CoNexus Media Player component
4. Build the BioWare-style room tutorial dialog system
5. Wire progressive unlock system
6. Add Dream economy transaction log
