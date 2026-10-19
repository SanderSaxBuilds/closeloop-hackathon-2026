# CloseLoop

CloseLoop is an approval-gated revenue operations agent demo, built for the Multi-App AI Agent Hackathon. It turns one service enquiry into a reviewed plan, waits for one human approval, then runs each step with a receipt and an audit entry.

The current build is fixture-backed. It shows the full control flow on synthetic data. Live authenticated connectors have not been verified, and the demo does not claim that any Gmail, Google Sheets, GitHub or Google Calendar write has happened.

## Links

- Interactive demo: https://sandersaxbuilds.github.io/closeloop-hackathon-2026/
- Two-minute walkthrough: https://sandersaxbuilds.github.io/closeloop-hackathon-2026/demo.html
- Repository: https://github.com/SanderSaxBuilds/closeloop-hackathon-2026

The walkthrough is a timed, captioned browser page that steps through the same fixture path. It is not a recording of live provider writes.

## Try it

1. Open `index.html`.
2. Review the synthetic Maya Chen renovation enquiry.
3. Choose **Prepare action plan**.
4. Review the planned Sheets, GitHub, Calendar and Gmail draft actions.
5. Choose **Approve and execute**.
6. Watch the Calendar step fail once, retry and continue without repeating the steps that already succeeded.
7. Choose **Replay same enquiry** when the run finishes.
8. Check that the replay shows zero new writes.

**Reset fixture** returns to the start at any point, including in the middle of a run.

## Safety rules

- The enquiry is synthetic.
- No email is sent. The reply is saved as a draft only.
- No price, delivery date or availability is invented.
- Every planned write carries a stable lead key and an evidence record.
- An exact replay stops before any new write.

## Connector status

The interface runs on deterministic fixture adapters. Each app needs live verification before it can be described as connected. Receipt IDs shown in fixture mode are labelled as synthetic demo receipts.

## Files

- `index.html` is the interactive demo.
- `demo.html` is the two-minute captioned walkthrough.
- `styles.css` holds the visual system for the interactive demo.
- `app.js` holds the approval gate, retry, audit log, duplicate replay and reset logic.
- `reliability.md` lists what the fixture build supports and what is still unverified.
- `submission-checklist.md` separates completed local work from remaining live verification.
