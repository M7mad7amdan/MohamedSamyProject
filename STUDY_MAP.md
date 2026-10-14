# Study Map for the "Al-Ghazi in History" Project

The files are ordered from the first thing that runs and the first thing that appears on the screen (the hero) down to the last file. Number of files: **135** (checked automatically: no file is missing and none is duplicated).

## How to study each file
1. Read the description line here, then open the file.
2. Look at the `import`s at the top of the file: they tell you what the file depends on (and that is what you must have read before it).
3. Look at the state (`useState`) and then the `useEffect` (where it fetches the data from).
4. Last, read the JSX (the visual part).
5. If the file is a Master page, open its service next to it.

## The rule the whole project follows
`data` (sample data) ← `services` (the logic, async functions) ← the pages (display only). When you connect Supabase you replace things inside the services only and the pages stay as they are.


---

## Phase 0: Setup files and the starting point

Start here: how the project runs, and where any page begins. There is no business logic in this phase.

**1. `package.json`**   
The libraries (React, Router, Tailwind, Font Awesome, uuid) and the run commands. The Supabase library is not installed yet (it will be added at connection time).

**2. `vite.config.js`**   
Vite setup and the Tailwind plugin.

**3. `eslint.config.js`**   
Code quality checking rules (lint).

**4. `index.html`**   
The only HTML page: it has the root div and loads main.jsx.

**5. `.gitignore`**   
The files Git ignores (node_modules, dist, .env files).

**6. `README.md`**   
The decisions reference (fully updated on October 3, 2026). If it ever differs from the actual code, the actual code is the most up-to-date reference.

**7. `src/main.jsx`** (13 lines)  
The app's entry point: mounts React on the page and wraps App with StrictMode and BrowserRouter.  
↳ Imports: components/pages: App.jsx

**8. `src/index.css`** (35 lines)  
The colors (Midnight/Gold...), the Cairo font, and the global Tailwind settings. The source of the visual identity.

**9. `src/App.css`** (0 lines)  
Empty file (0 bytes) and unused. You can delete it or leave it.

**10. `src/App.jsx`** (106 lines)  
Map of all pages (Routes): public, student dashboard, Master dashboard. Any new page gets registered here.  
↳ Imports: components/pages: Home, Signup, Login, CourseDetails, ExamResult, Books, BookPurchase, ScrollToTop, DashboardLayout, DashboardHome, DashboardCourses, DashboardBooks, DashboardExams, DashboardResults, DashboardProfile, DashboardSupport, ExamInterface, LessonPage, Subscription, MasterLayout, MasterHome, MasterPlaceholder, MasterStudents, MasterStudentDetails, MasterCourses, MasterCourseForm, MasterCourseContent, MasterExams, MasterExamForm, MasterExamManage, MasterResults, MasterResultDetails, MasterSubscriptions, MasterBookRequests, MasterBooks, MasterBookForm, MasterLessonAccess, MasterSettings

**11. `src/Components/ScrollToTop.jsx`** (12 lines)  
Returns the page to the top every time you navigate between two pages.


---

## Phase 1: The site's home page (from top to bottom)

The sections in the exact order they appear on the screen: the hero first. Most of them are design and display with no logic.

**12. `src/Page/Home.jsx`** (44 lines)  
The home page: arranges the sections in order (Navbar ← Hero ← About ← Courses ← Books ← Opinions ← Footer).  
↳ Imports: components/pages: Navbar, HeroSection, AboutPlatform, Courses, StudentOpinions, Footer, BooksSection

**13. `src/Components/Navbar.jsx`** (295 lines)  
The site's top bar: the logo, links, and two buttons for login and sign up.

**14. `src/Components/HeroSection.jsx`** (136 lines)  
The hero section: the big headline "Learn history in a different way", the Master's photo, and the start buttons.

**15. `src/Components/AboutPlatform.jsx`** (323 lines)  
The "About the platform" section: the platform's features in cards (understanding events, exam preparation...).

**16. `src/Components/Courses.jsx`** (505 lines)  
The latest courses section: fetches the published courses and shows them as cards that lead to the details page.  
↳ Imports: services: courseService | utils: gradeUtils | components/pages: EmptyState

**17. `src/Components/Books/BooksSection.jsx`** (163 lines)  
The books section on the home page: fetches the books and shows BookCard cards.  
↳ Imports: services: bookService | components/pages: BookCard

