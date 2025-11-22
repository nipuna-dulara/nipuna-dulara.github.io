#!/bin/bash

# Build the project
npm run build

# Copy dist contents to root (for GitHub Pages)
cp dist/index.html .
cp -r dist/assets .

# Add and commit
git add index.html assets/
git commit -m "Deploy: Update built files"
git push

echo "✅ Deployment complete!"
