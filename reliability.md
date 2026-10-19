# CloseLoop reliability note

## What the fixture build does

- One synthetic enquiry maps to one stable lead key.
- Planned writes start only after one explicit approval.
- Each step records an audit entry when it starts and when it finishes.
- The Calendar step has one injected failure and one bounded retry.
- Steps that already succeeded keep their receipts during the Calendar retry.
- An exact replay uses the same idempotency key and reports zero new writes.
- Reset cancels a run in progress, so a cancelled run cannot write results back into the reset screen.
- The reply text sticks to the facts in the synthetic enquiry and is saved only as a draft.
- The interface labels fixture receipts as synthetic and does not claim live external writes.

## Checked in a browser

On 19 October 2026 the fixture path was run in a headless Chromium-based browser through the DevTools protocol at 320, 390, 768, 1024 and 1440 px. The check covered prepare, approve, one Calendar retry, four fixture writes, a replay with zero new writes and five skipped steps, and a reset in the middle of a run. The two-minute walkthrough was checked for pause, skipping to the last scene and restart.

## Not verified

- Live Gmail read or draft creation.
- Live Google Sheets row creation.
- Live GitHub issue creation.
- Live Google Calendar event creation.
- Provider record IDs, OAuth scopes and network retry behavior.
- A screen recording of the demo.
- Organizer acceptance of a submission.

## External write rule

Only connectors that are tested live may be described as connected. Fixture receipts are demonstration records, not provider receipts. If fewer than three live apps can be verified, the limitation is stated plainly rather than presented as an integration.
