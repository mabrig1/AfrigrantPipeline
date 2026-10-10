# AfrigrantPipeline Agentic Publishing Engine

## Initial implementation
The first module provides a typed submission schema, deterministic manuscript screening, reference DOI format checks, a MongoDB submission model, and an auditable editorial lifecycle.

**Important:** This is a foundation, not a deployed autonomous journal. DOI format validation is not Crossref verification. Plagiarism detection, citation resolution, manuscript file parsing, authenticated API routes, reviewer assignment, notifications, and indexing are future integrations.

## Planned agent workflow
1. Intake agent validates manuscript and metadata.
2. Citation agent resolves DOI metadata through Crossref/OpenAlex and flags mismatches, never inventing references.
3. Integrity agent checks declarations, permissions, image concerns and similarity evidence, without automated misconduct verdicts.
4. Editor agent compiles explainable findings for a human editor.
5. Reviewer coordinator recommends qualified, conflict-free reviewers; invitations require editorial approval.
6. Production agent generates accessible HTML/PDF and metadata after acceptance.
7. Dissemination agent deposits approved records to authorized repositories and DOI registrars using configured credentials.

## Non-negotiable safeguards
- Authentication and role-based authorization before any submission mutation.
- Human editor controls acceptance, rejection, reviewer selection and publication.
- AI cannot generate reviewer identities, reviewer reports, DOIs or citations as verified facts.
- Preserve audit trails, consent, embargoes, licenses and author rights.
- Never send unpublished manuscripts to external AI providers without consent and a documented processing basis.
- Idempotent jobs and retry-safe processing before production automation.

## Next integration
Add protected Express routes and a publishing dashboard after checking existing auth and upload middleware. Configure DOI registration only after obtaining a legitimate Crossref/DataCite membership or sponsoring provider.
