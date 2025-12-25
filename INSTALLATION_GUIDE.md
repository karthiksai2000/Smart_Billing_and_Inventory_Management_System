# ASHA Hardware Billing System - Installation Guide

## 📋 System Requirements

- **Operating System**: Windows 10/11
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 2GB free space
- **Internet**: Required for initial installation only

---

## 🔧 Software Installation (One-Time Setup)

### 1. **MySQL Database** (Required)
**Download**: https://dev.mysql.com/downloads/mysql/
- Install MySQL Server 8.0 or higher
- During installation:
  - Set root password (remember this!)
  - Enable "Start MySQL Server at System Startup"
  - Default port: 3306 (don't change)

**After Installation**:
1. Open MySQL Workbench or Command Line
2. Create database:
   ```sql
   CREATE DATABASE billing_system;
   ```
3. Run test data script:
   ```bash
   mysql -u root -p billing_system < backend/TEST_DATA.sql
   ```

---

### 2. **Java Development Kit (JDK 21)** (Required)
**Download**: https://adoptium.net/temurin/releases/?version=21
- Download "Windows x64 JDK .msi installer"
- Install with default settings
- **Important**: Check "Add to PATH" during installation
- Verify: Open CMD and run `java -version`

---

### 3. **Node.js** (Required)
**Download**: https://nodejs.org/
- Download LTS version (v20.x or higher)
- Install with default settings
- Verify: Open CMD and run:
  ```bash
  node -v
  npm -v
  ```

---

### 4. **Google Chrome** (Required for auto-open)
**Download**: https://www.google.com/chrome/
- Install if not already present
- Set as default browser (optional)

---

## ⚙️ Project Configuration

### Backend Configuration
1. Open `backend/src/main/resources/application.properties`
2. Update MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/billing_system
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

### Frontend Installation (One-Time)
1. Open Command Prompt
2. Navigate to frontend folder:
   ```bash
   cd "C:\path\to\Billing Software\cashier-frontend"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

---

## 🚀 Running the System

### **Option 1: One-Click Startup (Recommended)**
Double-click: **`START_BILLING_SYSTEM.bat`**

This will:
- ✅ Check MySQL is running
- ✅ Start Backend server (port 8080)
- ✅ Start Frontend application (port 5173)
- ✅ Open Chrome browser automatically
- ✅ Show login page

**Login Credentials**:
- Username: `cashier1`
- Password: `test123`

---

### **Option 2: Silent Startup (No Command Windows)**
Double-click: **`START_BILLING_SYSTEM_SILENT.vbs`**

This runs everything in the background with popup notifications.

---

### **Stopping the System**
Double-click: **`STOP_BILLING_SYSTEM.bat`**

Or simply close the command windows opened by the startup script.

---

## 🔐 Creating Desktop Shortcut

### For .BAT File:
1. Right-click `START_BILLING_SYSTEM.bat`
2. Select "Create shortcut"
3. Right-click the shortcut → Properties
4. Click "Change Icon" → Browse to an icon file
5. Move shortcut to Desktop

### For .VBS File (Silent Mode):
1. Right-click `START_BILLING_SYSTEM_SILENT.vbs`
2. Select "Create shortcut"
3. Right-click the shortcut → Properties
4. Click "Change Icon"
5. Move shortcut to Desktop

---

## 🎯 Converting to EXE (Optional)

### Using Bat To Exe Converter:
1. Download: http://www.f2ko.de/en/b2e.php
2. Install and open the program
3. Load `START_BILLING_SYSTEM.bat`
4. Configure:
   - Application Title: "ASHA Hardware Billing System"
   - Version Info: Add your details
   - Icon: Select custom icon
   - Visibility: "Visible"
5. Click "Compile" → Save as `ASHA_Billing.exe`

### Alternative: Using Advanced BAT to EXE Converter:
1. Download: https://www.battoexeconverter.com/
2. Follow similar steps

**Note**: Windows Defender may flag converted EXE files. Add exception if needed.

---

## 📱 Access Points

Once started, access the system at:

- **Customer Interface**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Database**: MySQL Workbench → localhost:3306/billing_system

---

## 🔧 Troubleshooting

### "MySQL service is not running"
**Solution**:
1. Open Services (Win + R → `services.msc`)
2. Find "MySQL80" service
3. Right-click → Start
4. Set Startup type to "Automatic"

### "Port 8080 already in use"
**Solution**:
1. Close any other Java applications
2. Run `STOP_BILLING_SYSTEM.bat`
3. Restart the system

### "Port 5173 already in use"
**Solution**:
1. Open Task Manager (Ctrl + Shift + Esc)
2. End all "Node.js" processes
3. Restart the system

### "Backend won't start"
**Solution**:
1. Check `application.properties` has correct MySQL password
2. Verify MySQL is running
3. Check Java is installed: `java -version`

### "Frontend shows blank page"
**Solution**:
1. Clear browser cache (Ctrl + Shift + Delete)
2. Check if backend is running (http://localhost:8080)
3. Reinstall frontend: Delete `node_modules` → run `npm install`

---

## 📞 Support

For issues or questions, check:
- README.md in project folder
- Log files in backend/logs/ folder
- Browser console (F12) for frontend errors

---

## 🎓 Training Resources

### For Cashiers:
1. Login with credentials
2. Search products by ID in search box
3. Add items to cart using "Add" button
4. Adjust quantities with +/- buttons
5. Fill customer details (optional)
6. Click "Estimation" for quotation or "Tax Invoice" for final bill
7. PDF downloads automatically

### For Admins:
1. Login as admin (username: `admin1`, password: `test123`)
2. Access inventory management
3. View sales reports
4. Manage users and categories

---

## 🔄 Updates

To update the system:
1. Stop the system: Run `STOP_BILLING_SYSTEM.bat`
2. Replace old files with new version
3. Run database migrations if needed
4. Restart: Run `START_BILLING_SYSTEM.bat`

---

## ✅ System Status Check

Everything is working if you see:
- ✅ MySQL service running (green in Services)
- ✅ Backend window shows "Started demoApplication"
- ✅ Frontend window shows "VITE ready"
- ✅ Chrome opens to login page
- ✅ Can login with cashier1/test123

---

**ASHA Hardware Billing System v1.0**
*Professional billing solution for hardware stores*