**18. `src/Components/Books/BookCard.jsx`** (81 lines)  
A public book card: image, price, and a buy button (or "Not available for purchase" if the Master stopped it).  
↳ Imports: utils: gradeUtils

**19. `src/Components/StudentOpinions.jsx`** (247 lines)  
The student opinions section (static texts inside the file).

**20. `src/Components/Footer.jsx`** (565 lines)  
The site footer: platform description and contact and navigation links.


---

## Phase 2: The foundation everything depends on (constants, utils, data, services)

You must understand them before any page that has logic. The order: constants ← utils ← sample data ← the core services. The services are what will be replaced with Supabase.

**21. `src/constants/statusLabels.js`** (69 lines)  
All Arabic status texts (accepted, active, ended...) in one place.

**22. `src/utils/gradeUtils.jsx`** (5 lines)  
The getGradeLabel function: converts the grade code (first-preparatory) to its Arabic name.  
↳ Imports: data: grades

**23. `src/utils/formatters.js`** (60 lines)  
Formatting of date, time, price, and size (MB/GB), and converting a date to an input value.

**24. `src/utils/paginate.js`** (26 lines)  
paginate: splits a list into pages, and matchesSearch: text search. Every list service uses them.

**25. `src/utils/downloadTextFile.js`** (13 lines)  
Download a text file from the browser (CSV export of results).

**26. `src/utils/readImageFile.js`** (27 lines)  
Temporarily reads an image from the device. It will be replaced by a Cloudinary upload at connection time.

**27. `src/hooks/useAsyncData.js`** (33 lines)  
Loading hook: loading on first load, error, and cancellation on exit. Used by the Master pages.

**28. `src/data/grades.jsx`** (34 lines)  
The six school grades (preparatory and secondary).

**29. `src/data/students.jsx`** (11 lines)  
Sample students (name, grade, phone, guardian...).

**30. `src/data/courses.jsx`** (85 lines)  
Sample courses: title, grade, image, subscription plans (monthly/term), and the publish field.

**31. `src/data/lessons.jsx`** (53 lines)  
Units and each unit's lessons (an array of units, and each unit has an array of lessons).

**32. `src/data/exams.jsx`** (76 lines)  
Exams: course, unit, duration, start and end time, and publish status.

**33. `src/data/questions.jsx`** (344 lines)  
Exam questions (multiple choice, true/false, essay) and their correct answers.

**34. `src/data/results.jsx`** (80 lines)  
Students' results: the score, the answers, essay scores, and grading status.

**35. `src/data/enrollments.jsx`** (8 lines)  
Students' subscriptions to courses: the plan, start and end date, and status.

**36. `src/data/subscriptionRequests.jsx`** (5 lines)  
Subscription requests (request number, transfer number, status).

**37. `src/data/lessonAccess.jsx`** (6 lines)  
Individual lesson permissions granted to students.

**38. `src/data/books.jsx`** (76 lines)  
Books: title, price, image, and purchase availability.

**39. `src/data/bookPurchaseRequests.jsx`** (5 lines)  
Book purchase requests (status under review/accepted/rejected).

**40. `src/data/bookPurchases.jsx`** (26 lines)  
Book ownership record: who bought what (separate from the requests).

**41. `src/data/paymentMethods.jsx`** (11 lines)  
Payment methods (Vodafone Cash: the number and support WhatsApp).

**42. `src/data/chatMessages.jsx`** (44 lines)  
Sample messages for the chat.

**43. `src/data/masterProfile.jsx`** (9 lines)  
The Master's data (name, Telegram link...). The Topbar reads from it.

**44. `src/data/storageUsage.jsx`** (12 lines)  
Sample storage consumption numbers and free-plan limits.

**45. `src/services/gradeService.jsx`** (5 lines)  
getGrades: returns the grades.  
↳ Imports: data: grades

**46. `src/services/studentService.jsx`** (36 lines)  
getCurrentStudent (currently the first student), and fetch/edit/delete students.  
↳ Imports: data: students

**47. `src/services/courseService.jsx`** (71 lines)  
Courses: for the student only the published ones, and for the Master all courses + create/edit/delete.  
↳ Imports: data: courses

