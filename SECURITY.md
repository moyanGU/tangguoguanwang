# Security Policy

## Reporting

Report suspected vulnerabilities or website impersonation privately to `gary.tu@ulinktech.us`. Do not include credentials, customer material, or exploit details in a public GitHub issue.

Please include the affected URL, observed behavior, reproduction steps, and any supporting timestamps. We aim to acknowledge reports within two business days.

## Publishing Rules

- Changes to `main` must go through a pull request after branch protection is enabled.
- Never commit credentials, private keys, customer material, or unpublished production assets.
- Confirm usage rights and intended public visibility before adding media.
- Run `./scripts/security-check.ps1` before requesting review.

## Website Incident Runbook

1. Preserve screenshots, URLs, timestamps, and the current deployment commit.
2. Revoke suspicious GitHub, Wix, registrar, DNS, and mailbox sessions or tokens.
3. Restore the last trusted version with a reviewed revert commit; do not rewrite shared history during an incident.
4. Review GitHub, Wix, DNS, registrar, and mailbox audit logs to identify the first unauthorized change.
5. Rotate affected credentials and recovery methods, then verify the live site, DNS, TLS, and business email.
6. Record the cause, containment, affected period, and preventive action.
