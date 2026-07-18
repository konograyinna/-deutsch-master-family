# Mein Deutsch 2.3.0 — Test Report

## Automated checks

- JavaScript syntax (`node --check app.js`): PASS
- Content package validation (`python tools/validate-content.py .`): PASS
- Catalog JSON validation: PASS
- Content totals preserved: 5,250 cards per profile; 15,750 unique cards total
- PWA cache version updated to 2.3.0: PASS
- App and stylesheet cache-busting updated to 2.3.0: PASS

## Functional acceptance checklist

- Existing 2.2.0 progress migrates into Smart Repetition records.
- Completing a new lesson awards 15 XP and schedules review after 1 day.
- First review schedules the next review after 3 days.
- Further reviews schedule 7, 14 and 30 days, then remain at 30 days.
- Review queues are isolated by family profile.
- Dashboard shows “Repeat Today” only when reviews are due.
- “Повторено ✓” removes an item from today’s queue and awards 10 XP.
- Current and best streak values are stored per profile.
- Backup export/import includes learning-engine data.
- Reset removes both classic progress and Smart Repetition data.

## Status

Ready for manual browser and family acceptance testing before marking stable.