**48. `src/services/lessonService.jsx`** (174 lines)  
Units and lessons: display for the student + create/edit/delete/order for the Master.  
↳ Imports: data: lessons

**49. `src/services/examService.jsx`** (96 lines)  
Exams: for the student only the published ones, and for the Master all operations.  
↳ Imports: data: exams

**50. `src/services/questionService.jsx`** (110 lines)  
Questions: fetch, add, edit, delete, order.  
↳ Imports: data: questions

**51. `src/services/resultService.jsx`** (141 lines)  
Results: record the exam submission (once only), fetch, delete, update.  
↳ Imports: data: results

**52. `src/services/enrollmentService.jsx`** (125 lines)  
Subscriptions: isEnrollmentActive (the only definition of an active subscription), create, extend, end.  
↳ Imports: data: enrollments

**53. `src/services/subscriptionService.jsx`** (231 lines)  
Subscription requests: create, accept (activates the subscription), reject, delete.  
↳ Imports: data: subscriptionRequests | components/pages: enrollmentService, lessonAccessService

**54. `src/services/lessonAccessService.jsx`** (115 lines)  
Lesson permissions: grant, fetch, revoke.  
↳ Imports: data: lessonAccess

**55. `src/services/bookService.jsx`** (63 lines)  
Books: fetch, create, edit, delete, and isBookAvailable.  
↳ Imports: data: books

**56. `src/services/bookPurchaseService.jsx`** (165 lines)  
Book purchase requests: create (blocking unavailable/owned), accept (records the ownership), reject, delete.  
↳ Imports: data: bookPurchaseRequests | components/pages: bookService, bookPurchasesService

**57. `src/services/bookPurchasesService.jsx`** (71 lines)  
Book ownership record (deleting the request does not cancel it).  
↳ Imports: data: bookPurchases

**58. `src/services/paymentMethodService.jsx`** (29 lines)  
Payment methods: fetch the active ones and edit the account details.  
↳ Imports: data: paymentMethods

**59. `src/services/chatService.jsx`** (34 lines)  
Chat messages: fetch, send, delete all.  
↳ Imports: data: chatMessages

**60. `src/services/masterProfileService.jsx`** (11 lines)  
The Master's data: read and update.  
↳ Imports: data: masterProfile


---

## Phase 3: The public site pages (courses, books, and subscription)

The first pages that use the services: course details ← books ← buying a book ← subscribing to a course.

**61. `src/Components/CourseDetails.jsx`** (521 lines)  
Course details page (/courses/:id): units, lessons, and subscription plans, and it checks the student's subscription.  
↳ Imports: services: studentService, courseService, enrollmentService, lessonService, lessonAccessService | utils: gradeUtils | components/pages: Navbar, Footer

**62. `src/Page/Books.jsx`** (146 lines)  
All books page (/books) with a grade filter. (It imports grades from data directly: to be converted to getGrades.)  
↳ Imports: services: bookService | data: grades | components/pages: Navbar, Footer, BookCard

**63. `src/Page/BookPurchase.jsx`** (544 lines)  
Book purchase page: payment details, transfer number, and sending the request.  
↳ Imports: services: bookService, studentService, bookPurchaseService, paymentMethodService | components/pages: Navbar, Footer

**64. `src/Page/Subscription.jsx`** (672 lines)  
Page for subscribing to a course with a specific plan: payment details and sending the subscription request.  
↳ Imports: services: studentService, courseService, enrollmentService, subscriptionService, paymentMethodService | components/pages: Navbar


---

## Phase 4: Sign up and login

Two forms that validate the inputs. They are not yet connected to a real account (that is the work of connecting to Supabase Auth).

**65. `src/Components/Signup.jsx`** (601 lines)  
Sign-up form (input validation). It does not actually save a student yet: it waits for the connection.  
↳ Imports: data: grades

**66. `src/Components/Login.jsx`** (303 lines)  
Login form (input validation). It does not actually log in yet: it waits for the connection.


---

## Phase 5: The student dashboard (/dashboard-student)

The structure ← home ← courses ← the lesson ← exams ← taking the exam ← the result ← books ← profile ← support.

**67. `src/Components/DashboardStudent/DashboardLayout.jsx`** (24 lines)  
Student dashboard structure: the sidebar + the place for the pages.  
↳ Imports: components/pages: Navbar, Footer, DashboardSidebar, Chat

