# CrossCheck Email Service

Email notifications are now sent to the respective registered email addresses for:

- New user registration
- Candidate added
- Candidate profile updated
- Verification status updated
- Offer letter verification updated
- Candidate hired
- Candidate document uploaded
- Forgot-password request

## Gmail SMTP setup

For security, SMTP credentials are not hardcoded in the project.

Set these environment variables before starting the backend:

### Windows PowerShell

```powershell
$env:CROSSCHECK_MAIL_ENABLED="true"
$env:MAIL_USERNAME="yourgmail@gmail.com"
$env:MAIL_PASSWORD="your-16-character-google-app-password"
$env:CROSSCHECK_MAIL_FROM="yourgmail@gmail.com"
mvn spring-boot:run
```

### Windows Command Prompt

```cmd
set CROSSCHECK_MAIL_ENABLED=true
set MAIL_USERNAME=yourgmail@gmail.com
set MAIL_PASSWORD=your-16-character-google-app-password
set CROSSCHECK_MAIL_FROM=yourgmail@gmail.com
mvn spring-boot:run
```

Use a Google App Password, not the normal Gmail password. Two-step verification must be enabled in the Google account before creating an App Password.

## Other SMTP providers

You can also set:

```text
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USERNAME=your-account@example.com
MAIL_PASSWORD=your-smtp-password
CROSSCHECK_MAIL_FROM=your-account@example.com
CROSSCHECK_MAIL_ENABLED=true
```

## Safe development mode

Email sending is disabled by default. While disabled, the backend logs an email preview instead of failing candidate operations. This allows the application to run normally before SMTP credentials are configured.
