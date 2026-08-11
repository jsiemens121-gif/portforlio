# portforlio — Claude generator setup

This repository was initialized with a small generator and GitHub Actions workflow that lets you call Anthropic Claude to generate or modify files and create a PR with the results.

How it works

- Add your Anthropic API key to the repository secrets as `ANTHROPIC_API_KEY`.
- Go to the Actions tab, choose "Claude generator", click "Run workflow", and enter a prompt. The workflow will call Claude, create a new branch, commit generated files, and open a PR.

Security

- The workflow uses the repository secret `ANTHROPIC_API_KEY`. Do not store keys in code.

Notes

- The generator expects Claude to return a JSON object mapping file paths to file contents (e.g., {"index.html": "<html>...</html>"}). The generator script attempts to parse the model output as JSON. If Claude returns extra text, edit your prompt to instruct the model to respond with JSON only.

If you want changes pushed directly to main instead of a PR, edit the workflow at `.github/workflows/claude-generate.yml`.
