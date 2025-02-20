@echo off
set /p version=Input version:
git pull && npm version --allow-same-version --no-commit-hooks --no-git-tag-versio %version% && npm run postbuild && git add . && git commit && git tag -d v%version% && git tag v%version% && git push origin --tags && git push
