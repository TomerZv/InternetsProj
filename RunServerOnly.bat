@setlocal enableextensions
@cd /d "%~dp0"
start "MongoDB Server" cmd /K "C:\Program Files\MongoDB\Server\3.0\bin\mongod.exe"
timeout 2
start "NodeJS ADS Server" /I cmd /K "C:\Program Files\nodejs\node.exe" %CD%\server.js
pause
