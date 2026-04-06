@echo off
chcp 65001 >nul
title Gerenciador de Aplicação - Aprenda Aqui

:menu
cls
echo ========================================
echo   GERENCIADOR DE APLICAÇÃO
echo   Aprenda Aqui
echo ========================================
echo.
echo   1. Iniciar Aplicação
echo   2. Parar Aplicação
echo   3. Reiniciar Aplicação
echo   4. Ver Status
echo   5. Ver Logs
echo   6. Sair
echo.
set /p opcao="Escolha uma opção (1-6): "

if "%opcao%"=="1" goto iniciar
if "%opcao%"=="2" goto parar
if "%opcao%"=="3" goto reiniciar
if "%opcao%"=="4" goto status
if "%opcao%"=="5" goto logs
if "%opcao%"=="6" goto sair
goto menu

:iniciar
cls
echo ========================================
echo   INICIANDO APLICAÇÃO...
echo ========================================
echo.
echo Verificando se Docker está rodando...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERRO: Docker não está rodando ou não está instalado!
    echo Por favor, inicie o Docker Desktop e tente novamente.
    pause
    goto menu
)

echo Docker está rodando.
echo.
echo Iniciando containers...
docker-compose up -d

if errorlevel 1 (
    echo.
    echo ERRO ao iniciar os containers!
    pause
    goto menu
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
echo Pressione qualquer tecla para continuar...
pause >nul
goto menu

:parar
cls
echo ========================================
echo   PARANDO APLICAÇÃO...
echo ========================================
echo.
echo Parando containers...
docker-compose down

if errorlevel 1 (
    echo.
    echo ERRO ao parar os containers!
    pause
    goto menu
)

echo.
echo ========================================
echo   APLICAÇÃO PARADA COM SUCESSO!
echo ========================================
echo.
echo Todos os containers foram parados e removidos.
echo.
echo Pressione qualquer tecla para continuar...
pause >nul
goto menu

:reiniciar
cls
echo ========================================
echo   REINICIANDO APLICAÇÃO...
echo ========================================
echo.
echo Parando containers...
docker-compose down
echo.
echo Iniciando containers novamente...
docker-compose up -d

if errorlevel 1 (
    echo.
    echo ERRO ao reiniciar os containers!
    pause
    goto menu
)

echo.
echo Aguardando containers iniciarem...
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   APLICAÇÃO REINICIADA COM SUCESSO!
echo ========================================
echo.
echo A aplicação está disponível em: http://localhost:8001
echo.
echo Pressione qualquer tecla para continuar...
pause >nul
goto menu

:status
cls
echo ========================================
echo   STATUS DOS CONTAINERS
echo ========================================
echo.
docker-compose ps
echo.
echo ========================================
echo.
echo Pressione qualquer tecla para continuar...
pause >nul
goto menu

:logs
cls
echo ========================================
echo   LOGS DA APLICAÇÃO
echo ========================================
echo.
echo Pressione Ctrl+C para sair dos logs
echo.
timeout /t 2 /nobreak >nul
docker-compose logs -f
goto menu

:sair
cls
echo.
echo Encerrando...
echo.
exit

