# Al-Ghazi in History: Project Reference README

> **To any AI assistant reading this file:** This is the project's primary reference (decisions + status + Backend plan). Read it in full before doing anything. If this file disagrees with the actual code, **the actual code is correct**; tell the user about the discrepancy instead of assuming. Do not write any code before you have read the existing files related to the task. **The approved Backend design is in Section 16 (verbatim).**

Last updated: October 3, 2026. (Replaces the old September 29, 2026 version.)

Companion reference files (in the project root): `STUDY_MAP.md` (a study map of the files, in order), `BACKEND_PLAN.md` (a standalone copy of Section 16), `BACKEND_BUILD_PROMPT.md` (the prompt handed to the AI that will implement the Backend).

---

## 1. Project idea

**"Al-Ghazi in History"** is an educational platform specialized in History and Social Studies (Egypt). The platform's owner is a single teacher, referred to in the project as **"the Master" / Master**.

**The student can:**

- Create an account and choose their school grade.
- Subscribe to courses.
- Open lessons and watch videos and materials.
- Take exams (**only once per exam**) and view results.
- Buy books and handouts.
- Communicate through a Chat inside the site (and the Master follows up from Telegram).

**The Master manages all of this from the Master Dashboard:** students, courses and lessons, exams and questions, results and grading, subscriptions, book purchase requests, books, private lesson permissions, and account and payment settings.

**The most important principle for the Master Dashboard:** a daily **operational** dashboard, clear, Premium and Professional. Not an analytics (BI) platform.

---

## 2. Current status (very important)

| Part | Status |
|---|---|
| Public site (Home / Login / Signup / Courses / CourseDetails / Books / Subscription / BookPurchase) | Exists |
| Complete Student Dashboard (Home, Courses, Lesson, Exams, Exam, Result, Books, Profile, Support) | Exists |
| **Master Dashboard (the 10 pages)** | **Fully built on Mock Data**: Home, Students, Courses, Exams, Results, Subscriptions, Book Requests, Books, Lesson Access, Settings (with form and details pages) |
| Code structure | 3 layers: `data` (Mock) ← `services` (logic, async) ← pages (display only). Every Master page has a `master<Page>Service` |
| `npm run build` / `npm run lint` | Build succeeds. The lint errors that were in 6 old files (Chat, ChatMessage, CourseDetails, ExamTimer, DashboardResults, LessonPage) have been fixed: **0 files with lint errors** |
| Backend / Supabase | **Does not exist yet.** All data is Mock. The full plan is in Section 16 |
| Real Auth / Route protection | **Does not exist** (`getCurrentStudent()` returns the first Mock student, and Login and Signup only validate inputs) |
| Images | Temporary, in memory (lost on refresh) until we connect Cloudinary |
| Chat | Mock for now. **Outside the Supabase scope**: it will be connected to Firebase later as a separate service |

**Code rules the project follows (must be preserved in any addition):**

