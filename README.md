<div align="center">

# 🏪 Asha Hardware Billing System

Full-stack, production-ready billing and inventory for hardware, plumbing, and electrical retail. One click to start, blazing fast at the counter, and gorgeous A5 PDFs your customers will trust.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=fff)](https://adoptium.net/) [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot&logoColor=fff)](https://spring.io/projects/spring-boot) [![React](https://img.shields.io/badge/React-19-00D8FF?logo=react&logoColor=fff)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=fff)](https://vitejs.dev/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/) [![MySQL](https://img.shields.io/badge/MySQL-8+-4479A1?logo=mysql&logoColor=fff)](https://www.mysql.com/)

<p>
   <a href="#-why-this-build">Why this build</a> •
   <a href="#-live-quickstart">Live Quickstart</a> •
   <a href="#-stack">Stack</a> •
   <a href="#-backend">Backend</a> •
   <a href="#-frontend">Frontend</a> •
   <a href="#-ops">Ops</a>
</p>

</div>

---

## ✨ Why this build

- Cashier-first flows: search by Product ID, tap-to-cart, GST slider, and Estimation vs Tax Invoice in one click.
- Inventory certainty: duplicate-safe Product IDs, add-or-increment stock, low-stock flags, and quick refresh.
- Trustworthy PDFs: branded A5 Estimation/Tax Invoice with shop header, policies, and crisp totals via jsPDF.
- Secure core: Spring Security + JWT, BCrypt hashing, role-based routes, Axios auth interceptor.
- One-click ops: provided start/stop scripts for Windows; browser auto-opens to login.

---

## ⚡ Live Quickstart (Windows)

1) Double-click `START_BILLING_SYSTEM.bat` (or `START_BILLING_SYSTEM_SILENT.vbs` for quiet start).
2) Browser opens to login. Use demo creds: `cashier1` / `test123` (admin: `admin1` / `test123`).
3) To stop, double-click `STOP_BILLING_SYSTEM.bat` (or close the opened terminals).

---

## 🛠 Prereqs

- MySQL 8+
- JDK 21
- Node.js 18+
- Chrome/Edge (for auto-open)

---

## 🗂 Project map

```
backend/            # Spring Boot API (auth, items, bills, customers, reports)
cashier-frontend/   # React + Vite UI for billing, inventory, reports
demo/               # Assets / demos (if any)
START_BILLING_SYSTEM.bat
START_BILLING_SYSTEM_SILENT.vbs
STOP_BILLING_SYSTEM.bat
```

---

## 🧭 Install (once)

### 1) Database
```bash
mysql -u root -p
CREATE DATABASE billing_system;
# Optional seed (items, bills, transactions):
mysql -u root -p billing_system < backend/TEST_DATA.sql
```

### 2) Backend config
Set DB creds in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/billing_system
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

### 3) Frontend deps
```bash
cd cashier-frontend
npm install
```

---

## 🚀 Run manually (dev)

Backend (port 9090):
```bash
cd backend
mvn spring-boot:run
```

Frontend (port 5173):
```bash
cd cashier-frontend
npm run dev
```

Login at http://localhost:5173 (or auto-open via start scripts).

---

## 🛡 Backend

- Spring Boot REST API with JWT auth, BCrypt passwords, and role-based access.
- Modules: items, categories, customers, bills (sales), refunds, reports.
- Key endpoints (default base `http://localhost:9090/api`):
   - Auth: `POST /auth/login`
   - Items: `GET/POST/PUT/DELETE /items`, `GET /items/by-custom/{id}`, `GET /items/low-stock`, `PATCH /items/{id}/stock`.
   - Bills: `POST /bills`, `POST /bills/from-cart`, `GET /bills`, `GET /bills/date-range`, `POST /bills/{id}/refund`, `POST /bills/{billId}/refund-items`.
   - Customers: `GET/POST/PUT/DELETE /customers`, `GET /customers/search`, `GET /customers/phone/{phone}`.
- Build: `mvn clean package` → jar in `backend/target`.

---

## 💻 Frontend

