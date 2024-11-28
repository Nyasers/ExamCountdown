@echo off
npm version %1
git push origin --tags