**68. `src/Components/DashboardStudent/DashboardSidebar.jsx`** (157 lines)  
Student dashboard side menu.

**69. `src/Components/DashboardStudent/EmptyState.jsx`** (33 lines)  
"No content" message for the student.

**70. `src/Page/DashboardStudent/DashboardHome.jsx`** (416 lines)  
Student home: summary of their courses, exams, and results.  
↳ Imports: services: studentService, courseService, enrollmentService, examService, resultService | utils: gradeUtils | components/pages: EmptyState

**71. `src/Page/DashboardStudent/DashboardCourses.jsx`** (218 lines)  
The courses the student is subscribed to.  
↳ Imports: services: studentService, courseService, enrollmentService | utils: gradeUtils | components/pages: EmptyState

**72. `src/Page/DashboardStudent/LessonPage.jsx`** (385 lines)  
Lesson page: the video, the handout, and the content list (contains temporary demo links).  
↳ Imports: services: studentService, courseService, lessonService, examService, enrollmentService, lessonAccessService | components/pages: LessonVideo, LessonMaterials, LessonContentList

**73. `src/Components/Lesson/LessonVideo.jsx`** (81 lines)  
YouTube video player: extracts the Video ID and shows it in an iframe.

**74. `src/Components/Lesson/LessonMaterials.jsx`** (62 lines)  
Handout download button (converts a Google Drive link to a download link).

**75. `src/Components/Lesson/LessonContentList.jsx`** (169 lines)  
List of the course's units and lessons beside the lesson.

**76. `src/Page/DashboardStudent/DashboardExams.jsx`** (267 lines)  
The student's exams list and their status (available/ended/solved).  
↳ Imports: services: studentService, examService, resultService, enrollmentService, courseService | components/pages: EmptyState, DashboardExamCard

**77. `src/Components/DashboardStudent/DashboardExamCard.jsx`** (128 lines)  
Exam card in the student's list.

**78. `src/Page/DashboardStudent/ExamInterface.jsx`** (477 lines)  
Exam-taking screen: the timer, navigation, submission (once), and recording the result.  
↳ Imports: services: examService, questionService, studentService, enrollmentService, resultService | components/pages: ExamQuestionCard, ExamQuestionNavigator, ExamTimer

**79. `src/Components/DashboardStudent/ExamTimer.jsx`** (90 lines)  
Exam timer.

**80. `src/Components/DashboardStudent/ExamQuestionNavigator.jsx`** (88 lines)  
Question numbers for quick navigation.

**81. `src/Components/DashboardStudent/ExamQuestionCard.jsx`** (249 lines)  
Displays a single question in all its types (multiple choice, true/false, essay).

**82. `src/Components/ExamResult.jsx`** (320 lines)  
Exam result page after submission (/exam-result/:id).  
↳ Imports: services: studentService, examService, resultService

**83. `src/Page/DashboardStudent/DashboardResults.jsx`** (326 lines)  
All the student's results.  
↳ Imports: services: studentService, resultService, examService, courseService | components/pages: EmptyState, DashboardResultCard

**84. `src/Components/DashboardStudent/DashboardResultCard.jsx`** (76 lines)  
Result card.

**85. `src/Page/DashboardStudent/DashboardBooks.jsx`** (177 lines)  
The student's books and the purchase status of each book.  
↳ Imports: services: studentService, bookService, bookPurchaseService, bookPurchasesService | utils: gradeUtils | components/pages: DashboardBookCard

**86. `src/Components/DashboardStudent/DashboardBookCard.jsx`** (103 lines)  
Book card for a student: buy/under review/purchased/rejected/unavailable.  
↳ Imports: utils: gradeUtils

**87. `src/Page/DashboardStudent/DashboardProfile.jsx`** (223 lines)  
The student's profile.  
↳ Imports: services: studentService | components/pages: EmptyState

**88. `src/Page/DashboardStudent/DashboardSupport.jsx`** (220 lines)  
Support page (shows the chat component).

**89. `src/Components/Chat.jsx`** (174 lines)  
Chat window (study assistant): fetches and sends messages.  
↳ Imports: services: chatService | components/pages: ChatMessage

**90. `src/Components/Chat/ChatMessage.jsx`** (73 lines)  
A single message bubble.


---

## Phase 6: The Master dashboard: the structure and the shared components (/dashboard-master)

