' =====================================================
' ASHA HARDWARE BILLING SYSTEM - SILENT STARTUP (No CMD Windows)
' =====================================================
' This VBS script starts the system without showing command windows

Set WshShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Get the current directory
currentDir = objFSO.GetParentFolderName(WScript.ScriptFullName)

' Show startup message
WshShell.Popup "Starting ASHA Hardware Billing System..." & vbCrLf & vbCrLf & _
               "Backend: Starting..." & vbCrLf & _
               "Frontend: Starting..." & vbCrLf & vbCrLf & _
               "Browser will open automatically.", 5, "ASHA Hardware", 64

' Start Backend (hidden)
WshShell.Run "cmd /c cd /d """ & currentDir & "\backend"" && start /min cmd /c mvnw.cmd spring-boot:run", 0, False

' Wait for backend (30 seconds)
WScript.Sleep 30000

' Start Frontend (hidden)
WshShell.Run "cmd /c cd /d """ & currentDir & "\cashier-frontend"" && start /min cmd /c npm run dev", 0, False

' Wait for frontend (10 seconds)
WScript.Sleep 10000

' Open Chrome
WshShell.Run "chrome http://localhost:5173", 1, False

' Show ready message
WshShell.Popup "BILLING SYSTEM IS READY!" & vbCrLf & vbCrLf & _
               "Frontend: http://localhost:5173" & vbCrLf & _
               "Backend: http://localhost:8080" & vbCrLf & vbCrLf & _
               "Login: cashier1 / test123", 10, "ASHA Hardware - Ready", 64
