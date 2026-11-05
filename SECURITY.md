# Security Policy

## Supported code

ICB is an actively developed web application rather than a versioned package. Security fixes are prioritized for the currently deployed code on the `main` branch; older commits, forks, and self-hosted deployments may not receive backported fixes.

## Report a vulnerability privately

**Please do not file public issues or pull requests describing exploitable vulnerabilities.**

Use one of these channels:

1. GitHub's **Report a vulnerability** option in the repository's Security tab, if available.
2. Email [support@indiancoffeebeans.com](mailto:support@indiancoffeebeans.com) with the subject **Security report**.

Please describe the issue, affected component, steps to reproduce, potential impact, and a safe way to verify a fix. Do not send real credentials, private user data, or exploit traffic against the production application.

The maintainer will review reports and coordinate fixes as availability allows. Acknowledgment and resolution times depend on severity and maintenance capacity; we cannot guarantee fixed service-level deadlines.

## Security practices for contributors

- Never commit secrets or real user data, including `.env.local` and service-role keys.
- Use a separate development Supabase project; keep service-role credentials server-side only.
- Preserve appropriate row-level security policies when touching data access.
- Review dependency updates and test security-sensitive changes.
- Report suspected production vulnerabilities privately before publishing details.

Thanks to researchers and contributors who disclose issues responsibly.
