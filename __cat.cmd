@ECHO OFF
:: Genera un file unico che contiene tutti i sorgenti del progetto
:: È incredibile ma a volte altre IA sono meglio di Jules
SETLOCAL EnableDelayedExpansion

REM --- Configurazione ---
SET "OutputFile=progetto_completo.txt"
SET "TextExtensions=.md .js .json .svg .cmd .txt .php .css .html .gitignore"
REM --------------------

REM Pulisce il file di output precedente, se esiste
IF EXIST "%OutputFile%" DEL "%OutputFile%"

ECHO Generazione del file unico: %OutputFile%
ECHO.

REM Scrive un'intestazione nel file di output
ECHO PROGETTO COMPLETO > "%OutputFile%"
ECHO Generato il: %date% %time% >> "%OutputFile%"
ECHO. >> "%OutputFile%"

REM Ciclo ricorsivo su tutti i file nella cartella e sottocartelle
FOR /R %%F IN (*.*) DO (
	REM Ottiene il percorso relativo del file
	SET "FullPath=%%F"
	SET "RelativePath=!FullPath:%CD%\=!"

	REM Controlla che il file non sia lo script stesso o il file di output
	IF /I "!RelativePath!" NEQ "%OutputFile%" (
		IF /I "!RelativePath!" NEQ "%~nx0" (
			
			ECHO ---------------------------------------------------------------------- >> "%OutputFile%"
			ECHO FILE: !RelativePath! >> "%OutputFile%"
			ECHO ---------------------------------------------------------------------- >> "%OutputFile%"
			ECHO. >> "%OutputFile%"

			REM Controlla se l'estensione è nella lista di quelle testuali
			SET "IsText=false"
			FOR %%E IN (%TextExtensions%) DO (
				IF /I "%%~xF"=="%%E" SET "IsText=true"
			)

			REM Se è un file di testo, ne scrive il contenuto. Altrimenti, scrive un placeholder.
			IF "!IsText!"=="true" (
				TYPE "%%F" >> "%OutputFile%"
			) ELSE (
				ECHO [File non testuale: %%~nxF] >> "%OutputFile%"
			)

			ECHO. >> "%OutputFile%"
			ECHO. >> "%OutputFile%"
		)
	)
)

REM Scrive la parola "Fine" al termine del file
ECHO Fine >> "%OutputFile%"

ECHO.
ECHO Fatto! Il riepilogo del progetto è stato salvato in: %OutputFile%
ENDLOCAL