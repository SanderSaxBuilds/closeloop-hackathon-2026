# CloseLoop

CloseLoop is an approval-gated revenue operations agent demo for the Multi-App AI Agent Hackathon.

The current build is fixture-backed. It demonstrates the complete control flow using synthetic data while live authenticated connectors remain pending verification. It does not claim that Gmail, Google Sheets, GitHub, or Google Calendar writes have occurred.

## Demo path

1. Open `index.html`.
2. Review the synthetic Maya Chen renovation enquiry.
3. Choose `Prepare action plan`.
4. Review the planned Sheets, GitHub, Calendar, and Gmail draft actions.
5. Choose `Approve and execute`.
6. Watch the Calendar adapter fail once, recover, and continue without repeating successful steps.
7. Choose `Replay same enquiry` after completion.
8. Confirm that the replay shows zero new writes.

## Safety boundary

- The fixture is synthetic.
- No email is sent automatically.
- The reply is represented as a draft only.
- No pricing, delivery date, or availability is invented.
- Every planned external write has a stable lead key and evidence record.
- Duplicate replay stops before any new write.

## Current connector status

The UI uses deterministic fixture adapters. Live connector verification is still required before describing any app as connected in the final submission. External record identifiers shown in fixture mode are clearly labelled as synthetic demo receipts.

## Files

- `index.html` is the self-contained demo shell.
- `styles.css` contains the visual system.
- `app.js` contains the approval gate, retry logic, audit log, and duplicate replay logic.
- `reliability.md` records the reliability claims that the current fixture build can support.
- `submission-checklist.md` separates completed local work from remaining live verification.
