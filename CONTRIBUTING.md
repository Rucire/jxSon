# Contributing to jxSon

First off, thank you for considering contributing to jxSon! It's people like you that make jxSon such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for jxSon. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible
* If the problem is related to performance or memory, include a CPU profile capture with your report

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for jxSon, including completely new features and minor improvements to existing functionality.

Before creating enhancement suggestions, please check the issue list as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please include as many details as possible:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Include screenshots if possible

### Pull Requests

* Fork the repo and create your branch from `main`
* If you've added code that should be tested, add tests
* If you've changed something, update the documentation
* Ensure the test suite passes
* Make sure your code lints
* Issue that pull request!

## Development Process

### Prerequisites

* Node.js (v16 or higher)
* npm, yarn, or pnpm

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/Rucire/jxSon.git
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

### Development

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. Make your changes

3. Run tests:
   ```bash
   npm run test
   # or
   yarn test
   # or
   pnpm test
   ```

4. Build the package:
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### Style Guide

* Use TypeScript for all new code
* Follow the existing code style
* Use meaningful variable and function names
* Add comments for complex logic
* Keep functions small and focused

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

* `bug` - Issues that are bugs
* `enhancement` - Issues that are feature requests
* `documentation` - Issues that are documentation improvements
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed

## Questions?

Feel free to open an issue for any questions you might have. 