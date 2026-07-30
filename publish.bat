@echo off
REM ================================================================
REM  publish.bat  -  check, then push sudoanthony.github.io
REM ----------------------------------------------------------------
REM  Usage:   publish.bat
REM           publish.bat Add Hammer writeup
REM
REM  Runs check-site.js first. If it finds ERRORS, nothing is pushed.
REM  Warnings do not block (an unpublished box is a warning, not a bug).
REM ================================================================
setlocal
cd /d "%~dp0"

REM If launched by double-click, keep the window open at the end so the
REM checker output is readable. Run from a terminal and it won't pause.
set "DBLCLICK="
echo %cmdcmdline% | find /i "%~nx0" >nul 2>nul && set "DBLCLICK=1"

where git >nul 2>nul
if errorlevel 1 (
  echo [x] git is not installed, or not on PATH.
  echo     Get it from https://git-scm.com/download/win
  goto die
)

where node >nul 2>nul
if errorlevel 1 (
  echo [x] node is not installed, or not on PATH.
  echo     Get it from https://nodejs.org
  goto die
)

if not exist ".git" (
  echo [x] This folder is not a git repo yet.
  echo     Run the one-time setup first ^(git init / remote add / fetch^).
  goto die
)

echo.
echo === Pre-publish checks ===
node check-site.js
if errorlevel 1 (
  echo.
  echo [x] Checks FAILED. Nothing was pushed.
  echo     Fix the errors above, then run publish.bat again.
  goto die
)

echo === Staging changes ===
git add -A
if errorlevel 1 goto die

REM `git diff --cached --quiet` exits 1 when something IS staged.
git diff --cached --quiet
if not errorlevel 1 (
  echo Nothing to commit - working tree matches the last commit.
  exit /b 0
)

git status --short
echo.

set "MSG=%*"
if "%MSG%"=="" set "MSG=Update site"

echo === Committing: %MSG% ===
git commit -m "%MSG%"
if errorlevel 1 goto die

echo === Pushing to origin/main ===
git push origin main
if errorlevel 1 (
  echo.
  echo [x] Push failed. If someone ^(or the GitHub web UI^) changed the repo
  echo     since your last pull, run:  git pull --rebase origin main
  goto die
)

echo.
echo [ok] Published. Hard-refresh the site in a minute or two.
if defined DBLCLICK pause
endlocal
exit /b 0

:die
echo.
if defined DBLCLICK pause
exit /b 1
