# Backend Plan for the "Al-Ghazi in History" Platform

Based on reading the actual code (the services, the data, and the student and Master pages), and comparing it with the "security rules" image. The code is the reference wherever it differs from the image.

## 1) Conflicts between the image and the code (and the decision)

| In the image | In the code | Decision |
|---|---|---|
| An Activation Codes table for payment (`is_used`) | A **requests** system: the student transfers via Vodafone Cash and enters the transaction number, and the Master accepts or rejects | **The code is correct.** There is no Activation Codes table. Instead, two request tables (subscription + books) |
| Cloudinary for images | An `image` field holding a link as text | **Agreed.** + compress the image in the browser before uploading |
| Google Drive for handouts | A `materialUrl` field | **Agreed** |
| Protected YouTube Unlisted | A `videoUrl` field | **Agreed**, with protection from the server (Section 8) |
| Subscription check in the State only | — | **Not enough.** The check must happen on the server (RLS + functions) |

## 2) What each service stores

| Service | What it stores | Note |
|---|---|---|
| **Supabase** (Postgres + Auth + Edge Functions) | All texts, accounts, exams, scores, requests, and links | No images or files in it |
| **Firebase** (later, separate) | The chat only | Outside the scope of this plan |
| **Cloudinary** | Course images and book covers | In the table only the link + `public_id` |
| **Google Drive** | PDF handouts | In the table only the link |
| **YouTube Unlisted** | The videos | In the table only the link |

## 3) The tables (20 tables)

All prices are `numeric`, dates are `timestamptz`, and primary keys are `uuid` (except the small reference tables).

### a) Reference and settings
1. **grades**: `id text PK`, `label`, `stage`, `sort_order`. (6 fixed rows)
2. **profiles**: `id uuid PK → auth.users ON DELETE CASCADE`, `role` ('student'|'admin') default 'student', `name`, `email` unique, `phone` unique, `guardian_phone`, `grade_id → grades`, `governorate`, `created_at`.
3. **app_settings**: `key text PK`, `value jsonb`. Keys: `telegram_url`, `master_display_name`.
4. **payment_methods**: `id text PK`, `name`, `account_number`, `support_whatsapp`, `is_active`.

### b) Content
5. **courses**: `id`, `slug` unique, `title`, `description`, `grade_id`, `duration_label`, `image_url`, `image_public_id`, `published` default false, `created_at`.
6. **course_plans**: `id`, `course_id → courses CASCADE`, `plan_key` ('monthly'|'term'), `name`, `price`, `currency` default 'EGP'. Unique on (course_id, plan_key).
7. **units**: `id`, `course_id CASCADE`, `title`, `position`.
8. **lessons**: `id`, `unit_id CASCADE`, `title`, `duration_label`, `description`, `position`.
9. **lesson_media** (protected): `lesson_id PK → lessons CASCADE`, `video_url`, `material_url`, `material_title`.

### c) Exams
10. **exams**: `id`, `course_id CASCADE`, `unit_id → units SET NULL`, `title`, `duration_minutes`, `starts_at`, `ends_at`, `published`, `created_at`.
11. **questions**: `id`, `exam_id CASCADE`, `position`, `type` ('multiple-choice'|'true-false'|'essay'), `body`, `options jsonb`, `score`.
12. **question_answers** (Master only): `question_id PK → questions CASCADE`, `correct_answer jsonb`.
13. **exam_attempts**: `id`, `exam_id CASCADE`, `student_id → profiles CASCADE`, `auto_score`, `auto_total`, `score`, `total`, `essay_total`, `correct_count`, `incorrect_count`, `status` ('graded'|'needs_review'), `submitted_at`, `graded_at`. **Unique on (exam_id, student_id)** = once only.
14. **attempt_answers**: `attempt_id CASCADE`, `question_id CASCADE`, `answer jsonb`, `awarded_score` (null for essays before grading). PK on both.

