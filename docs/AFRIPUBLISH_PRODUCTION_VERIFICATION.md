# AfriPublish production verification

## Required environment
- DATABASE_URL or MONGODB_URI: MongoDB connection used by `connectDB()`.
- NextAuth configuration already required by the application.
- OPENAI_API_KEY: optional for AI chat; never expose it in client code.
- PUBLISHING_AI_MODEL: optional, defaults to `gpt-4o-mini`.

## Release checks
1. Verify the deployed commit includes `/publishing/workspace`, `/publishing/assistant`, `/api/publishing`, `/api/publishing/decision`, `/api/publishing/ai` and `/publications/record/[id]`.
2. Sign in as a normal user; create a draft with valid title, abstract, author and body.
3. Confirm the draft is visible to its creator but not publicly accessible.
4. Confirm unauthenticated requests to publishing APIs return 401.
5. Confirm non-owner editorial decisions return 403.
6. Sign in as a verified owner; approve then publish a *test manuscript*.
7. Confirm the public URL is readable, but unpublished IDs return 404.
8. Confirm the AI endpoint returns 503 without OPENAI_API_KEY, or a response with it.
9. Check Vercel runtime logs and MongoDB connectivity; remove test records after verification.
10. Do not imply repository publication is peer-reviewed acceptance or DOI registration.

## Operational limitations
- The editor workflow uses `verifiedOwner` authorization; confirm the correct account has that flag.
- The current chatbot is not a ChatGPT connector/MCP server. Publishing from a ChatGPT conversation requires a separately scoped integration and explicit publication authorization.
- GitHub CI success is not proof of production runtime health.
- Never paste environment secrets into an issue or public pull request.