Read them before any Master page: every page is built from them. The order: the structure ← the styles ← the small components ← the windows.

**91. `src/Components/DashboardMaster/MasterLayout.jsx`** (35 lines)  
Master dashboard structure: the fixed sidebar + the top bar + the place for the pages.  
↳ Imports: components/pages: MasterSidebar, MasterTopbar

**92. `src/Components/DashboardMaster/MasterSidebar.jsx`** (208 lines)  
Side menu (10 sections), the hamburger button on mobile, and logout.

**93. `src/Components/DashboardMaster/MasterTopbar.jsx`** (281 lines)  
Home: Hero with an image. The other pages: a thin bar with the page name. The name and Telegram come from the Master's settings.  
↳ Imports: services: masterProfileService | hooks: useAsyncData

**94. `src/Components/DashboardMaster/Shared/masterStyles.js`** (27 lines)  
Shared classes for buttons, fields, and cards (the identity in one place).

**95. `src/Components/DashboardMaster/Shared/MasterPageHeader.jsx`** (26 lines)  
Page title + back/add button.

**96. `src/Components/DashboardMaster/Shared/MasterStatCard.jsx`** (4 lines)  
Number/statistic card.

**97. `src/Components/DashboardMaster/Shared/MasterSearchFilters.jsx`** (24 lines)  
Search and filters bar.

**98. `src/Components/DashboardMaster/Shared/MasterPagination.jsx`** (64 lines)  
Pagination (takes itemLabel: student/course...).

**99. `src/Components/DashboardMaster/Shared/MasterStatusBadge.jsx`** (30 lines)  
Colored status badge.

**100. `src/Components/DashboardMaster/Shared/MasterEmptyState.jsx`** (5 lines)  
"No data" message.

**101. `src/Components/DashboardMaster/Shared/MasterNotice.jsx`** (28 lines)  
Success/error bar.

**102. `src/Components/DashboardMaster/Shared/MasterConfirmModal.jsx`** (9 lines)  
Confirmation window (for deletion and dangerous operations).

**103. `src/Components/DashboardMaster/Shared/MasterModal.jsx`** (75 lines)  
General window for forms and details.

**104. `src/Components/DashboardMaster/Shared/MasterField.jsx`** (78 lines)  
Unified form field (text/list/long text) with an error message.  
↳ Imports: components/pages: masterStyles

**105. `src/Components/DashboardMaster/Shared/MasterTabs.jsx`** (36 lines)  
Tabs (in the Subscriptions page).

**106. `src/Components/DashboardMaster/Shared/MasterImageField.jsx`** (48 lines)  
Temporary image upload (to be replaced by Cloudinary).  
↳ Imports: utils: readImageFile

**107. `src/Page/DashboardMaster/MasterPlaceholder.jsx`** (35 lines)  
"Under preparation" page for any link that has no page.


---

## Phase 7: The Master pages, page by page (each page and then its service)

The same order as the sidebar. The rule: the page is display only, and the master...Service is the brain (search, filters, cascading delete, accept, grading).

**108. `src/Page/DashboardMaster/MasterHome.jsx`** (428 lines)  
Master home: statistics, things that need action, latest results and activities.  
↳ Imports: services: masterDashboardService

**109. `src/services/masterDashboardService.jsx`** (138 lines)  
Collects and calculates the home summary.  
↳ Imports: utils: gradeUtils | constants: statusLabels | components/pages: studentService, courseService, examService, resultService, enrollmentService, subscriptionService, bookPurchaseService

**110. `src/Page/DashboardMaster/MasterStudents.jsx`** (180 lines)  
Students list: search, filters, pagination, and statistics.  
↳ Imports: services: masterStudentsService | components/pages: MasterConfirmModal, MasterEmptyState, MasterPagination, MasterPageHeader, MasterSearchFilters, MasterStatCard, MasterStatusBadge

**111. `src/Page/DashboardMaster/MasterStudentDetails.jsx`** (472 lines)  
Student details: their data, subscriptions, results, and requests, and edit/delete.  
↳ Imports: services: masterStudentsService | components/pages: MasterConfirmModal, MasterEmptyState, MasterPageHeader, MasterStatusBadge

