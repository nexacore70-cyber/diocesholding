NEXACORE ADMIN BACKEND SECURITY CONTRACT
========================================

Authentication
--------------

POST /api/admin/auth/login
- Validate staff email and password.
- Require MFA challenge when enabled.
- Refuse normal user accounts.
- Issue secure HttpOnly session cookie.
- Record successful and failed attempts.

POST /api/admin/auth/mfa/verify
- Verify time-based code or security-key assertion.
- Bind MFA completion to the pending login session.

GET /api/admin/auth/session
- Return staff ID, name, role and effective permissions.
- Do not return password, MFA secret or internal security data.

POST /api/admin/auth/logout
- Revoke the session server-side.
- Clear the cookie.

Staff and Permissions
---------------------

GET    /api/admin/staff
POST   /api/admin/staff/invitations
PATCH  /api/admin/staff/:staffId/role
PATCH  /api/admin/staff/:staffId/status
GET    /api/admin/roles
GET    /api/admin/permissions

Rules:
- Only Super Admin manages staff.
- A Super Admin cannot remove their own last-owner access.
- Role changes require audit records.
- Sensitive staff changes require MFA confirmation.

Users and KYC
-------------

GET   /api/admin/users
GET   /api/admin/users/:userId
PATCH /api/admin/users/:userId/status

GET   /api/admin/kyc
GET   /api/admin/kyc/:caseId
POST  /api/admin/kyc/:caseId/approve
POST  /api/admin/kyc/:caseId/reject
POST  /api/admin/kyc/:caseId/request-information

Rules:
- KYC documents use signed, short-lived URLs.
- Document access is logged.
- KYC result and user verification state update atomically.
- Payout remains disabled while required KYC is incomplete.

Academy
-------

GET    /api/admin/courses
POST   /api/admin/courses
GET    /api/admin/courses/:courseId
PATCH  /api/admin/courses/:courseId
POST   /api/admin/courses/:courseId/publish
POST   /api/admin/courses/:courseId/archive

GET    /api/admin/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/:categoryId

Rules:
- Published course versions are immutable snapshots for existing enrollments.
- Price changes require effective dates.
- Tutor eligibility is verified before assignment.

Projects and Disputes
---------------------

GET  /api/admin/projects
GET  /api/admin/projects/:projectId
POST /api/admin/projects/:projectId/pause
POST /api/admin/projects/:projectId/resume
POST /api/admin/projects/:projectId/dispute

GET  /api/admin/disputes
GET  /api/admin/disputes/:disputeId
POST /api/admin/disputes/:disputeId/assign
POST /api/admin/disputes/:disputeId/resolve

Rules:
- Opening a dispute pauses payout and controlled final release.
- Resolution uses an atomic transaction.
- Evidence access is limited to assigned staff.
- Private message access requires dispute/report justification.

Payments and Payouts
--------------------

GET  /api/admin/payments
GET  /api/admin/payments/:paymentId
POST /api/admin/payments/:paymentId/reconcile
POST /api/admin/payments/:paymentId/hold
POST /api/admin/payments/:paymentId/release
POST /api/admin/payments/:paymentId/refund

GET  /api/admin/payouts
POST /api/admin/payouts/:payoutId/approve
POST /api/admin/payouts/:payoutId/reject

Rules:
- Verify provider webhook signature.
- Verify reference, amount, currency and company destination.
- Use idempotency keys.
- An open dispute, refund, chargeback or fraud flag blocks payout.
- 80/20 and 60/40 calculations are stored as contract snapshots.
- Reconciliation and payout cannot be the same unrestricted permission.

Support
-------

GET   /api/admin/support
GET   /api/admin/support/:ticketId
POST  /api/admin/support/:ticketId/assign
POST  /api/admin/support/:ticketId/respond
POST  /api/admin/support/:ticketId/escalate
POST  /api/admin/support/:ticketId/close

Reports
-------

GET /api/admin/reports/users
GET /api/admin/reports/academy
GET /api/admin/reports/projects
GET /api/admin/reports/finance
GET /api/admin/reports/disputes
GET /api/admin/reports/support

Exports should:
- Apply permission and date filters.
- Generate server-side.
- Use expiring download links.
- Record the export in the audit log.

Audit
-----

GET /api/admin/audit

Audit records should be append-only and include:
- actor_staff_id
- actor_role
- effective_permission
- action
- target_type
- target_id
- previous_state_hash or snapshot
- new_state_hash or snapshot
- reason
- IP
- user agent
- session ID
- request/correlation ID
- timestamp

Recommended Database Tables
---------------------------

staff_users
staff_roles
staff_permissions
staff_role_permissions
staff_sessions
staff_mfa_methods
staff_invitations

users
user_profiles
kyc_cases
kyc_documents
kyc_reviews

courses
course_versions
course_categories
course_prices
course_tutors
enrollments

projects
bids
project_assignments
project_status_history
project_rooms
project_files

disputes
dispute_evidence
dispute_notes
dispute_resolutions

payments
payment_provider_events
escrow_ledger_entries
payouts
refunds
financial_reconciliations

support_tickets
support_messages
support_assignments

admin_audit_logs
admin_report_exports
platform_settings
platform_setting_versions

Deployment
----------

- Put admin API behind a separate hostname where practical.
- Apply WAF and IP/device controls for high-risk actions.
- Use strict Content Security Policy.
- Disable preview mode.
- Require HTTPS.
- Monitor failed logins and privilege changes.
- Alert the owner when payouts, roles or platform percentages change.