### d) Subscriptions and permissions
15. **enrollments**: `id`, `student_id CASCADE`, `course_id CASCADE`, `plan_key`, `status` ('active'|'ended'), `starts_at`, `ends_at`, `ended_at`, `source_request_id → subscription_requests SET NULL`. Only one active subscription per (student, course) via a partial unique index. And "ended" is calculated from `ends_at`, not stored.
16. **subscription_requests**: `id`, `reference_number` unique (default `MK-` + random), `student_id CASCADE`, `course_id CASCADE`, `plan_key`, `amount`, `transaction_id` unique, `payment_method_id`, `status` ('pending'|'approved'|'rejected') default pending, `created_at`, `reviewed_at`. One pending request per (student, course).
17. **lesson_access**: `id`, `student_id CASCADE`, `course_id CASCADE`, `lesson_id CASCADE`, `created_at`. Unique on (student_id, lesson_id). Revoking = deleting the row.

### e) Books
18. **books**: `id`, `title`, `description`, `grade_id`, `category`, `price`, `image_url`, `image_public_id`, `availability` ('available'|'unavailable'), `created_at`.
19. **book_purchase_requests**: like the subscription requests, with `book_id` and a `reference_number` prefixed `BK-`.
20. **book_purchases** (ownership record): `id`, `student_id CASCADE`, `book_id CASCADE`, `request_id → book_purchase_requests SET NULL`, `purchased_at`. Unique on (student_id, book_id). **Deleting the request does not delete the ownership.**

### f) Chat: out of scope
The chat is **not part of Supabase**. It will be connected to a separate service (Firebase) later. So there is no table, no RLS, and no functions for the chat here, and `chatService.jsx` and anything related to chats **stays on the Mock and is not touched**. (The "Delete all chats" button in Settings stays connected to `chatService` until the chat is connected.)

**Notes:**
- The transfer transaction number (`transaction_id`) must be unique **across both tables** (subscriptions and books), so a trigger is created that checks the other table.
- There is no table for activities: the latest activities on the Master home are calculated from the results and the requests.
- I removed `access_type` and `lesson_id` from the subscription requests: the decision is that there is no paid per-session subscription (the individual lesson is by a permission from the Master).

## 4) Cascading delete (ON DELETE CASCADE)

- Deleting a **course** ← its units and lessons (and the media), its exams, their questions and their answers, its attempts, the students' answers, its subscriptions, its requests, and its permissions.
- Deleting an **exam** ← its questions and its attempts.
- Deleting a **book** ← its requests and its ownership record.
- Deleting a **student** ← deleting their account in Auth (an Edge Function with service role permission) ← deletes the profile ← deletes all their data.
- Deleting a **unit** ← its lessons. And the exams linked to it get `unit_id` set to null ("general review").
- Deleting an **accepted request** ← does not touch `enrollments` or `book_purchases`.
- The "Delete all" buttons in the Master dashboard ← RPC functions for the Master only.

## 5) Permissions (RLS)

RLS is enabled on all of them. A helper function `is_admin()` (security definer) checks `profiles.role`.

| Table | Visitor | Student | Master |
|---|---|---|---|
| grades, app_settings (public), payment_methods (active) | Read | Read | Full |
| courses (published), course_plans, units, lessons, books | Read | Read | Full |
| lesson_media | No | Via function only | Full |
| exams | No | The published ones in their courses | Full |
| questions | No | Via function only (without answers) | Full |
| question_answers | No | **No** | Full |
| exam_attempts, attempt_answers | No | Reads their own only | Full |
| enrollments, lesson_access, book_purchases | No | Their own (read) | Full |
| subscription_requests, book_purchase_requests | No | Creates and reads their own | Full |
| profiles | No | Their own data (without changing `role`) | Full |

Extra security: the student must not be able to modify `profiles.role` (trigger or column privileges).

## 6) Server functions (RPC) and Edge Functions

