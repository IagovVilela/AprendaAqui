@echo off
chcp 65001 >nul
title Gerenciador Automático - Aprenda Aqui

echo ========================================
echo   GERENCIADOR AUTOMÁTICO
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

echo Verificando status dos containers...
docker-compose ps | findstr "Up" >nul 2>&1

if errorlevel 1 (
    echo.
    echo Containers estão PARADOS.
    echo Iniciando aplicação...
    echo.
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
) else (
    echo.
    echo Containers estão RODANDO.
    echo Parando aplicação...
    echo.
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
)

echo Pressione qualquer tecla para fechar...
pause >nul

