# UpShift

UpShift is a learning platform starter built from the supplied standalone HTML reference. The reference is preserved as `design-reference.html`. The application uses Next.js App Router, React, TypeScript, Tailwind CSS, Express, PostgreSQL, and Prisma.

## Current implementation

- Responsive branded home, course library, course detail, about, and 404 pages.
- API-backed published course listing, filtering by search text, and course detail/curriculum display.
- Relational Prisma models for courses, chapters, topics, resources, assessments, questions, answer options, attempts, admins, and site settings.
- Public API excludes draft courses and nested draft content, validates search/filter/pagination inputs, and documents response workflows in `docs/openapi.yaml`.
- Anonymous server-scored assessment API endpoints; pre-submission payloads omit answer keys.
- Sitemap and robots metadata routes.
- Signed HTTP-only administrator sessions, password-hashed bootstrap, live dashboard metrics, and a protected hierarchical course builder with course, chapter, topic, and resource CRUD.
- Learner assessment start/submit interface with server-side score calculation and feedback after submission.
- Safe empty state when the API or database is unavailable; no fabricated video URLs or claims.
- Repeatable site settings seed that intentionally does not publish demo content.

The supplied HTML has demonstration-only course data and placeholder resources. This starter does not represent those as verified content. Admins can create a course, lay out chapters, add topics with descriptions and short names, and attach one or more learning links to each topic. Courses can be published once each published chapter has a topic and each topic has a published resource. Assessment/question authoring, learner lesson navigation, video embedding and progress tracking are not built. Database-backed integration tests have not been added.

## Requirements

- Node.js 20 or later
- PostgreSQL 15 or later

## Local setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to a local PostgreSQL database.
2. Install packages with `npm install`.
3. Generate Prisma Client with `npm run db:generate`.
4. Apply the schema with `npm run db:migrate`.
5. Set `ADMIN_BOOTSTRAP_EMAIL`, `ADMIN_BOOTSTRAP_PASSWORD` (at least 14 characters), and a random `SESSION_SECRET` (at least 32 characters) in `.env`; initialize site settings and the admin with `npm run db:seed`. Seeding creates the admin or resets its password to the configured bootstrap password, so remove bootstrap credentials from runtime configuration after seeding.
6. Start frontend and API with `npm run dev`.

The site runs at `http://localhost:3000`, and the API is at `http://localhost:4000/api/v1`. Admin sign-in is at `/admin`. `NEXT_PUBLIC_API_BASE_URL` is browser-visible configuration and must contain only the public API base URL. Database credentials, bootstrap credentials, and session secrets must remain server-side.

## Data model

Prisma defines Course → Chapter → Topic → LearningResource, plus Assessment → Question → AnswerOption and persisted AssessmentAttempt records. Publication state is explicit at each content level. Course deletion cascades to its curriculum and assessment history; the admin UI confirms the destructive action.

## Deployment

`render.yaml` describes a PostgreSQL database and separate web/API services. In Render:

1. Push this repository to GitHub and create a Blueprint from the repository.
2. Set `FRONTEND_URL` on the API to the deployed web URL and use a strong `SESSION_SECRET` (the Blueprint generates one).
3. Set `NEXT_PUBLIC_API_BASE_URL` on the web service to `https://<api-host>/api/v1`.
4. Set `YOUTUBE_CHANNEL_URL` to the real channel URL, or leave it blank.
5. Deploy the API, then the frontend. The API start command applies checked-in Prisma migrations. Set bootstrap email/password as Render secrets, open the API service Shell once to run `npm run db:seed`, then remove the bootstrap variables.

The initial schema and migration are checked in under `prisma/`. No production credentials belong in Git. Before treating this as a production launch, complete chapter/topic/resource/assessment authoring, add learner lesson/assessment pages, add automated API/UI integration tests, and review the deployment settings.

## Scripts

- `npm run dev` — run web and API together.
- `npm run build` — build both services.
- `npm run lint` — lint frontend and API sources.
- `npm run typecheck` — type-check both projects.
- `npm run db:generate` — generate Prisma Client.
- `npm run db:migrate` — create/apply a development migration.
- `npm run db:seed` — initialize repeatable site settings.

## License

No license is asserted. Choose a license only after confirming ownership and intended reuse terms.
