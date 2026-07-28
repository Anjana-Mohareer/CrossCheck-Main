# CrossCheck — Full-Stack Hiring Intelligence Platform

A clean, responsive React + Spring Boot project based on the supplied CrossCheck design reference and all 16 requirement modules.

## Included
- Professional landing page, demo request and contact section
- Admin, HR and Recruiter authentication with role-based Admin Panel
- Candidate CRUD, search, filtering, profile tabs and document upload
- Employment, education, identity and document verification statuses
- Duplicate candidate / multiple-offer signals
- Explainable hiring risk score (0–100) and Low/Medium/High output
- Joining-probability calculation using notice period, acceptance, salary fit, interest and interview feedback
- Dashboard cards, charts and recent-check table
- PDF candidate risk report download and browser share action
- Notifications and audit logs
- H2 database by default, optional MySQL profile, complete production schema reference
- Responsive layouts, grids, consistent H1/H2/H3 typography, tables, cards and shadows

## Technology
Frontend: React, Vite, React Router, Recharts, Lucide icons
Backend: Java 17, Spring Boot, Spring Data JPA, H2/MySQL, OpenPDF

## Run Backend
1. Open `backend` in IntelliJ IDEA as a Maven project.
2. Use JDK 17.
3. Allow Maven to download dependencies.
4. Run `CrossCheckApplication`.
5. Backend runs at `http://localhost:8080`.
6. H2 console: `http://localhost:8080/h2-console` using JDBC URL `jdbc:h2:file:./data/crosscheck`, user `sa`, blank password.

For MySQL, edit `application-mysql.properties`, then run with profile `mysql`:
`mvn spring-boot:run -Dspring-boot.run.profiles=mysql`

## Run Frontend
1. Open a terminal in `frontend`.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:5173`.

## Demo Logins
- Admin: `admin@crosscheck.com` / `Admin@123`
- HR: `hr@crosscheck.com` / `Hr@123`
- Recruiter: `recruiter@crosscheck.com` / `Recruiter@123`

## Notes
- The risk engine and joining probability are explainable rule-based starter implementations. They are ready to be replaced with a trained ML service later.
- Email/SMS are represented through in-app notification events. Production email/SMS requires provider credentials.
- Aadhaar/PAN/passport and employment checks are workflow statuses; real government/provider verification requires authorized APIs and compliance approval.
- Uploaded files are stored under the backend `uploads` directory.
- `database-schema.sql` contains the complete requested table design.


## Hire Candidate action
Candidate Details now includes a Hire Candidate button. Hiring records the status, hiring time and logged-in user, adds an audit log, and creates an in-app notification.

## User registration
The login page now includes a **Create an account** link. New users can register from `/register` as Admin, HR, or Recruiter. Registration is handled by `POST /api/auth/register`; passwords are BCrypt-hashed, duplicate emails are rejected, the registration action is added to audit logs, and successful registration signs the user in automatically.


## Candidate photo
Recruiters can upload, preview, replace, or remove a candidate profile photo while adding or editing a candidate. Supported formats: JPG, PNG, and WEBP up to 3 MB. The photo is displayed in candidate tables and the candidate details page.

## Identity verification flow
The Add/Edit Candidate page now captures Aadhaar, PAN and passport numbers plus supporting PDF/image uploads. These values are persisted by the backend in the candidate record. The Identity tab on Candidate Details allows HR/Admin to review the masked number, open the uploaded proof, and mark identity as Verified, Pending or Failed. The backend never creates identity data automatically; it only stores and evaluates data submitted by an authorized user.

## UI refinement update
- Candidate form sections realigned with no blank columns or unused spaces.
- Consistent capitalized headings, labels, search text and table headings.
- Reviewed candidate profile redesigned with trust score, joining probability, verification report and AI recommendation.
- Responsive layouts added for desktop, tablet and mobile.

## Email notifications

The backend includes SMTP email support for registration, candidate, verification, offer-letter, hiring and document updates. See `EMAIL_SERVICE_SETUP.md` for Gmail App Password and environment-variable setup.
