# CloseLoop reliability note

## Implemented in the current local fixture build

- One synthetic enquiry is designed to map to one stable lead key.
- The workflow code requires one explicit approval before planned writes begin.
- Each step is coded to record an audit entry before and after completion.
- Calendar has one bounded injected failure path and one retry in code.
- Successful prior fixture steps are retained during the Calendar retry path.
- An exact replay path uses the same idempotency key and reports zero new writes.
- The generated reply text is factual to the synthetic fixture and is represented only as a draft.
- The UI text states clearly that fixture receipts are synthetic and does not claim live external writes.

These items have not yet been runtime-tested in a browser during this session because the current desktop surface is blocked by foreground focus contention.

## Not yet verified

- Live Gmail read or draft creation.
- Live Google Sheets row creation.
- Live GitHub issue creation.
- Live Google Calendar event creation.
- Provider record IDs, OAuth scopes, and network retry behavior.
- Public repository publication.
- Two-minute recorded demo.
- Organizer submission acceptance.

## External write rule

The final submission must describe only the connectors that are actually tested live. Fixture receipts are demonstration records, not provider receipts. If fewer than three live apps can be verified, the limitation must be stated plainly rather than converted into a claim of integration.
