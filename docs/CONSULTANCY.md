# AfriGrantPipeline consultancy launch

The consultancy model charges for an agreed engagement. Grant browsing and creator access do not require a subscription. There is no recurring checkout or automatic card charge.

## Creator access

The repository already identifies `mabrig1@gmail.com` as its owner. Sign in with Google using that address. Verified owner sign-in grants permanent admin access and legacy Platinum compatibility, without an expiry or payment. Existing admin accounts keep their access. `/admin` is the activation/help page; `/dashboard/consultancy` is the operating desk.

On first owner promotion, an unverified password on a pre-existing non-admin account is cleared to prevent registration by someone else from conferring creator access. Existing admins retain their password. Email ownership must be proved through Google; registering an allowlisted email alone does not grant privileges. Additional verified owner emails can be configured in `ADMIN_EMAILS`. The authenticated admin setup-secret fallback remains, with re-login required after promotion. Legacy GET bootstrap routes and subscription setters return 410.

## First engagement

1. Open the consultancy desk and create a case using your own account email for your project, or an academic's registered account email for client work.
2. Record institution (UNN, NOUN or another), career stage, department, topic, brief, desired service and deadline.
3. For a client engagement, issue an NGN quote with deliverables, turnaround and payment terms. The client accepts its exact version in their own workspace. Accepted scope cannot be overwritten.
4. Search grants and partners. Source notes are saved under Documents. Database matches use transparent topic overlap and must be reviewed for eligibility. Search-engine leads are not automatically turned into verified grant records.
5. Prepare concept notes, proposals, budgets, partnership briefs, unsigned MoUs and progress reports. Select a grant or paste official call requirements. Save revisions and mark reviewed documents approved.
6. Download Markdown text, record confirmed payments, and track application, award and reporting milestones. Payment totals reflect creator-entered receipts, not bank verification.

## Runtime configuration

New consultancy routes run directly in Next.js on the existing deployment, use NextAuth sessions, and persist in MongoDB. They do not require the legacy Express/Railway service.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` or existing `MONGODB_URI` | Cases, clients, grants and document versions |
| `AUTH_SECRET`, Google OAuth variables | Existing authentication |
| `OPENROUTER_API_KEY` and optional `OPENROUTER_MODEL` | Preferred AI draft provider |
| `ANTHROPIC_API_KEY` and optional `ANTHROPIC_MODEL` | Alternative AI provider when OpenRouter is absent |
| `TAVILY_API_KEY` | Per-case live grant and partner searches |
| `CRON_SECRET` | Existing daily official-source grant update |

Without AI/search credentials, intake, quotes, payment recording, manual documents and case tracking still work. Missing-provider states explain the dependency. Provider usage can incur charges on the configured account; creator premium access waives platform membership, not provider costs. No keys are returned to the browser.

## Access and review boundaries

- Client lists and detail routes are limited to the authenticated client ID. Creator privileges require both a server-issued admin session and current database admin role.
- Clients cannot change stages, fees, payment records, documents or partner records, or invoke paid agents. They can submit briefs, view their case and accept their quote.
- Search sends research topics/discipline, not contact details or full briefs. AI drafting sends the authorized case brief to the configured AI provider.
- A case lock prevents simultaneous agent runs on the same case. Optimistic concurrency prevents silent overwriting of other case edits. Provider timeouts and no automatic retries bound a drafting request.
- Source notes and model responses are untrusted text. Drafts do not constitute funder eligibility decisions, signed partnerships, legal agreements or application submission.
- Applicant details are isolated per case; the existing creator biography is not injected into client drafts. Missing facts are marked for confirmation.
- No email is sent, no MoU is signed and no grant application is submitted by these workflows.
- List responses exclude document bodies and working records. Detail views load separately. Each case supports up to 100 document versions; list view shows the latest 200 cases. These limits should be revisited as the consultancy grows.

## Validation

Run `node --test tests/consultancy.test.cjs`, `npm run typecheck`, and `npm run build`.
The route tests use isolated auth/database adapters to exercise access restrictions, quote-version acceptance, payment validation, document preservation and intake ownership. They do not replace a deployment check against the real MongoDB, Google OAuth and paid AI/search accounts.
