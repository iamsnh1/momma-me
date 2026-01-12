#!/bin/bash
# Script to push code to GitHub

echo "🚀 Pushing to GitHub..."
echo ""

# Check if remote exists
if git remote get-url origin &>/dev/null; then
    echo "✅ Remote 'origin' already exists"
    git remote -v
    echo ""
    read -p "Do you want to push to existing remote? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push -u origin main
        echo "✅ Code pushed to GitHub!"
    else
        echo "Please provide your GitHub repository URL"
    fi
else
    echo "📝 Please provide your GitHub repository URL"
    echo "Example: https://github.com/username/repo-name.git"
    read -p "GitHub URL: " GITHUB_URL
    
    if [ -z "$GITHUB_URL" ]; then
        echo "❌ No URL provided. Exiting."
        exit 1
    fi
    
    echo ""
    echo "Adding remote..."
    git remote add origin "$GITHUB_URL"
    
    echo "Pushing to GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed to GitHub!"
        echo "Repository: $GITHUB_URL"
    else
        echo "❌ Push failed. Please check:"
        echo "1. Repository exists on GitHub"
        echo "2. You have access to the repository"
        echo "3. GitHub credentials are configured"
    fi
fi

