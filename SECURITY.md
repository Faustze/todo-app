# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by opening a GitHub issue with the "security" label.

Include the following information:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fix (if any)

We will acknowledge receipt within 48 hours and aim to provide a fix or mitigation within 7 days.

## Security Considerations

### Client-Side Storage

This application uses `localStorage` for data persistence. Be aware that:

- Data stored in `localStorage` is accessible to any JavaScript running on the page
- Do not store sensitive information (passwords, tokens, personal data) in the application
- XSS vulnerabilities could expose stored data

### Dependencies

- Keep all dependencies up to date
- Run `npm audit` regularly to check for known vulnerabilities
- Review dependency updates before merging

### API Communication (Future)

When the API layer is implemented:

- All API communication must use HTTPS
- Input validation must be performed on both client and server
- Authentication tokens must be stored securely (httpOnly cookies preferred)
- Rate limiting should be implemented on API endpoints