**RPC (Postgres):**
- `get_exam_questions(exam_id)`: returns the questions **without correct answers**, on condition: the student is subscribed, the exam is published and within its time, and they have not submitted before.
- `submit_exam(exam_id, answers)`: grades the auto-graded questions on the server, and records the attempt (once only), and its status is `needs_review` if there is an essay.
- `grade_essays(attempt_id, scores)`: for the Master. Updates the scores per question, and recalculates the final score (auto + essay), and closes the status as `graded` when all essays are graded.
- `get_lesson_media(lesson_id)`: returns the video and the handout if the student is subscribed or has a permission for the lesson.
- `create_subscription_request(...)` and `create_book_request(...)`: **the amount is calculated on the server** (from `course_plans` or `books.price`), not from the browser.
- `approve_subscription_request(id)`: (for the Master) creates the subscription from today's date (monthly +1 month, term +4 months according to the current constant), and updates the request in a single operation. And `reject_...`.
- `approve_book_request(id)`: records the ownership and updates the request. And `reject_...`.
- `extend_enrollment(id, days)` and `end_enrollment(id)` and `grant_lesson_access(student_id, course_id, lesson_ids[])`.
- Master dashboard summary functions (`master_dashboard_summary` and others) or views instead of loading all the tables.
- `delete_all_*`: functions for the Master only.

**Edge Functions:**
- `resolve-login`: if the student typed a phone number, we get their email and log in with it.
- `delete-student`: with service role permission to delete the Auth account.
- `cloudinary-sign`: (for the Master) signing image uploads.
- `cloudinary-delete`: (for the Master) deleting an old image.
- `storage-usage`: (for the Master) the storage numbers (Section 9).

## 7) Images: compression + upload

1. The Master picks an image ← check the type and the maximum size.
2. **Compression in the browser before uploading** with the `browser-image-compression` library: maximum dimension 1600px, WebP format, target ≤ about 300KB, and processing in a Web Worker.
3. Instant preview.
4. At "Save" time: request a signature from `cloudinary-sign` ← upload to Cloudinary in the folder `alghazi/courses` or `alghazi/books`.
5. The table saves `image_url` (the secure_url) + `image_public_id`.
6. If the image is changed or the course/book is deleted ← `cloudinary-delete` with the `public_id`, so that old images do not eat up the storage.
7. At display time: links with `f_auto,q_auto` transformations and a width suitable for the card.

**Why a signed upload instead of an unsigned preset?** The unsigned preset's name is visible in the frontend, and anyone can upload to your account and use up the free storage. And the Master is the only one who uploads, so signing from a function for the Master is more suitable.

