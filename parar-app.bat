@echo off
chcp 65001 >nul
title Parar Aplicação - Aprenda Aqui

echo ========================================
echo   PARANDO APLICAÇÃO
echo   Aprenda Aqui
echo ========================================
echo.

echo Parando containers...
docker-compose down

if errorlevel 1 (
    echo.
    echo ERRO ao parar os containers!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   APLICAÇÃO PARADA COM SUCESSO!
echo ========================================
echo.
echo Todos os containers foram parados e removidos.
echo.
echo Pressione qualquer tecla para fechar...
pause >nul

