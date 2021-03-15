@REM 이 소스를 쓰실경우 출처를 꼭 출력되도록 해 주세요!!
@REM @echo -----------------------------------
@REM @echo SPECTATE BY FOW.KR
@REM @echo -----------------------------------
@REM 처럼 넣어주시면 됩니다.

@echo -----------------------------------
@echo SPECTATE BY FOW.KR
@echo -----------------------------------
@echo off
@REM @echo 리그오브레전드 폴더를 검색하고 있습니다. 잠시만 기다리세요...
@REM @FOR /f "usebackq tokens=3,*" %%i in (`REG QUERY "HKLM" /v /s /f "LocalRootFolder" /e`) do (
@REM echo %%i %%j 조회중...
@REM if exist "%%i %%j" @cd /d "%%i %%j" &GOTO RUN
@REM )
@REM @FOR /f "usebackq tokens=3,*" %%i in (`REG QUERY "HKCU" /v /s /f "LocalRootFolder" /e`) do (
@REM echo %%i %%j 조회중...
@REM if exist "%%i %%j" @cd /d "%%i %%j" &GOTO RUN
@REM )
if exist "C:\Riot Games\League of Legends KR" @cd /d "C:\Riot Games\League of Legends KR" &GOTO RUN
if exist "D:\Riot Games\League of Legends KR" @cd /d "D:\Riot Games\League of Legends KR" &GOTO RUN
if exist "E:\Riot Games\League of Legends KR" @cd /d "E:\Riot Games\League of Legends KR" &GOTO RUN
if exist "F:\Riot Games\League of Legends KR" @cd /d "F:\Riot Games\League of Legends KR" &GOTO RUN
if exist "C:\Riot Games\League of Legends" @cd /d "C:\Riot Games\League of Legends" &GOTO RUN
if exist "D:\Riot Games\League of Legends" @cd /d "D:\Riot Games\League of Legends" &GOTO RUN
if exist "E:\Riot Games\League of Legends" @cd /d "E:\Riot Games\League of Legends" &GOTO RUN
if exist "F:\Riot Games\League of Legends" @cd /d "F:\Riot Games\League of Legends" &GOTO RUN
if exist "C:\Games\League of Legends KR" @cd /d "C:\Games\League of Legends KR" &GOTO RUN
if exist "D:\Games\League of Legends KR" @cd /d "D:\Games\League of Legends KR" &GOTO RUN
if exist "E:\Games\League of Legends KR" @cd /d "E:\Games\League of Legends KR" &GOTO RUN
if exist "F:\Games\League of Legends KR" @cd /d "F:\Games\League of Legends KR" &GOTO RUN
if exist "C:\Games\League of Legends" @cd /d "C:\Games\League of Legends" &GOTO RUN
if exist "D:\Games\League of Legends" @cd /d "D:\Games\League of Legends" &GOTO RUN
if exist "E:\Games\League of Legends" @cd /d "E:\Games\League of Legends" &GOTO RUN
if exist "F:\Games\League of Legends" @cd /d "F:\Games\League of Legends" &GOTO RUN
@FOR /f "usebackq skip=2 tokens=3,4,5,6,7,8,9" %%i in (`REG QUERY "HKLM\SOFTWARE\WOW6432Node\Riot Games\RADS" /v LocalRootFolder`) DO (
echo %%i %%j %%k %%l %%m ~ 시도중...
if exist "%%i %%j %%k %%l %%m %%n %%o" @echo OK &@cd /d "%%i %%j %%k %%l %%m %%n %%o" &cd .. &GOTO RUN
)
@FOR /f "usebackq skip=2 tokens=3,4,5,6,7,8,9" %%i in (`REG QUERY "HKLM\SOFTWARE\Riot Games\RADS" /v LocalRootFolder`) DO (
echo %%i %%j %%k %%l %%m ~ 시도중...
if exist "%%i %%j %%k %%l %%m %%n %%o" @echo OK&@cd /d "%%i %%j %%k %%l %%m %%n %%o" &cd .. &GOTO RUN
)
@FOR /f "usebackq skip=2 tokens=3,4,5,6,7,8,9" %%i in (`REG QUERY "HKCU\SOFTWARE\RIOT GAMES\RADS" /v "LocalRootFolder"`) DO (
echo %%i %%j %%k %%l %%m ~ 시도중...
if exist "%%i %%j %%k %%l %%m %%n %%o" @echo OK&@cd /d "%%i %%j %%k %%l %%m %%n %%o" &cd .. &GOTO RUN
)
@echo 리그오브레전드를 찾을 수 없습니다. 경로를 수동으로 설정해 보세요.
:RUN
if exist "Game" @cd "Game"
setlocal EnableDelayedExpansion
set locale=ko_kr
for /f "tokens=1,2,3,4* delims=: " %%i in ('findstr locale: ..\Config\LeagueClientSettings.yaml') do (
        set locale=%%j
        @echo "FOUND LOCALE 2 !locale!"
        goto LOCALE_OK
)
for /f "tokens=1,2,3,4* delims=: " %%i in ('findstr default_locale ..\system.yaml') do (
        set locale=%%j
        @echo "FOUND LOCALE 4 !locale!"
        goto LOCALE_OK
)
:LOCALE_OK
@echo "LOCALE SET: %locale%"
if exist "League of Legends.exe" (
    @start "" "League of Legends.exe" "spectator spectator.kr.lol.riotgames.com:80 encryptionKey gameId KR" "-UseRads" "-Locale=%locale%" "-GameBaseDir=.."
    goto :eof
    
)
@echo 감사합니다.
@pause
goto :eof
:eof
