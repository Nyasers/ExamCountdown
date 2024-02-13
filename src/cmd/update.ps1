$ErrorActionPreference = 'Stop';
$TempFile = (New-Guid).toString() + '.zip';
Invoke-WebRequest -Uri https://ec.nyaser.top/update.zip -OutFile $TempFile;
Expand-Archive -Path $TempFile -DestinationPath . -Force;
Remove-Item $TempFile;