1. Pages and components **do not import from `src/data`** (the only exception: `utils/gradeUtils.jsx` because the grades are fixed). Everything goes through `src/services`.
2. All service functions are `async`, and they return **copies** (`{...item}` or `[...items]`), not the original array, and IDs are compared with `String(a) === String(b)`.
3. Master lists return `{ rows, pagination: { page, pageSize, pageCount, total }, ...filter options }`, and filtering and pagination happen inside the service.
4. All Arabic status texts come from `src/constants/statusLabels.js` via `getLabel()`.
5. The definition of an "active subscription" lives in one place: `isEnrollmentActive` in `enrollmentService.jsx`.
6. Pages load with `hooks/useAsyncData` (loading on first load only + error + cancellation on exit).
7. Multi-step operations (accepting a request, grading, cascading delete) exist as a single function in a service, with a "Supabase note" comment: they turn into RPC/CASCADE at connection time and the pages do not change.
8. Master dashboard: the hero with the image is on the **Home page only**, and the other pages have a thin top bar with the page name (`MasterTopbar` reads the Master's name and Telegram link from his settings).

---

## 3. Technologies (from the actual `package.json`)

| Library | Version |
|---|---|
| `@fontsource/cairo` | `^5.3.0` |
| `@fortawesome/fontawesome-svg-core` | `^7.3.1` |
| `@fortawesome/free-brands-svg-icons` | `^7.3.1` |
| `@fortawesome/free-solid-svg-icons` | `^7.3.1` |
| `@fortawesome/react-fontawesome` | `^3.5.0` |
| `@tailwindcss/vite` | `^4.3.3` |
| `react` | `^19.2.8` |
| `react-dom` | `^19.2.8` |
| `react-router-dom` | `^7.18.3` |
| `swiper` | `^14.2.0` |
| `tailwindcss` | `^4.3.3` |
| `uuid` | `^14.0.2` |
| `vite` | `^8.3.0` |
| `@babel/core` | `^7.29.7` |
| `@eslint/js` | `^10.0.1` |
| `@rolldown/plugin-babel` | `^0.2.3` |
| `@types/react` | `^19.2.18` |
| `@types/react-dom` | `^19.2.4` |
| `@vitejs/plugin-react` | `^6.1.0` |
| `babel-plugin-react-compiler` | `^1.0.0` |
| `eslint` | `^10.9.0` |
| `eslint-plugin-react-hooks` | `^7.1.1` |
| `eslint-plugin-react-refresh` | `^0.5.4` |
| `globals` | `^17.11.0` |

**Commands:**

```bash
npm run dev   # vite
npm run build   # vite build
npm run lint   # eslint .
npm run preview   # vite preview
```

Notes: Tailwind v4 (color setup is in `src/index.css` inside `@theme`). The `@supabase/supabase-js` and `browser-image-compression` libraries are **not installed yet** and will be added at connection time.

---

## 4. Visual identity

- **Direction:** Historical Premium, dark (Dark Navy) with gold (Gold). Fully Arabic RTL.
- **Font:** Cairo (400 / 600 / 700 / 800).
- **Colors (defined in `src/index.css` inside `@theme`):**

| Variable | Value |
|---|---|
| `midnight` | `#0a1628` |
| `charcoal` | `#132238` |
| `navy` | `#1a2d4a` |
| `gold` | `#d4af37` |
| `gold-light` | `#e5c158` |
| `warm-white` | `#f5f0e8` |
| `muted-gray` | `#a8a29e` |
| `border-navy` | `#2a4a6b` |
| `success` | `#10b981` |
| `danger` | `#ef4444` |

- Every page/Layout starts with `dir="rtl"` and a `bg-midnight text-white` background.
- **Master:** the same general identity (colors, fonts, spacing, buttons, cards) with a more organized Admin character. **Not** a separate visual system. The shared styles (buttons, fields, cards) are in `Components/DashboardMaster/Shared/masterStyles.js`.

---

---

## 5. File tree (as it actually is now)

The full detail in learning order is in `STUDY_MAP.md`.

```text

src/
  App.css                            Empty file (0 bytes) and unused. You can delete it or leave it.
  App.jsx                            Map of all pages (Routes): public, student dashboard, Master dashboard. Any new page gets registered here.
  index.css                          The colors (Midnight/Gold...), the Cairo font, and the global Tailwind settings. The source of the visual identity.
  main.jsx                           App entry point: mounts React on the page and wraps App with StrictMode and BrowserRouter.

src/Components/
  AboutPlatform.jsx                  "About the platform" section: the platform's features in cards (understanding events, exam preparation...).
  Chat.jsx                           Chat window (study assistant): fetches and sends messages.
  CourseDetails.jsx                  Course details page (/courses/:id): units, lessons, and subscription plans, and it checks the student's subscription.
  Courses.jsx                        Latest courses section: fetches the published courses and shows them as cards that lead to the details page.
  ExamResult.jsx                     Exam result page after submission (/exam-result/:id).
  Footer.jsx                         Site footer: platform description and contact and navigation links.
  HeroSection.jsx                    Hero section: the big headline "Learn history in a different way", the Master's photo, and the start buttons.
  Login.jsx                          Login form (input validation). It does not actually log in yet: it waits for the connection.
  Navbar.jsx                         Site top bar: the logo, links, and two buttons for login and sign up.
  ScrollToTop.jsx                    Returns the page to the top every time you navigate between two pages.
  Signup.jsx                         Sign-up form (input validation). It does not actually save a student yet: it waits for the connection.
  StudentOpinions.jsx                Student opinions section (static texts inside the file).

src/Components/Books/
  BookCard.jsx                       Public book card: image, price, and a buy button (or "Not available for purchase" if the Master stopped it).
  BooksSection.jsx                   Books section on the home page: fetches the books and shows BookCard cards.

src/Components/Chat/
  ChatMessage.jsx                    A single message bubble.

src/Components/DashboardMaster/
  MasterLayout.jsx                   Master dashboard structure: the fixed sidebar + the top bar + the place for the pages.
  MasterSidebar.jsx                  Side menu (10 sections), the hamburger button on mobile, and logout.
  MasterTopbar.jsx                   Home: Hero with an image. The other pages: a thin bar with the page name. The name and Telegram come from the Master's settings.

src/Components/DashboardMaster/Shared/
  MasterConfirmModal.jsx             Confirmation window (for deletion and dangerous operations).
  MasterEmptyState.jsx               "No data" message.
  MasterField.jsx                    Unified form field (text/list/long text) with an error message.
  MasterImageField.jsx               Temporary image upload (to be replaced by Cloudinary).
  MasterModal.jsx                    General window for forms and details.
  MasterNotice.jsx                   Success/error bar.
  MasterPageHeader.jsx               Page title + back/add button.
  MasterPagination.jsx               Pagination (takes itemLabel: student/course...).
  MasterSearchFilters.jsx            Search and filters bar.
  MasterStatCard.jsx                 Number/statistic card.
  MasterStatusBadge.jsx              Colored status badge.
  MasterTabs.jsx                     Tabs (in the Subscriptions page).
  masterStyles.js                    Shared classes for buttons, fields, and cards (the identity in one place).

src/Components/DashboardStudent/
  DashboardBookCard.jsx              Book card for a student: buy/under review/purchased/rejected/unavailable.
  DashboardExamCard.jsx              Exam card in the student's list.
  DashboardLayout.jsx                Student dashboard structure: the sidebar + the place for the pages.
  DashboardResultCard.jsx            Result card.
  DashboardSidebar.jsx               Student dashboard side menu.
  EmptyState.jsx                     "No content" message for the student.
  ExamQuestionCard.jsx               Displays a single question in all its types (multiple choice, true/false, essay).
  ExamQuestionNavigator.jsx          Question numbers for quick navigation.
  ExamTimer.jsx                      Exam timer.

src/Components/Lesson/
  LessonContentList.jsx              List of the course's units and lessons beside the lesson.
  LessonMaterials.jsx                Handout download button (converts a Google Drive link to a download link).
  LessonVideo.jsx                    YouTube video player: extracts the Video ID and shows it in an iframe.

src/Page/
  BookPurchase.jsx                   Book purchase page: payment details, transfer number, and sending the request.
  Books.jsx                          All books page (/books) with a grade filter. (It imports grades from data directly: to be converted to getGrades.)
  Home.jsx                           Home page: arranges the sections in order (Navbar ← Hero ← About ← Courses ← Books ← Opinions ← Footer).
  Subscription.jsx                   Page for subscribing to a course with a specific plan: payment details and sending the subscription request.

src/Page/DashboardMaster/
  MasterBookForm.jsx                 Add/edit a book.
  MasterBookRequests.jsx             Book purchase requests: review, accept, reject, and delete.
  MasterBooks.jsx                    Book cards: available/unavailable, preview, delete.
  MasterCourseContent.jsx            Manage a course's units and lessons (ordering ↑↓, video, handout).
  MasterCourseForm.jsx               Add/edit a course (data, prices, and image).
  MasterCourses.jsx                  Course cards: publish/hide/delete with a summary of the records.
  MasterExamForm.jsx                 Add/edit an exam (course, unit, and time).
  MasterExamManage.jsx               Manage the exam's questions + JSON import with preview.
  MasterExams.jsx                    List of exams and their statistics (the time status is calculated automatically).
  MasterHome.jsx                     Master home: statistics, things that need action, latest results and activities.
  MasterLessonAccess.jsx             Grant and revoke individual lesson permissions.
  MasterPlaceholder.jsx              "Under preparation" page for any link that has no page.
  MasterResultDetails.jsx            Result details and grading of essay questions.
  MasterResults.jsx                  Results list: filters, CSV export, delete.
  MasterSettings.jsx                 The account, password, payment details, storage used, delete chats.
  MasterStudentDetails.jsx           Student details: their data, subscriptions, results, and requests, and edit/delete.
  MasterStudents.jsx                 Students list: search, filters, pagination, and statistics.
  MasterSubscriptions.jsx            Two tabs: subscriptions (extend/end) and subscription requests (accept/reject/delete).

src/Page/DashboardStudent/
  DashboardBooks.jsx                 The student's books and the purchase status of each book.
  DashboardCourses.jsx               The courses the student is subscribed to.
  DashboardExams.jsx                 The student's exams list and their status (available/ended/solved).
  DashboardHome.jsx                  Student home: summary of their courses, exams, and results.
  DashboardProfile.jsx               The student's profile.
  DashboardResults.jsx               All the student's results.
  DashboardSupport.jsx               Support page (shows the chat component).
  ExamInterface.jsx                  Exam-taking screen: the timer, navigation, submission (once), and recording the result.
  LessonPage.jsx                     Lesson page: the video, the handout, and the content list (contains temporary demo links).

src/constants/
  statusLabels.js                    All Arabic status texts (accepted, active, ended...) in one place.

src/data/
  bookPurchaseRequests.jsx           Book purchase requests (status under review/accepted/rejected).
  bookPurchases.jsx                  Book ownership record: who bought what (separate from the requests).
  books.jsx                          Books: title, price, image, and purchase availability.
  chatMessages.jsx                   Sample messages for the chat.
  courses.jsx                        Sample courses: title, grade, image, subscription plans (monthly/term), and the publish field.
  enrollments.jsx                    Students' subscriptions to courses: the plan, start and end date, and status.
  exams.jsx                          Exams: course, unit, duration, start and end time, and publish status.
  grades.jsx                         The six school grades (preparatory and secondary).
  lessonAccess.jsx                   Individual lesson permissions granted to students.
  lessons.jsx                        Units and each unit's lessons (an array of units, and each unit has an array of lessons).
  masterProfile.jsx                  The Master's data (name, Telegram link...). The Topbar reads from it.
  paymentMethods.jsx                 Payment methods (Vodafone Cash: the number and support WhatsApp).
  questions.jsx                      Exam questions (multiple choice, true/false, essay) and their correct answers.
  results.jsx                        Students' results: the score, the answers, essay scores, and grading status.
  storageUsage.jsx                   Sample storage consumption numbers and free-plan limits.
  students.jsx                       Sample students (name, grade, phone, guardian...).
  subscriptionRequests.jsx           Subscription requests (request number, transfer number, status).

src/hooks/
  useAsyncData.js                    Loading hook: loading on first load, error, and cancellation on exit. Used by the Master pages.

src/services/
  bookPurchaseService.jsx            Book purchase requests: create (blocking unavailable/owned), accept (records the ownership), reject, delete.
  bookPurchasesService.jsx           Book ownership record (deleting the request does not cancel it).
  bookService.jsx                    Books: fetch, create, edit, delete, and isBookAvailable.
  chatService.jsx                    Chat messages: fetch, send, delete all.
  courseService.jsx                  Courses: for the student only the published ones, and for the Master all courses + create/edit/delete.
  enrollmentService.jsx              Subscriptions: isEnrollmentActive (the only definition of an active subscription), create, extend, end.
  examService.jsx                    Exams: for the student only the published ones, and for the Master all operations.
  gradeService.jsx                   getGrades: returns the grades.
  lessonAccessService.jsx            Lesson permissions: grant, fetch, revoke.
  lessonService.jsx                  Units and lessons: display for the student + create/edit/delete/order for the Master.
  masterBookRequestsService.jsx      Book requests logic.
  masterBooksService.jsx             Books logic and cascading delete.
  masterCoursesService.jsx           Courses pages logic, content, and cascading delete.
  masterDashboardService.jsx         Collects and calculates the home summary.
  masterExamsService.jsx             Exams and questions logic and JSON import/validation.
  masterLessonAccessService.jsx      Permissions logic with duplicate prevention.
  masterProfileService.jsx           The Master's data: read and update.
  masterResultsService.jsx           Results and grading logic (final score = auto + essay) and export.
  masterSettingsService.jsx          Settings logic and input validation.
  masterStorageService.jsx           Storage numbers (sample) in the same shape as the final connection.
  masterStudentsService.jsx          Logic for the two students pages (list, details, and cascading delete).
  masterSubscriptionsService.jsx     Subscriptions and requests logic.
  paymentMethodService.jsx           Payment methods: fetch the active ones and edit the account details.
  questionService.jsx                Questions: fetch, add, edit, delete, order.
  resultService.jsx                  Results: record the exam submission (once only), fetch, delete, update.
  studentService.jsx                 getCurrentStudent (currently the first student), and fetch/edit/delete students.
  subscriptionService.jsx            Subscription requests: create, accept (activates the subscription), reject, delete.

src/utils/
  downloadTextFile.js                Download a text file from the browser (CSV export of results).
  formatters.js                      Formatting of date, time, price, and size (MB/GB), and converting a date to an input value.
  gradeUtils.jsx                     The getGradeLabel function: converts the grade code (first-preparatory) to its Arabic name.
  paginate.js                        paginate: splits a list into pages, and matchesSearch: text search. Every list service uses them.
  readImageFile.js                   Temporarily reads an image from the device. It will be replaced by a Cloudinary upload at connection time.
```

Images are in `src/assets/` (Background, Books, Logo, Master). And public files are in `public/`.

---

## 6. The Routes (from the actual `App.jsx`)

```text
/                                          -> Home
/signup                                    -> Signup
/login                                     -> Login
/courses/:courseId                         -> CourseDetails
/books                                     -> Books
/books/:bookId/purchase                    -> BookPurchase
/exam-result/:examId                       -> ExamResult
/dashboard-student/exams/:examId           -> ExamInterface
/courses/:courseId/lessons/:lessonId       -> LessonPage
/subscription/:courseId/:planId            -> Subscription
/dashboard-master                          -> MasterLayout
(index)                                    -> MasterHome
students                                   -> MasterStudents
students/:studentId                        -> MasterStudentDetails
courses                                    -> MasterCourses
courses/new                                -> MasterCourseForm
courses/:courseId                          -> MasterCourseContent
courses/:courseId/edit                     -> MasterCourseForm
exams                                      -> MasterExams
exams/new                                  -> MasterExamForm
exams/:examId                              -> MasterExamManage
exams/:examId/edit                         -> MasterExamForm
results                                    -> MasterResults
results/:resultId                          -> MasterResultDetails
subscriptions                              -> MasterSubscriptions
book-requests                              -> MasterBookRequests
books                                      -> MasterBooks
books/new                                  -> MasterBookForm
books/:bookId/edit                         -> MasterBookForm
lesson-access                              -> MasterLessonAccess
settings                                   -> MasterSettings
*                                          -> MasterPlaceholder
/dashboard-student                         -> DashboardLayout
(index)                                    -> DashboardHome
courses                                    -> DashboardCourses
books                                      -> DashboardBooks
exams                                      -> DashboardExams
results                                    -> DashboardResults
profile                                    -> DashboardProfile
support                                    -> DashboardSupport
```

- The whole Master dashboard is nested inside `/dashboard-master` (`MasterLayout`), and its last Route is `path="*"`, which shows `MasterPlaceholder`.
- Any new Master page is registered **above** the placeholder line.
- There is currently no Route protection (that is the Backend's job).

---

## 7. Data layer (Mock Data + Services)

### Data files (`src/data`)

- `bookPurchaseRequests.jsx`: Book purchase requests (status under review/accepted/rejected).
- `bookPurchases.jsx`: Book ownership record: who bought what (separate from the requests).
- `books.jsx`: Books: title, price, image, and purchase availability.
- `chatMessages.jsx`: Sample messages for the chat.
- `courses.jsx`: Sample courses: title, grade, image, subscription plans (monthly/term), and the publish field.
- `enrollments.jsx`: Students' subscriptions to courses: the plan, start and end date, and status.
- `exams.jsx`: Exams: course, unit, duration, start and end time, and publish status.
- `grades.jsx`: The six school grades (preparatory and secondary).
- `lessonAccess.jsx`: Individual lesson permissions granted to students.
- `lessons.jsx`: Units and each unit's lessons (an array of units, and each unit has an array of lessons).
- `masterProfile.jsx`: The Master's data (name, Telegram link...). The Topbar reads from it.
- `paymentMethods.jsx`: Payment methods (Vodafone Cash: the number and support WhatsApp).
- `questions.jsx`: Exam questions (multiple choice, true/false, essay) and their correct answers.
- `results.jsx`: Students' results: the score, the answers, essay scores, and grading status.
- `storageUsage.jsx`: Sample storage consumption numbers and free-plan limits.
- `students.jsx`: Sample students (name, grade, phone, guardian...).
- `subscriptionRequests.jsx`: Subscription requests (request number, transfer number, status).

### The actual question types (do not invent new types)

```js
// Multiple choice
{ type: "multiple-choice", question, options: [..4 options..], correctAnswer: 1 /* index */, score, order }
// True/false
{ type: "true-false", question, correctAnswer: true /* boolean */, score, order }
// Essay (no correctAnswer, needs manual grading)
{ type: "essay", question, score, order }
```


### Result shape (`results.jsx`)

```text
{ id, studentId, examId,
  autoScore, autoTotal,      // score of the auto-graded questions
  score, total,              // the displayed score (updates after essay grading: auto + essay)
  essayCount, essayTotal, essayScores: { [questionId]: number },
  correctAnswers, incorrectAnswers, answers,
  status: "graded" | "needs_review", submittedAt }
```

The exam is allowed only once: `submitExamAttempt` rejects the second submission.

### The Services (the functions actually exported)

- **bookPurchaseService.jsx**: `getPendingBookPurchaseRequest`, `getBookPurchaseRequestsByStudentId`, `createBookPurchaseRequest`, `getBookPurchaseRequests`, `getBookPurchaseRequestById`, `approveBookPurchaseRequest`, `rejectBookPurchaseRequest`, `deleteBookPurchaseRequestsByStudentId`, `deleteBookPurchaseRequest`, `deleteAllBookPurchaseRequests`, `deleteBookPurchaseRequestsByBookId`
- **bookPurchasesService.jsx**: `getBookPurchases`, `getPurchasedBookIdsByStudentId`, `hasBookPurchase`, `createBookPurchase`, `deleteBookPurchasesByStudentId`, `deleteBookPurchasesByBookId`
- **bookService.jsx**: `isBookAvailable`, `getBooks`, `getBookById`, `getBooksByStudentGrade`, `createBook`, `updateBook`, `deleteBook`, `deleteAllBooks`
- **chatService.jsx**: `getMessages`, `sendMessage`, `deleteAllMessages`
- **courseService.jsx**: `getCourses`, `getCourseById`, `getAllCourses`, `getAnyCourseById`, `createCourse`, `updateCourse`, `deleteCourse`, `deleteAllCourses`
- **enrollmentService.jsx**: `getEnrollments`, `getEnrollmentsByStudentId`, `isEnrollmentActive`, `isStudentEnrolled`, `createEnrollment`, `deleteEnrollmentsByStudentId`, `getEnrollmentState`, `getEnrollmentById`, `updateEnrollment`, `deleteEnrollmentsByCourseId`
- **examService.jsx**: `getExamsByCourseId`, `getExamById`, `getExams`, `getAnyExamById`, `createExam`, `updateExam`, `deleteExam`, `deleteExamsByCourseId`, `deleteAllExams`, `detachExamsFromUnit`
- **gradeService.jsx**: `getGrades`
- **lessonAccessService.jsx**: `getLessonAccessByStudentId`, `getLessonAccessByStudentAndCourseId`, `hasLessonAccess`, `grantLessonAccess`, `deleteLessonAccessByStudentId`, `getAllLessonAccess`, `getLessonAccessById`, `revokeLessonAccess`, `deleteLessonAccessByCourseId`, `deleteLessonAccessByLessonIds`
- **lessonService.jsx**: `getUnitsByCourseId`, `getAllUnitsByCourseId`, `getAllUnits`, `getUnitById`, `createUnit`, `updateUnit`, `deleteUnit`, `deleteUnitsByCourseId`, `moveUnit`, `createLesson`, `updateLesson`, `deleteLesson`, `moveLesson`, `getAllLessons`
- **masterBookRequestsService.jsx**: `getMasterBookRequestsSummary`, `getMasterBookRequestsPage`, `getMasterBookRequestDetails`, `approveMasterBookRequest`, `rejectMasterBookRequest`, `deleteMasterBookRequest`, `deleteAllMasterBookRequests`
- **masterBooksService.jsx**: `getMasterBooksSummary`, `getMasterBooksPage`, `getMasterBookPreview`, `getMasterBookForm`, `saveMasterBook`, `setMasterBookAvailability`, `getMasterBookDeleteSummary`, `getMasterBooksDeleteAllSummary`, `deleteMasterBook`, `deleteAllMasterBooks`
- **masterCoursesService.jsx**: `getMasterCoursesPage`, `getMasterCourseForm`, `saveMasterCourse`, `setMasterCoursePublished`, `getMasterCourseContent`, `saveMasterUnit`, `moveMasterUnit`, `getMasterUnitDeleteSummary`, `deleteMasterUnit`, `saveMasterLesson`, `moveMasterLesson`, `deleteMasterLesson`, `getMasterCourseDeleteSummary`, `getMasterCoursesDeleteAllSummary`, `deleteMasterCourse`, `deleteAllMasterCourses`
- **masterDashboardService.jsx**: `getMasterDashboardSummary`
- **masterExamsService.jsx**: `getExamTimeStatus`, `getMasterExamsSummary`, `getMasterExamsPage`, `getMasterExamForm`, `saveMasterExam`, `setMasterExamPublished`, `getMasterExamDetails`, `getMasterExamQuestionsPage`, `getEmptyQuestionForm`, `getMasterQuestionForm`, `saveMasterQuestion`, `moveMasterQuestion`, `deleteMasterQuestion`, `deleteAllMasterExamQuestions`, `previewMasterQuestionsImport`, `importMasterQuestions`, `getMasterExamDeleteSummary`, `getMasterExamsDeleteAllSummary`, `deleteMasterExam`, `deleteAllMasterExams`
- **masterLessonAccessService.jsx**: `getMasterLessonAccessSummary`, `getMasterLessonAccessPage`, `getMasterLessonAccessOptions`, `grantMasterLessonAccess`, `revokeMasterLessonAccess`
- **masterProfileService.jsx**: `getMasterProfile`, `updateMasterProfile`
- **masterResultsService.jsx**: `getMasterResultsSummary`, `getMasterResultsPage`, `exportMasterResultsCsv`, `getMasterResultDetails`, `saveMasterResultGrades`, `deleteMasterResult`, `deleteAllMasterResults`
- **masterSettingsService.jsx**: `getMasterSettings`, `saveMasterProfile`, `changeMasterPassword`, `saveMasterPaymentMethod`, `getMasterChatSummary`, `deleteAllMasterChatMessages`
- **masterStorageService.jsx**: `getMasterStorageUsage`
- **masterStudentsService.jsx**: `getMasterStudentGradeOptions`, `getMasterStudentsSummary`, `getMasterStudentsPage`, `getMasterStudentDetails`, `updateMasterStudent`, `deleteMasterStudent`, `deleteAllMasterStudents`
- **masterSubscriptionsService.jsx**: `getMasterSubscriptionsSummary`, `getMasterEnrollmentsPage`, `extendMasterEnrollment`, `endMasterEnrollment`, `getMasterSubscriptionRequestsPage`, `getMasterSubscriptionRequestDetails`, `approveMasterSubscriptionRequest`, `rejectMasterSubscriptionRequest`, `deleteMasterSubscriptionRequest`, `deleteAllMasterSubscriptionRequests`
- **paymentMethodService.jsx**: `getActivePaymentMethods`, `getPaymentMethodById`, `getAllPaymentMethods`, `updatePaymentMethod`
- **questionService.jsx**: `getQuestionsByExamId`, `getAllQuestions`, `getQuestionById`, `createQuestion`, `createQuestions`, `updateQuestion`, `deleteQuestion`, `moveQuestion`, `deleteQuestionsByExamId`
- **resultService.jsx**: `getResults`, `getResultsByStudentId`, `getResultByExamId`, `getResultById`, `hasSubmittedExam`, `submitExamAttempt`, `updateResult`, `deleteResult`, `deleteAllResults`, `deleteResultsByExamIds`, `deleteResultsByStudentId`
- **studentService.jsx**: `getCurrentStudent`, `getStudents`, `getStudentById`, `updateStudent`, `deleteStudent`, `deleteAllStudents`
- **subscriptionService.jsx**: `getSubscriptionRequestsByStudentId`, `getPendingSubscriptionRequest`, `createSubscriptionRequest`, `getSubscriptionRequests`, `getSubscriptionRequestById`, `approveSubscriptionRequest`, `rejectSubscriptionRequest`, `deleteSubscriptionRequestsByStudentId`, `deleteSubscriptionRequest`, `deleteAllSubscriptionRequests`, `deleteSubscriptionRequestsByCourseId`

---

## 8. The school grades system

Its only source is `src/data/grades.jsx`:

```js
const grades = [
  { id: "first-preparatory",  label: "أولى إعدادي",  stage: "المرحلة الإعدادية" },   // label: "First Preparatory", stage: "Preparatory stage"
  { id: "second-preparatory", label: "ثانية إعدادي", stage: "المرحلة الإعدادية" },   // label: "Second Preparatory"
  { id: "third-preparatory",  label: "ثالثة إعدادي", stage: "المرحلة الإعدادية" },   // label: "Third Preparatory"
  { id: "first-secondary",    label: "أولى ثانوي",   stage: "المرحلة الثانوية" },    // label: "First Secondary", stage: "Secondary stage"
  { id: "second-secondary",   label: "ثانية ثانوي",  stage: "المرحلة الثانوية" },    // label: "Second Secondary"
  { id: "third-secondary",    label: "ثالثة ثانوي",  stage: "المرحلة الثانوية" },    // label: "Third Secondary"
];
export default grades;
```

(The Arabic `label` and `stage` values are the actual data in the code and are kept as they are; the English glosses in the comments are for this document only.)

- The **logic always depends on the IDs**, and the **Label is for display only**. Using the Arabic names in any logic is forbidden.
- `stage` exists only as Metadata in the grade definition, and is **not stored** inside the student, the book, or the course.
- Display: `getGradeLabel(gradeId)` from `src/utils/gradeUtils.jsx`.
- Signup shows the grades dynamically from `grades` and stores the Grade ID.

**Linking courses to grades:**

| Course | Grade |
|---|---|
| `social-studies-preparatory` | `second-preparatory` |
| `history-secondary` | `third-secondary` |
| `history-different-way` | `second-secondary` |

---

---

## 9. Student system rules (they exist and they affect Master)

### Subscribing to a course

`Not subscribed` ← "Subscribe to the course" | `Under review` ← "Subscription under review" | `Accepted` ← "Continue the course"

### Buying a book

`No request` ← "Buy the book" | `Under review` ← "Request under review" | `Accepted` ← "Book purchased" | `Rejected` ← "Re-request purchase" | `Unavailable` ← "Currently unavailable for purchase".
**Rejection is back** (with no reason), see Section 12.

### Payment

- There is one Master. The current payment method is **Vodafone Cash** only. **No Payment Gateway.**
- The student transfers, then enters the **transaction number (`transactionId`)** and sends the request. The Master reviews **and accepts or rejects** (rejection with no reason, and the student can submit a new request).
- **No uploading of a payment-proof image** (it was removed). The review depends on: the payment method + the transfer number + the amount + the request date.
- Payment methods are edited from **Settings** (not a separate page in the Sidebar).

### Lesson permissions (Lesson Access)

- The original idea of "per-session subscription" was rejected (too complicated). The alternative: a **special permission for a lesson** granted by the Master.
- The student opens the lesson if: they have an active subscription to the course, **or** they have a special permission for the lesson.
- It is **not required** that they be subscribed to the course in order to get a lesson permission.
- The permission = `student + course + lesson`. The Master can grant one lesson or several lessons in a single operation.
- No duration, no price, no Payment per lesson, **no Duplicates allowed**.
- **Revoking the permission:** if the student is not subscribed ← they lose access. If subscribed ← they still open the lesson because their subscription allows it.

### Book and request identifiers

| Item | Identifier | Example |
|---|---|---|
| The book | ID from the server | `BOOK-1025` |
| Book purchase request | Request Number from the server | `BK-2051` |
| The transfer | the `transactionId` the student typed | — |

There is no third internal Reference. (In the Mock currently the books are `book-1…6`, the book requests are prefixed `BK-` and the subscription requests `MK-`.)

### Books

- **No school year (`academicYear`) for books.** If an old book has expired, the Master makes it "unavailable for purchase" and adds a new book.
- Book status: **available for purchase / unavailable for purchase** (`availability`). If unavailable, the student **cannot make a new request**, but whoever bought it before **keeps it**. Ownership is in `bookPurchases.jsx` (separate from the requests), so deleting the accepted request does not cancel the purchase.
- The book: `ID, name, description, grade, price, cover, availability`. No inventory, no shipping, no coupons, no cart.

---

### Exams

- The exam is **once only** per student (`hasSubmittedExam` + rejecting the second submission). If the student opens an exam they already submitted, they are redirected to the result page.
- Courses and exams have a publish status: unpublished ones are **hidden from the student** (`getCourses` / `getExamsByCourseId` return only the published ones, and for the Master there are `getAllCourses` / `getExams`).


---

## 10. Master Dashboard: general decisions

### Implementation status

```text
1. Conceptualizing all Master pages        ← done
2. The function of each page in detail     ← done
3. Layout + Sidebar + Topbar + Shared Components  ← built
4. The ten pages on Mock Data              ← built
5. Connecting to the Backend               ← the next step (Section 16)
```

### The Layout

- A fixed Sidebar on Desktop, and a Hamburger on small screens.
- A simple Topbar. **There is no Footer** in Master.
- A Layout independent from the student's `DashboardLayout` (the student has Navbar + Footer + Chat, and Master does not).
- A historical Hero **in Home only**. Heavy table pages have no Hero.
- A **Telegram** button in the Topbar/Home.
- No Charts/Analytics unless they have a clear operational value.

### The final Master Sidebar (in order)

```text
Home
Students
Courses and content
Exams and questions
Results
Subscriptions and subscription requests
Book purchase requests
Books and handouts
Lesson permissions
Settings
----------------
Log out
```

There is no Teacher Chat. The student talks to the Master from the site's Chat, and the Master follows up from **Telegram**.

### Shared Components (without over-abstraction)

Page Header, Search, Filters, Stat Cards, Tables, Cards, Pagination, Empty States, Buttons, Status Badges, **ConfirmModal**. We share only what deserves it.

### ConfirmModal

**One** Component shared for all delete/confirm operations. It takes: a title, a message, the operation type, and confirm/cancel buttons. The message differs depending on what is being deleted.

### Deletion rule

Every important page supports, as needed, **deleting a single item** and **deleting all**, with a strong Confirmation, and the message clarifies **what will be deleted and what will not be deleted**.

---

---

## 11. Master pages in detail

### 11.1 Home

```text
Historical Hero: "Welcome, Master. The main control panel of the Al-Ghazi in History platform"
   [ Contact the students on Telegram ]

4 Stat Cards: Number of students | Number of courses | Active subscriptions | Need review

Things that need action:
   New subscription requests → Review
   Book purchase requests    → Review
   Exams that need grading   → Start grading

Latest 3 results
Quick shortcuts: Add course | Add exam | Add book | View students
Latest activities: only the latest 5
```

Not included: Charts, Analytics, full tables, full student lists, Chat Center, delete buttons, Footer.

### 11.2 Students

- Title: "Students: manage students, their data, and their subscriptions".
- 3 Info Cards: Total students | Subscribed students | New requests.
- Search: name / email / phone. Filters: school grade, subscription status.
- Table: the student, the grade, phone number, courses, subscription status, actions (view details, delete).
- Pagination: 20 students per page.
- **Student details page (complete):** name, email, phone, parent phone, grade, governorate, courses, subscription statuses, results, requests, lesson permissions, edit the student, back.
- Deletion: a specific student + delete all students, with a warning for the related data.

### 11.3 Courses and content

- Title: "Courses and content: manage courses, lessons, and educational materials". A "+ Add course" button.
- Search "Search for a course…". Filters: school grade, course status (**published / unpublished**).
- Course Card: image, name, grade, number of lessons, number of exams, number of subscribed students, status, buttons (manage content, edit, delete).
- **Inside course management:** edit the course data, add an exam (takes you to the Exams page with the course preselected), go back, Units and Lessons (add/edit/delete), order Units and Lessons with ↑↓, lesson materials, delete a specific one and delete all.
- Not included: Drag & Drop, Analytics, Video watch tracking, student performance, Comments.
- At implementation time, read what is current from `courses.jsx` and `lessons.jsx`.

### 11.4 Exams and questions

- Title: "Exams and questions: manage exams, questions, their dates, and their scores". A "+ Add exam" button.
- Stats: total exams, published, ended, need grading.
- Search by exam name. Filters: course, grade, publish status (**published / unpublished**).
- **"Upcoming" is not a status the Master chooses.** The time status is **calculated automatically** from `startsAt` and `endsAt`: `Not started / Available now / Ended`.
- Exam Card: name, course, grade, number of questions, final score, duration, start, end, status, (manage the exam, edit, delete). Pagination + delete all.
- **Inside exam management:** the exam data, the questions (a table: #, question text, type, score, actions ↑ ↓ edit delete), "Add question", "Import JSON", **10 questions per page** with Pagination (so there is no long Scroll for 50 questions).
- **Adding a question:** manually or by JSON import. It supports the current types only: `multiple-choice / true-false / essay`.
- **JSON import:** upload a file or paste JSON ← Preview ← Validation ← Import. Wrong questions are **not imported**, and a clear error appears (example: "There is an error in question number 8: the correct answer is not specified").
- Not included: Copy Exam, Charts, Exam Analytics, Chat, Complex Exam Settings.

### 11.5 Results

- Title: "Results: follow up and grade students' results". An "Export results" button.
- Stats: total results, need grading, grading completed, today's results.
- Search by student or exam name. Filters: the student, the course, the exam, the grade, grading status (**needs grading / grading completed**).
- Table: #, the student, the exam, the course, the score, the date, grading status, action (view the result / start grading).
- **Result details:** the student's data, the grade, the exam, the course, the date, the score, the percentage, grading status, the student's answers beside the correct answer, Pagination for the questions, **Manual Grading** for essays, "Save the score" with an **automatic update of the total score and percentage**.
- Deletion: a single result or all. The student, the exam, and the questions are **not deleted**.
- Not included: Charts, Ranking, Best/Worst student, Advanced analytics, Student comparison, Chat.

### 11.6 Subscriptions and subscription requests

- One page with **two tabs:** "Subscriptions" and "Subscription requests".
- Stats (3 cards): active subscriptions, ended, need review.
- Search: student name, request number, transaction number. Filters: the grade, the course, request status.
- Request statuses: **Under review / Accepted / Rejected**. Rejection with no reason, and the student can submit a new request.
- **Subscription requests:** request number, the student, the course, the amount, the date, the transaction number, the status. Request details: the student's data, the subscription data (the course, the plan, the amount, the request date, the transaction number, the payment method), and two buttons **"Accept the request"** and **"Reject the request"**.
- **On acceptance → the subscription is activated automatically.** There is no second manual step.
- **Subscriptions:** the student, the course, the plan, the start, the end, the status. Actions: view, **extend the subscription**, **end the subscription**.

- Extension: a tool for the Master for direct/exceptional extension (example: 30 days). Paying for a new month is done through a **new subscription request**.
- **Not included:** free editing of a subscription, nor deleting a subscription as a normal action (a subscription is ended, not deleted).
- Deletion: one request / all requests.

### 11.7 Book purchase requests

- Title: "Book purchase requests: review the students' book purchase requests".
- Stats: total requests, need review, accepted requests.
- **Search (only 3 items):** student name, request number, transfer number. Filters: the grade, the book, request status (**under review / accepted / rejected**).
- Table: request number, the student, the book, transfer number, the amount, request date, action.
- Request details: the student's data, the book's data, payment data (payment method, transfer number, amount, date), the status, and two buttons **"Accept the request"** and **"Reject the request"**.
- **On acceptance → the book is recorded as purchased for the student** (a separate ownership table `bookPurchases`).
- Deletion: one request / all. **Deleting the accepted request does not cancel the student's right to the book.**
- Not included: a rejection reason, payment proof as an image.

### 11.8 Books and handouts

- Title: "Books and handouts: manage the books and handouts available to students".
- Buttons: "+ Add book" and "Book purchase requests".
- Stats: total books, available for purchase, unavailable for purchase.
- Search: the book's name or number. Filters: the grade, the book's status.
- Card: cover image, name, number, grade, price, **number of buyers**, status, (manage the book, view the book, edit, delete).
- Show this book's purchase requests, and the number of buyers.
- **Preview** of the book as it appears to the student: just a Modal, not a new page.

### 11.9 Lesson permissions

- Title: "Lesson permissions: manage students' permissions to access specific lessons".
- Stats: total permissions, students with special permissions.
- Search: student name, lesson name. Filters: the course, the grade.
- Table: the student, the course, the lesson, grant date, actions (view, revoke).
- **Adding a permission:** choose the student ← the course ← one lesson or several lessons. The system prevents Duplicates.
- Built on top of the existing `lessonAccess.jsx` and `lessonAccessService.jsx`, without inventing a new system.

### 11.10 Settings

- Title: "Settings: manage the account, payment, and data".
- **The Master's account:** name, email, phone, [Edit data], [Change password]. (Removed: last login.)
- **Vodafone Cash data only:** transfer number, support number, [Edit payment data]. There is no "Add a payment method".
- **Telegram:** a simple section "Means of communication with students" + [Open Telegram]. Not a Chat Center.
- **Data Management:** "Delete all chats" with a strong Warning. **Deleted:** the chats, the messages, the attachments. **Not deleted:** students, courses, exams, results, subscriptions, books.
- Permanently removed: Dark/Light switch, Multi-language, Teacher management, Roles system, Analytics, a complex Payment gateway, Complex school settings.

---

### 11.11 The pages and routes actually implemented

| Page | Routes |
|---|---|
| Courses | `/courses` (cards) · `/courses/new` · `/courses/:id` (manage units and lessons) · `/courses/:id/edit` |
| Exams | `/exams` · `/exams/new` · `/exams/:id` (questions + JSON import) · `/exams/:id/edit` |
| Results | `/results` (accepts `?examId=` and `?status=needs_review`) · `/results/:id` (grading) |
| Subscriptions | `/subscriptions` (two tabs) |
| Book requests | `/book-requests` |
| Books | `/books` · `/books/new` · `/books/:id/edit` |
| Lesson permissions | `/lesson-access` |
| Settings | `/settings` |

(All under `/dashboard-master`.)

**Implementation notes:**

- **The "Grading required" item (formerly "3 attempts"):** settled: it means **the number of students who submitted the exam and need grading from the Master**, it appears on the exam card and opens the results filtered. And the exam is once only.
- **Grading essays:** the final score = the auto-graded questions + the essays, and the score of each essay question is saved separately (`essayScores`).
- **Deleting a course:** shows a summary with the counts (units, lessons, exams, questions, results, subscriptions of which active, requests, permissions) and deletes what is related to it. **The students are not deleted.**
- **Settings:** the storage meter (Supabase / Cloudinary / Drive) shows **sample** numbers for now and has a "Sample data" badge. And changing the password is a sample (input validation only).
- **Images in the Mock:** the image upload is turned into a temporary data URL.

---

## 12. Final decisions and canceled ideas (do not suggest them again)

| Idea | Decision |
|---|---|
| Analytics / Charts / Ranking / Success Rate / Revenue / Course analytics | **Canceled.** The Master wants an operational Dashboard, not BI |
| Teacher Chat / Message Center / Chat Inbox in the Master dashboard | **Canceled.** Communication is through Telegram |
| Multi-Teacher / Roles / Permission matrix | **Canceled.** One Master only (the admin/student role exists in the Backend only) |
| **Rejecting a subscription request or a book request** | **Back (decision of October 3, 2026):** request statuses: under review / accepted / rejected. **With no rejection reason.** And the student can submit a new request after the rejection |
| Rejection reason | **Canceled** (just a rejection) |
| Academic Year for books | **Canceled** |
| Payment proof image | **Canceled** (the transfer number + the amount is enough) |
| An additional third Reference | **Canceled** |
| Copy Exam | **Canceled** |
| A manual "upcoming" exam status | **Canceled** (calculated automatically from the dates) |
| Drag & Drop for Units / Lessons / Questions | **Canceled**, the alternative is ↑ ↓ buttons |
| Free editing of a subscription | **Canceled**, the alternative: end + extend |
| Full E-commerce (Cart, Inventory, Shipping, Coupons…) | **Canceled** |
| Per-session subscription (Per-Lesson Subscription) | **Canceled**, the alternative: a special lesson permission |
| A duration on the lesson permission | **Canceled** (it continues until revoked) |
| Payment Gateway / adding payment methods from the Dashboard | **Canceled** |
| **The Activation Codes system for payment** | **Canceled.** Replaced by the requests system (Vodafone Cash + transaction number + the Master's accept/reject) |
| Dark/Light switch / Multi-language | **Canceled** |
| Retaking the exam | **Forbidden.** Only once per student |
| The chat in Supabase | **Canceled.** The chat will be connected to Firebase later. No tables or policies are to be implemented for it in Supabase |
| Storing images in Supabase | **Canceled.** Images are on Cloudinary (+ compression in the browser), handouts on Google Drive, and video on YouTube Unlisted |

---

## 13. Cleanup and the changes that were made (and what is still left)

**Done:**

- `rejected`: came back as an official status (with no reason). The student interface has "Re-request purchase" and this is **intentional**.
- The book requests prefix is `BK-` instead of `MK-`.
- `availability` for books was applied in the student interface and in the Master dashboard.
- The missing Mock fields were added: `published` for the course and the exam, `availability` for the book, `planId/startsAt/endsAt/sourceRequestId` for the subscription, `answers/essayScores/status/autoScore` for the result, `videoUrl/materialUrl` for the lesson.
- Book ownership is in `bookPurchases`, separate from the requests.
- The sample video and handout links moved from `LessonPage` to the lesson data.

**Still left (to be done at Backend connection time):**

1. Remove the `accessType: "lesson"` branch from `subscriptionService.jsx` (per-session subscription is canceled).
2. `Login` and `Signup` still do not actually log in / create an account (they wait for `authService`).
3. Exam grading is still in the browser (`ExamInterface`), and the correct answers reach the student: it turns into an RPC (Section 16).
4. `ExamInterface`/`ExamResult` use `sessionStorage` to save the attempt: to be removed.
5. Protecting `/dashboard-master` and all routes.
6. `src/App.css` is an empty, unused file (it can be deleted).
7. The old lint errors: fixed. 0 files with lint errors now.

---

## 14. How to work with the user (important)

- **Language:** Arabic in a simple, direct Egyptian style. The explanation is practical without complicated terms. Code and comments in English or as the project goes.
- **Feature by Feature / Page by Page.** Do not jump between files and do not add things without need.
- **First agree on the form and function of the page, and then write the code.**
- **Read the existing files before any code related to data.** Relying on an old copy from memory or on examples written in this README is forbidden.
- Do not assume the shape of the data. If you need a new field, tell the user.
- If you need clarification, **ask** instead of assuming.
- Do not start writing any code before you summarize your understanding and get confirmation.
- When delivering code: state the file name and its exact path, whether it is a new file or an edit, and write the file **in full**, ready to replace.
- Do not say "verified" unless `npm run build` and `npm run lint` were actually run.
- **Forbidden:** any secret key in the code or in the chat.

---

## 15. The next step

```text
The Frontend is complete on Mock Data     ←  complete
Connecting to Supabase + Cloudinary       ←  the next step: implement Section 16 phase by phase
```

Execution is done with the prompt `BACKEND_BUILD_PROMPT.md` on a **test (dev)** Supabase project, phase by phase with the user's approval after each one.

---

## 16. The Backend plan (Supabase + Cloudinary): the approved design

> Transferred verbatim from `BACKEND_PLAN.md`. It is the reference for the Backend design.

Based on reading the actual code (the services, the data, and the student and Master pages), and comparing it with the "security rules" image. The code is the reference wherever it differs from the image.

### 16.1 Conflicts between the image and the code (and the decision)

| In the image | In the code | Decision |
|---|---|---|
| An Activation Codes table for payment (`is_used`) | A **requests** system: the student transfers via Vodafone Cash and enters the transaction number, and the Master accepts or rejects | **The code is correct.** There is no Activation Codes table. Instead, two request tables (subscription + books) |
| Cloudinary for images | An `image` field holding a link as text | **Agreed.** + compress the image in the browser before uploading |
| Google Drive for handouts | A `materialUrl` field | **Agreed** |
| Protected YouTube Unlisted | A `videoUrl` field | **Agreed**, with protection from the server (Section 8) |
| Subscription check in the State only | — | **Not enough.** The check must happen on the server (RLS + functions) |

### 16.2 What each service stores

| Service | What it stores | Note |
|---|---|---|
| **Supabase** (Postgres + Auth + Edge Functions) | All texts, accounts, exams, scores, requests, and links | No images or files in it |
| **Firebase** (later, separate) | The chat only | Outside the scope of this plan |
| **Cloudinary** | Course images and book covers | In the table only the link + `public_id` |
| **Google Drive** | PDF handouts | In the table only the link |
| **YouTube Unlisted** | The videos | In the table only the link |

### 16.3 The tables (20 tables)

All prices are `numeric`, dates are `timestamptz`, and primary keys are `uuid` (except the small reference tables).

#### a) Reference and settings
1. **grades**: `id text PK`, `label`, `stage`, `sort_order`. (6 fixed rows)
2. **profiles**: `id uuid PK → auth.users ON DELETE CASCADE`, `role` ('student'|'admin') default 'student', `name`, `email` unique, `phone` unique, `guardian_phone`, `grade_id → grades`, `governorate`, `created_at`.
3. **app_settings**: `key text PK`, `value jsonb`. Keys: `telegram_url`, `master_display_name`.
4. **payment_methods**: `id text PK`, `name`, `account_number`, `support_whatsapp`, `is_active`.

#### b) Content
5. **courses**: `id`, `slug` unique, `title`, `description`, `grade_id`, `duration_label`, `image_url`, `image_public_id`, `published` default false, `created_at`.
6. **course_plans**: `id`, `course_id → courses CASCADE`, `plan_key` ('monthly'|'term'), `name`, `price`, `currency` default 'EGP'. Unique on (course_id, plan_key).
7. **units**: `id`, `course_id CASCADE`, `title`, `position`.
8. **lessons**: `id`, `unit_id CASCADE`, `title`, `duration_label`, `description`, `position`.
9. **lesson_media** (protected): `lesson_id PK → lessons CASCADE`, `video_url`, `material_url`, `material_title`.

#### c) Exams
10. **exams**: `id`, `course_id CASCADE`, `unit_id → units SET NULL`, `title`, `duration_minutes`, `starts_at`, `ends_at`, `published`, `created_at`.
11. **questions**: `id`, `exam_id CASCADE`, `position`, `type` ('multiple-choice'|'true-false'|'essay'), `body`, `options jsonb`, `score`.
12. **question_answers** (Master only): `question_id PK → questions CASCADE`, `correct_answer jsonb`.
13. **exam_attempts**: `id`, `exam_id CASCADE`, `student_id → profiles CASCADE`, `auto_score`, `auto_total`, `score`, `total`, `essay_total`, `correct_count`, `incorrect_count`, `status` ('graded'|'needs_review'), `submitted_at`, `graded_at`. **Unique on (exam_id, student_id)** = once only.
14. **attempt_answers**: `attempt_id CASCADE`, `question_id CASCADE`, `answer jsonb`, `awarded_score` (null for essays before grading). PK on both.

#### d) Subscriptions and permissions
15. **enrollments**: `id`, `student_id CASCADE`, `course_id CASCADE`, `plan_key`, `status` ('active'|'ended'), `starts_at`, `ends_at`, `ended_at`, `source_request_id → subscription_requests SET NULL`. Only one active subscription per (student, course) via a partial unique index. And "ended" is calculated from `ends_at`, not stored.
16. **subscription_requests**: `id`, `reference_number` unique (default `MK-` + random), `student_id CASCADE`, `course_id CASCADE`, `plan_key`, `amount`, `transaction_id` unique, `payment_method_id`, `status` ('pending'|'approved'|'rejected') default pending, `created_at`, `reviewed_at`. One pending request per (student, course).
17. **lesson_access**: `id`, `student_id CASCADE`, `course_id CASCADE`, `lesson_id CASCADE`, `created_at`. Unique on (student_id, lesson_id). Revoking = deleting the row.

#### e) Books
18. **books**: `id`, `title`, `description`, `grade_id`, `category`, `price`, `image_url`, `image_public_id`, `availability` ('available'|'unavailable'), `created_at`.
19. **book_purchase_requests**: like the subscription requests, with `book_id` and a `reference_number` prefixed `BK-`.
20. **book_purchases** (ownership record): `id`, `student_id CASCADE`, `book_id CASCADE`, `request_id → book_purchase_requests SET NULL`, `purchased_at`. Unique on (student_id, book_id). **Deleting the request does not delete the ownership.**

#### f) Chat: out of scope
The chat is **not part of Supabase**. It will be connected to a separate service (Firebase) later. So there is no table, no RLS, and no functions for the chat here, and `chatService.jsx` and anything related to chats **stays on the Mock and is not touched**. (The "Delete all chats" button in Settings stays connected to `chatService` until the chat is connected.)

**Notes:**
- The transfer transaction number (`transaction_id`) must be unique **across both tables** (subscriptions and books), so a trigger is created that checks the other table.
- There is no table for activities: the latest activities on the Master home are calculated from the results and the requests.
- I removed `access_type` and `lesson_id` from the subscription requests: the decision is that there is no paid per-session subscription (the individual lesson is by a permission from the Master).

### 16.4 Cascading delete (ON DELETE CASCADE)

- Deleting a **course** ← its units and lessons (and the media), its exams, their questions and their answers, its attempts, the students' answers, its subscriptions, its requests, and its permissions.
- Deleting an **exam** ← its questions and its attempts.
- Deleting a **book** ← its requests and its ownership record.
- Deleting a **student** ← deleting their account in Auth (an Edge Function with service role permission) ← deletes the profile ← deletes all their data.
- Deleting a **unit** ← its lessons. And the exams linked to it get `unit_id` set to null ("general review").
- Deleting an **accepted request** ← does not touch `enrollments` or `book_purchases`.
- The "Delete all" buttons in the Master dashboard ← RPC functions for the Master only.

### 16.5 Permissions (RLS)

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

### 16.6 Server functions (RPC) and Edge Functions

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

### 16.7 Images: compression + upload

1. The Master picks an image ← check the type and the maximum size.
2. **Compression in the browser before uploading** with the `browser-image-compression` library: maximum dimension 1600px, WebP format, target ≤ about 300KB, and processing in a Web Worker.
3. Instant preview.
4. At "Save" time: request a signature from `cloudinary-sign` ← upload to Cloudinary in the folder `alghazi/courses` or `alghazi/books`.
5. The table saves `image_url` (the secure_url) + `image_public_id`.
6. If the image is changed or the course/book is deleted ← `cloudinary-delete` with the `public_id`, so that old images do not eat up the storage.
7. At display time: links with `f_auto,q_auto` transformations and a width suitable for the card.

**Why a signed upload instead of an unsigned preset?** The unsigned preset's name is visible in the frontend, and anyone can upload to your account and use up the free storage. And the Master is the only one who uploads, so signing from a function for the Master is more suitable.

Public frontend keys only: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` and `VITE_CLOUDINARY_CLOUD_NAME`. The API secret and the service role **are stored in the Edge Functions secrets** and never in the code.

### 16.8 Video and handout (protection, honestly)

- Nobody can read the `lesson_media` table except the Master, and the student gets the links from `get_lesson_media` **after their subscription is checked**. So the visitor and the non-subscribed student never receive the link in any Network request.
- **The limit of the protection:** the subscribed student can see the Video ID in the Network tab and share it. YouTube Unlisted and a Drive link set to "anyone with the link" have no technical prevention of that. The actual protection is blocking the non-subscribed.

### 16.9 The storage meter (Settings)

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

### 16.10 Mapping to the code

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

### 16.11 Execution order (the site stays working at every step)

1. **The foundation:** the Supabase project, the tables, RLS, the functions, initial data (the grades, the payment method, the settings).
2. **Public reading:** the grades, courses, plans, lessons, books, and payment methods.
3. **Accounts:** sign-up (a trigger creates the profile), login (+ by phone), `getCurrentStudent`, route protection.
4. **The student journey:** subscriptions, lessons (the media via the function), exams (fetch + submit), results, subscription and book requests, book ownership.
5. **The Master dashboard:** the services one by one (students, courses, exams, results, subscriptions, books, permissions, settings), with the accept and grading functions.
6. **Images:** compression and Cloudinary upload and deleting the old one.
7. **Storage and hardening:** `storage-usage`, RLS testing for each role, reviewing the secrets.

### 16.12 Open questions (with the assumption)

1. **The chat:** outside the Supabase scope (Firebase later). It is not touched in this plan.
2. **Login by phone:** Supabase easily logs in with email and password. The assumption: we log in by email, and if they typed a phone we convert it to their email with `resolve-login`.
3. **Email confirmation:** the assumption: not required at the start.
4. **The Master's account:** it is created once manually, and given `role = 'admin'` via SQL.
5. **Initial data (seed):** the six grades, the payment method, and the settings (mandatory). And the sample content (courses, units, lessons, exams, questions, books) in a separate optional file. **No fake students** because every student must have a real login account.

### 16.13 Keys and secrets (fixed names)

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

---

*End of file.*