- React 19 + Vite 7, Tailwind 4, React Router 7, Chart.js 4, jsPDF.
- Auth-aware routes; token stored in `localStorage` and sent via Axios interceptor.
- Modules: Login, Dashboard shell, Sales/Billing, Inventory, Reports, Custom Reports.
- PDF generation: A5 Estimation and Tax Invoice branding in [cashier-frontend/src/pages/SalesPage.jsx](cashier-frontend/src/pages/SalesPage.jsx).
- API base: set in [cashier-frontend/src/api/api.js](cashier-frontend/src/api/api.js) (`API_BASE_URL`).

---

## 🎯 Cashier flow (happy path)

- Login → Dashboard tab: Sales/Billing.
- Search by Product ID → add to cart → adjust qty → set GST → add customer (optional).
- Click **Estimation** or **Tax Invoice** → branded A5 PDF auto-downloads.

Inventory flow: add Product ID → auto-detect existing → increment stock or create new; edit/delete with confirmations; low-stock badges visible.

---

## ✅ Pre-ship checklist

- Database reachable; `application.properties` points to correct DB.
- Backend running on 9090; frontend points `API_BASE_URL` accordingly.
- Can login with demo creds and generate both PDF types.
- `npm run build` (frontend) + `mvn clean package` (backend) complete without errors.

---

## 🤝 Contribute / fork

- Fork, wire your DB, adjust branding text inside PDF templates, and open PRs by feature (UI/UX, data, or PDF polish).
1. Download: http://www.f2ko.de/en/b2e.php
2. Open the program
3. Load `START_BILLING_SYSTEM.bat`
4. Configure:
   - Set title: "ASHA Hardware Billing System"
   - Choose icon (create or download .ico file)
   - Select "Visible application"
5. Click "Compile"
6. Save as `ASHA_Billing_System.exe`

### Method 2: IExpress (Built into Windows)
1. Press Win + R, type `iexpress`
2. Select "Create new Self Extraction Directive file"
3. Choose "Extract files and run an installation command"
4. Add `START_BILLING_SYSTEM.bat`
5. Set command to run: `START_BILLING_SYSTEM.bat`
6. Configure title and prompts
7. Save package as `ASHA_Billing_System.exe`

### Create Desktop Shortcut
1. Right-click the .bat or .exe file
2. Select "Create shortcut"
3. Right-click shortcut → Properties
4. Click "Change Icon" to customize
5. Move to Desktop

---

## 📚 Documentation

- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Complete installation instructions
- **[TEST_DATA.sql](backend/TEST_DATA.sql)** - Sample data with 60 items, 60 bills, 200+ transactions

### Default Test Users
| Username | Password | Role |
| :--- | :--- | :--- |
| admin1 | test123 | ADMIN |
| cashier1 | test123 | CASHIER |
| cashier2 | test123 | CASHIER |
| cashier3 | test123 | CASHIER |
| cashier4 | test123 | CASHIER |

---

## 🚀 Getting Started

### Prerequisites
- Java 11 or higher
- Maven 3.6.3 or higher
- MySQL 8.0 or PostgreSQL 13+
- Your favorite IDE (IntelliJ IDEA, Eclipse, or VS Code)

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd Billing-Software
   ```

2. **Configure Database**
   - Create a new database in MySQL/PostgreSQL
   - Update `src/main/resources/application.properties` with your database credentials

3. **Build and Run**
   ```bash
   # Build the project
   mvn clean install
   
   # Run the application
   mvn spring-boot:run
   ```

4. **Access the Application**
   - Open `http://localhost:8080` in your browser
   - Default admin credentials: admin/admin

---

## 📝 API Documentation

API documentation is available at `http://localhost:8080/swagger-ui.html` when running in development mode.

### Available Endpoints
- `GET /api/v1/products` - List all products
- `POST /api/v1/products` - Create a new product
- `GET /api/v1/invoices` - List all invoices
- `POST /api/v1/invoices` - Create a new invoice
- `GET /api/v1/users` - List all users (Admin only)

---

## 🧪 Testing

Run the test suite with:
```bash
mvn test
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

Your Name - [your.email@example.com](mailto:your.email@example.com)

Project Link: [https://github.com/yourusername/billing-software](https://github.com/yourusername/billing-software)

---

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Bootstrap](https://getbootstrap.com/)
- [Thymeleaf](https://www.thymeleaf.org/)
- [Hibernate](https://hibernate.org/)
