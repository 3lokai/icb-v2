# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it to us privately:

1. **Email**: [security@example.com](mailto:security@example.com)
2. **GitHub Security Advisories**: Use the "Report a vulnerability" button on the repository's Security tab

Please include the following information:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Security Best Practices

### Environment Variables
- Never commit `.env.local` or any file containing secrets
- Use strong, unique values for all environment variables
- Rotate secrets regularly
- Use different secrets for different environments

### Supabase Security
- Enable Row Level Security (RLS) on all tables
- Use service role keys only on the server-side
- Regularly review and audit database permissions
- Enable MFA for Supabase dashboard access

### Dependencies
- Keep all dependencies up to date
- Use `npm audit` to check for vulnerabilities
- Consider using tools like Renovate or Dependabot for automated updates

### Deployment
- Use HTTPS in production
- Set secure headers (HSTS, CSP, etc.)
- Regularly update your deployment platform
- Monitor for unusual activity

## Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Within 30 days (depending on complexity)

## Acknowledgments

We appreciate the security research community and will acknowledge responsible disclosure in our security advisories.
