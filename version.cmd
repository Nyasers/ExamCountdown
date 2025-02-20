@echo off
set /p version=Input version:
git pull && npm version --allow-same-version --no-commit-hooks --no-git-tag-versio %version% && npm run postbuild && git add . && git commit && git tag -d %version% && git tag %version% && git push origin --tags && git push