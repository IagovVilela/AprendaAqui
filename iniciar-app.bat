@echo off
chcp 65001 >nul
title Iniciar Aplicação - Aprenda Aqui

echo ========================================
echo   INICIANDO APLICAÇÃO
echo   Aprenda Aqui
echo ========================================
echo.

echo Verificando se Docker está rodando...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERRO: Docker não está rodando ou não está instalado!
    echo Por favor, inicie o Docker Desktop e tente novamente.
    pause
    exit /b 1
)

echo Docker está rodando.
echo.
echo Iniciando containers...
docker-compose up -d

if errorlevel 1 (
    echo.
    echo ERRO ao iniciar os containers!
    pause
    exit /b 1
)

echo.
echo Aguardando containers iniciarem...
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   APLICAÇÃO INICIADA COM SUCESSO!
echo ========================================
echo.
echo A aplicação está disponível em: http://localhost:8001
echo.
echo Pressione qualquer tecla para fechar...
pause >nul