**112. `src/services/masterStudentsService.jsx`** (336 lines)  
Logic for the two students pages (list, details, and cascading delete).  
↳ Imports: utils: gradeUtils | constants: statusLabels | components/pages: studentService, courseService, examService, enrollmentService, resultService, subscriptionService, bookPurchaseService, lessonAccessService, bookService, gradeService, bookPurchasesService, lessonService

**113. `src/Page/DashboardMaster/MasterCourses.jsx`** (291 lines)  
Course cards: publish/hide/delete with a summary of the records.  
↳ Imports: services: masterCoursesService | hooks: useAsyncData | components/pages: MasterConfirmModal, MasterEmptyState, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatusBadge, masterStyles

**114. `src/Page/DashboardMaster/MasterCourseForm.jsx`** (153 lines)  
Add/edit a course (data, prices, and image).  
↳ Imports: services: masterCoursesService | hooks: useAsyncData | components/pages: MasterField, MasterImageField, MasterNotice, MasterPageHeader, MasterEmptyState, masterStyles

**115. `src/Page/DashboardMaster/MasterCourseContent.jsx`** (461 lines)  
Manage a course's units and lessons (ordering ↑↓, video, handout).  
↳ Imports: services: masterCoursesService | hooks: useAsyncData | components/pages: MasterConfirmModal, MasterEmptyState, MasterField, MasterModal, MasterNotice, MasterPageHeader, MasterStatusBadge, masterStyles

**116. `src/services/masterCoursesService.jsx`** (436 lines)  
Courses pages logic, content, and cascading delete.  
↳ Imports: utils: gradeUtils, paginate | constants: statusLabels | components/pages: courseService, lessonService, examService, questionService, resultService, enrollmentService, subscriptionService, lessonAccessService, gradeService

**117. `src/Page/DashboardMaster/MasterExams.jsx`** (301 lines)  
List of exams and their statistics (the time status is calculated automatically).  
↳ Imports: services: masterExamsService | utils: formatters | hooks: useAsyncData | components/pages: MasterConfirmModal, MasterEmptyState, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatCard, MasterStatusBadge, masterStyles

**118. `src/Page/DashboardMaster/MasterExamForm.jsx`** (167 lines)  
Add/edit an exam (course, unit, and time).  
↳ Imports: services: masterExamsService | hooks: useAsyncData | components/pages: MasterEmptyState, MasterField, MasterNotice, MasterPageHeader, masterStyles

**119. `src/Page/DashboardMaster/MasterExamManage.jsx`** (651 lines)  
Manage the exam's questions + JSON import with preview.  
↳ Imports: services: masterExamsService | utils: formatters | hooks: useAsyncData | components/pages: MasterConfirmModal, MasterEmptyState, MasterField, MasterModal, MasterNotice, MasterPageHeader, MasterPagination, MasterStatCard, MasterStatusBadge, masterStyles

**120. `src/services/masterExamsService.jsx`** (568 lines)  
Exams and questions logic and JSON import/validation.  
↳ Imports: utils: gradeUtils, formatters, paginate | constants: statusLabels | components/pages: examService, questionService, resultService, courseService, lessonService, gradeService

**121. `src/Page/DashboardMaster/MasterResults.jsx`** (284 lines)  
Results list: filters, CSV export, delete.  
↳ Imports: services: masterResultsService | utils: downloadTextFile, formatters | hooks: useAsyncData | components/pages: MasterConfirmModal, MasterEmptyState, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatCard, MasterStatusBadge, masterStyles

**122. `src/Page/DashboardMaster/MasterResultDetails.jsx`** (251 lines)  
Result details and grading of essay questions.  
↳ Imports: services: masterResultsService | utils: formatters | hooks: useAsyncData | components/pages: MasterConfirmModal, MasterEmptyState, MasterNotice, MasterPageHeader, MasterPagination, MasterStatCard, MasterStatusBadge, masterStyles

**123. `src/services/masterResultsService.jsx`** (332 lines)  
Results and grading logic (final score = auto + essay) and export.  
↳ Imports: utils: gradeUtils, formatters, paginate | constants: statusLabels | components/pages: resultService, studentService, courseService, examService, questionService, gradeService

**124. `src/Page/DashboardMaster/MasterSubscriptions.jsx`** (495 lines)  
Two tabs: subscriptions (extend/end) and subscription requests (accept/reject/delete).  
↳ Imports: services: masterSubscriptionsService | utils: formatters | hooks: useAsyncData | components/pages: MasterConfirmModal, MasterEmptyState, MasterField, MasterModal, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatCard, MasterStatusBadge, MasterTabs, masterStyles

