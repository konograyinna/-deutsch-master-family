# Mein Deutsch 2.4.0 Sprint 1 — Test Report

## Automated checks
- JavaScript syntax: passed (`node --check app.js`)
- Content validation: passed
- Profile card counts: 5,250 each
- Total unique cards: 15,750
- PWA asset versions updated to 2.4.0
- Lernfreund backup/export/reset integration present

## Family acceptance tests still required
1. Each profile can choose its own starter pet.
2. Pet selection persists after closing and reopening the app.
3. Changing one profile's pet does not affect another profile.
4. Dashboard card shows the selected pet, XP and level.
5. Mood changes between happy, sleeping and celebrating.
6. Locked pets cannot be selected.
7. Existing 2.3.0 progress, reviews, XP and streaks remain intact.
8. Backup export/import preserves pet choices.
9. Offline mode works after the first online load.

Status: alpha build ready for family testing.
