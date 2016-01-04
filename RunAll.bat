@setlocal enableextensions
@cd /d "%~dp0"
taskkill /F /IM chrome.exe
start "MongoDB Server" cmd /K C:\"Program Files"\MongoDB\Server\3.2\bin\mongod.exe
timeout 2
start "NodeJS ADS Server" /I cmd /K "C:\Program Files\nodejs\node.exe" %CD%\server.js
timeout 2
start chrome.exe --allow-file-access-from-files http://127.0.0.1:8080/#/display/2
pause