**125. `src/services/masterSubscriptionsService.jsx`** (263 lines)  
Subscriptions and requests logic.  
↳ Imports: utils: gradeUtils, paginate | constants: statusLabels | components/pages: subscriptionService, enrollmentService, studentService, courseService, paymentMethodService, gradeService

**126. `src/Page/DashboardMaster/MasterBookRequests.jsx`** (308 lines)  
Book purchase requests: review, accept, reject, and delete.  
↳ Imports: services: masterBookRequestsService | utils: formatters | hooks: useAsyncData | components/pages: MasterConfirmModal, MasterEmptyState, MasterModal, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatCard, MasterStatusBadge, masterStyles

**127. `src/services/masterBookRequestsService.jsx`** (143 lines)  
Book requests logic.  
↳ Imports: utils: gradeUtils, paginate | constants: statusLabels | components/pages: bookPurchaseService, bookPurchasesService, bookService, studentService, paymentMethodService, gradeService

**128. `src/Page/DashboardMaster/MasterBooks.jsx`** (327 lines)  
Book cards: available/unavailable, preview, delete.  
↳ Imports: services: masterBooksService | utils: formatters | hooks: useAsyncData | components/pages: MasterConfirmModal, MasterEmptyState, MasterModal, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatCard, MasterStatusBadge, masterStyles

**129. `src/Page/DashboardMaster/MasterBookForm.jsx`** (131 lines)  
Add/edit a book.  
↳ Imports: services: masterBooksService | hooks: useAsyncData | components/pages: MasterEmptyState, MasterField, MasterImageField, MasterNotice, MasterPageHeader, masterStyles

**130. `src/services/masterBooksService.jsx`** (223 lines)  
Books logic and cascading delete.  
↳ Imports: utils: gradeUtils, paginate | constants: statusLabels | components/pages: bookService, bookPurchasesService, bookPurchaseService, gradeService

**131. `src/Page/DashboardMaster/MasterLessonAccess.jsx`** (321 lines)  
Grant and revoke individual lesson permissions.  
↳ Imports: services: masterLessonAccessService | utils: formatters | hooks: useAsyncData | components/pages: MasterConfirmModal, MasterEmptyState, MasterField, MasterModal, MasterNotice, MasterPageHeader, MasterPagination, MasterSearchFilters, MasterStatCard, masterStyles

**132. `src/services/masterLessonAccessService.jsx`** (129 lines)  
Permissions logic with duplicate prevention.  
↳ Imports: utils: gradeUtils, paginate | constants: statusLabels | components/pages: lessonAccessService, lessonService, courseService, studentService, gradeService

**133. `src/Page/DashboardMaster/MasterSettings.jsx`** (361 lines)  
The account, password, payment details, storage used, delete chats.  
↳ Imports: services: masterSettingsService | utils: formatters | hooks: useAsyncData | components/pages: MasterConfirmModal, MasterEmptyState, MasterField, MasterNotice, MasterPageHeader, masterStyles

**134. `src/services/masterSettingsService.jsx`** (89 lines)  
Settings logic and input validation.  
↳ Imports: components/pages: masterProfileService, paymentMethodService, chatService, masterStorageService

**135. `src/services/masterStorageService.jsx`** (23 lines)  
Storage numbers (sample) in the same shape as the final connection.  
↳ Imports: data: storageUsage | constants: statusLabels


---

## Appendix: Images (assets) and public files

- `src/assets/Background/`: 11 files (1.jpg, Login.webp, Result Exam.jpg, bg1.png, bg2.webp, coureses.webp, dashbord student 1.webp, dashbord student 2.webp, dashbord student home.webp, hero-bg.webp, signup.jpg)
- `src/assets/Books/`: 6 files (book1.jpeg, book2.jpeg, book3.webp, book4.jpeg, book5.jpeg, book6.webp)
- `src/assets/Logo/`: 2 files (logo.jpeg, transparent-Logo.png)
- `src/assets/Master/`: 7 files (Master transparent.png, master 1.webp, master 2.webp, master 3.webp, master no transparent.jpeg, master-home.png, master.webp)
- `public/`: Imgs-plan, Imgs-websit
