powershell "$t='$ec_temp.zip';Invoke-WebRequest -Uri https://ec.nyaser.tk/zip -OutFile $t;Expand-Archive -Path $t -DestinationPath %~dp0..\..\..\..\.. -Force;Remove-Item $t"||cmd/k