Public frontend keys only: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` and `VITE_CLOUDINARY_CLOUD_NAME`. The API secret and the service role **are stored in the Edge Functions secrets** and never in the code.

## 8) Video and handout (protection, honestly)

- Nobody can read the `lesson_media` table except the Master, and the student gets the links from `get_lesson_media` **after their subscription is checked**. So the visitor and the non-subscribed student never receive the link in any Network request.
- **The limit of the protection:** the subscribed student can see the Video ID in the Network tab and share it. YouTube Unlisted and a Drive link set to "anyone with the link" have no technical prevention of that. The actual protection is blocking the non-subscribed.

## 9) The storage meter (Settings)

The real numbers must come from an Edge Function named `storage-usage` (for the Master only), and are cached for about an hour. The page shows: used + limit + remaining + percentage, and a bar that changes color (green ← gold at 80% ← red at 90%).

- **Supabase:** the database size via SQL (`pg_database_size`) through a function.
- **Cloudinary:** the Admin API for usage (needs the secret, so only the function).
- **Google Drive:** the Drive API `about.get` with the `storageQuota` field (it has `limit` and `usage` and `usageInDrive`). **OAuth is required** under the name of the Google account that holds the handouts, with a metadata read-only permission (`drive.metadata.readonly` is the least privileged, and check the current scope in Google's documentation). The only step that needs a human: a one-time approval in the browser, which produces a `refresh token` that is put into the function's secrets. Warnings:
  - The storage of a free Google account (15GB for example) is **shared** between Drive, Gmail, and Photos. `usage` counts everything, and `usageInDrive` counts Drive only. Show both or whichever suits you.
  - If the account's storage is unlimited (some Workspace accounts), the `limit` field is delayed or missing, so the interface must handle its absence.
  - If the app is in Testing mode on the Google consent screen, the refresh token may expire after about 7 days. The fix: move the app to In production (an "unverified app" warning appears for the owner only and that is normal), and check the current conditions.
  - A Service Account **will not work** here: it returns its own storage, not your account's storage.
- **YouTube:** there is no storage limit to show.

The limits (500MB and others) change and are reviewed from the official pricing pages and placed in a single constant. And `masterStorageService` already has the final shape ready, and only what is inside it is replaced.

---

## 10) Mapping to the code

**Pages and design: zero changes.** What changes:

| Part | The work |
|---|---|
| 16 core services (`courseService`...) (except `chatService`: out of scope) | Converted from the local data to Supabase. **The same function names, inputs, and outputs.** |
| 12 Master services | Filtering, pagination, and statistics via queries and `range` and `count` and RPC functions. Inputs and outputs are fixed. |
| `studentService.getCurrentStudent` | Reads from the Auth session |
| `subscriptionService` and `bookPurchaseService` | Creating the request via RPC (the amount from the server), and remove the `accessType = "lesson"` branch |
| `ExamInterface` and `ExamResult` and `questionService` | The questions from `get_exam_questions`, the submission from `submit_exam`, the result from the attempt, and remove `sessionStorage` |
| `Login` and `Signup` | Connected to `authService` |
| `utils/readImageFile.js` + `MasterImageField` | Compression + Cloudinary upload |
| `masterStorageService` | Calling `storage-usage` |

**New files:** `lib/supabaseClient.js`, `mappers/` (converting snake_case to camelCase with the same current names), `services/authService.jsx`, `context/AuthContext.jsx`, route protection (`ProtectedRoute` and `AdminRoute`), `services/mediaService.jsx`.

## 11) Execution order (the site stays working at every step)

1. **The foundation:** the Supabase project, the tables, RLS, the functions, initial data (the grades, the payment method, the settings).
2. **Public reading:** the grades, courses, plans, lessons, books, and payment methods.
3. **Accounts:** sign-up (a trigger creates the profile), login (+ by phone), `getCurrentStudent`, route protection.
4. **The student journey:** subscriptions, lessons (the media via the function), exams (fetch + submit), results, subscription and book requests, book ownership.
5. **The Master dashboard:** the services one by one (students, courses, exams, results, subscriptions, books, permissions, settings), with the accept and grading functions.
6. **Images:** compression and Cloudinary upload and deleting the old one.
7. **Storage and hardening:** `storage-usage`, RLS testing for each role, reviewing the secrets.

## 12) Open questions (with the assumption)

1. **The chat:** outside the Supabase scope (Firebase later). It is not touched in this plan.
2. **Login by phone:** Supabase easily logs in with email and password. The assumption: we log in by email, and if they typed a phone we convert it to their email with `resolve-login`.
3. **Email confirmation:** the assumption: not required at the start.
4. **The Master's account:** it is created once manually, and given `role = 'admin'` via SQL.
5. **Initial data (seed):** the six grades, the payment method, and the settings (mandatory). And the sample content (courses, units, lessons, exams, questions, books) in a separate optional file. **No fake students** because every student must have a real login account.

## 13) Keys and secrets (fixed names)

| Type | Names | Where they go |
|---|---|---|
| Public (appears in the browser) | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CLOUDINARY_CLOUD_NAME` | `.env.local` |
| Local tools (the developer's machine) | `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD` | `.env.admin` (not pushed to Git) |
| Edge Functions secrets | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN` | The `.env.secrets` file (not pushed to Git) and then `supabase secrets set --env-file .env.secrets` |

- The `service_role` key must not be put in any code or script: Edge Functions get it automatically from Supabase.
- The functions' secrets **must not contain any name that starts with `SUPABASE_`** (Supabase rejects it), which is why `SUPABASE_*` is in `.env.admin` alone and `CLOUDINARY_*`/`GOOGLE_*` are in `.env.secrets`.
- `.env`, `.env.admin`, and `.env.secrets` are in `.gitignore`, and a `.env.example` is created with names only.
- Checking the files locally without sending them to anyone: `node check-env.mjs` (the script is in the project root, and it does not print any full value).
- After the work is finished: change the Supabase token, the database password, and the Cloudinary and Google secrets.
- **Steps the AI cannot do (a human):** creating the accounts and projects, generating the keys, the Google approval in the browser, the Auth settings on Supabase (Site URL and disabling email confirmation), registering the Master's account and then setting `role='admin'` via SQL, uploading the handouts and videos, the real testing on mobile, rotating the keys.


**Suitable image size for the Courses section**
1376 × 768
