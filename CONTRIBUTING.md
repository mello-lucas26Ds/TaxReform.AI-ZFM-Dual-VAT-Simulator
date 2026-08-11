# Contributing to Tax Reform Hub

Thank you for your interest in contributing to Tax Reform Hub!

## Development Workflow

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/your-username/tax-reform-hub.git
   cd tax-reform-hub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Local Development Server**
   ```bash
   npm run dev
   ```

4. **Verify Quality & Type Checks**
   ```bash
   npm run lint
   npm run build
   ```

## Contribution Guidelines

- **Domain Integrity:** Fiscal logic in `/src/domain` must remain pure TypeScript without React dependencies.
- **Tax Accuracy:** Any changes to tax rates must reference official legislation (e.g., EC 132/2023, PLP 68/2024, STF RE 574.706).
- **Type Safety:** Always maintain strict TypeScript types in `/src/types`.
- **Pull Requests:** Open PRs against the `main` branch with a clear summary of changes.
