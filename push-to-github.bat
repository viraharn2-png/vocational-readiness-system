@echo off
chcp 65001 > nul
echo ===================================================================
echo   ระบบนำโค้ดขึ้น GitHub (Vocational Work Readiness System - V-WRS)
echo ===================================================================
echo.

:: Refresh PATH to include Git
set "PATH=%PATH%;C:\Program Files\Git\bin;C:\Program Files\Git\cmd"

git --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ไม่พบ Git ในระบบ กรุณาติดตั้ง Git ก่อนดำเนินการ
    pause
    exit /b 1
)

echo [1/3] ตรวจสอบสถานะ Git ในโฟลเดอร์...
git status

echo.
set /p REPO_URL="กรุณากรอก URL ของ GitHub Repository ของคุณ (เช่น https://github.com/user/repo.git): "

if "%REPO_URL%"=="" (
    echo [!] ไม่ได้ระบุ URL ยกเลิกการทำงาน
    pause
    exit /b 1
)

echo.
echo [2/3] กำลังเชื่อมต่อไปยัง GitHub...
git remote remove origin > nul 2>&1
git remote add origin %REPO_URL%
git branch -M main

echo.
echo [3/3] กำลัง Push โค้ดขึ้น GitHub (main branch)...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================================
    echo   [สำเร็จ!] โค้ดถูกนำขึ้น GitHub เรียบร้อยแล้ว!
    echo   ขั้นตอนถัดไป: ไปที่ https://vercel.com/new แล้วเลือก Repo นี้เพื่อ Deploy ได้ทันที
    echo ===================================================================
) else (
    echo.
    echo [!] การ Push ไม่สำเร็จ กรุณาตรวจสอบสิทธิ์การเข้าถึง GitHub Personal Access Token หรือ SSH Key
)

echo.
pause
