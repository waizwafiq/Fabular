#!/bin/bash

# Check out the prod branch
git checkout prod

# Pull the latest changes from the remote
git pull origin prod

# Merge main into prod
git merge main

# Check for merge conflicts
if [ $? -ne 0 ]; then
    echo "Merge conflicts detected. Please resolve them manually."
    exit 1
fi

# Push the updated prod branch to the remote
git push origin prod

echo "Successfully merged main into prod and pushed the changes."

git checkout main

echo "Returned to main branch."
