@setlocal enableextensions
@cd /d "%~dp0"
taskkill /F /IM chrome.exe
start "MongoDB Server" cmd /K C:\"Program Files"\MongoDB\Server\3.2\bin\mongod.exe
timeout 2
start "NodeJS ADS Server" /I cmd /K "C:\Program Files\nodejs\node.exe" %CD%\server.js
timeout 3
start "import rows" /I cmd /K start "import rows" /I cmd /K "C:\Program Files\MongoDB\Server\3.2\bin\mongoimport.exe" --db test --collection ads --drop --jsonArray --file %CD%\data.json
timeout 2
start chrome.exe --allow-file-access-from-files http://127.0.0.1:80/#/display/1
pause
