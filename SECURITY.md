# Security Policy

## Supported Versions

Only the latest version of Tax Reform Hub on the `main` branch is supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Tax Reform Hub seriously. If you discover a security vulnerability, please do **NOT** open a public GitHub issue.

Instead, please report the vulnerability privately by emailing the maintainers or filing a confidential security report via GitHub.

### What to Include in Your Report

- Description of the vulnerability and potential impact.
- Step-by-step instructions or proof-of-concept (PoC) to reproduce the issue.
- Affected components or input parameters.

## Response Timeline

- **Initial Acknowledgment:** Within 48 hours.
- **Triage & Assessment:** Within 5 business days.
- **Fix & Patch Disclosure:** Coordinated release within 14 days of confirmation.

## Client-Side Security Guarantees

- **No Remote Storage:** All tax calculations run 100% client-side in volatile memory.
- **Zero Input Persistence:** Proprietary company figures and CNPJs are never submitted to external servers.
- **XSS Protections:** Strictly enforced JSX auto-escaping; zero usage of `dangerouslySetInnerHTML` or `eval()`.
