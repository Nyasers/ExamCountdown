@echo off
set /p version=Input version:
git add .
npm version --no-commit-hooks --no-git-tag-version %version%
npm run postbuild
git add .
git commit -m %version%
git pull
git push
git tag -d v%version%
git tag v%version%
git push origin --tags