@echo off
set /p version=Input version:
git add .
npm version --allow-same-version --no-commit-hooks --no-git-tag-version %version%
npm run postbuild
git add .
git commit
git tag -d v%version%
git tag v%version%
git push origin --tags
git pull
git push