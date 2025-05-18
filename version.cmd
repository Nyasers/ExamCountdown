@echo off
set /p version=Input version:
git add .
powershell -c npm version --allow-same-version --no-commit-hooks --no-git-tag-version %version%; npm run postbuild; git add .; git commit -m %version%; git tag v%version%
git push origin --tags