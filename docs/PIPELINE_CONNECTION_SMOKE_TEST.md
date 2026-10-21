# GitHub–Vercel connection smoke test

This file is a harmless pipeline probe. It contains no credentials and does not change application behavior.

Expected checks:
- GitHub accepts a commit on this non-production branch.
- Vercel detects the branch and creates a Preview deployment.
- The Preview build serves the current static homepage.
- Production remains unchanged until a reviewed merge to `main`.

Remove this file after the connection test if it is no longer useful.
