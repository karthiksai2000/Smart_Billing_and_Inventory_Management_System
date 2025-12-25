
<div align="center">

# 🏪 Asha Hardware Billing System  
### Enterprise-Grade POS & Inventory Platform

<strong>Production-ready billing and inventory software for hardware, plumbing, and electrical retail.</strong><br/>
Built for real counters, real cashiers, real invoices — not demos.

<br/>

![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=fff)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot&logoColor=fff)
![React](https://img.shields.io/badge/React-19-00D8FF?logo=react&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=fff)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwindcss&logoColor=fff)
![MySQL](https://img.shields.io/badge/MySQL-8+-4479A1?logo=mysql&logoColor=fff)

<p>
  <a href="#-why-this-project">Why this project</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-features">Features</a> 
  <a href="#-quickstart-windows">Quickstart</a> •
  <a href="#-backend">Backend</a> •
  <a href="#-frontend">Frontend</a>
</p>

</div>

---

## 👀 Why This Project Matters (Recruiter View)

Most student billing systems stop at CRUD.

This one demonstrates:
- **Role-based workflows (Admin / Cashier)**
- **Inventory correctness under real constraints**
- **Secure authentication (JWT + BCrypt)**
- **Professional invoice generation (A5 PDFs)**
- **Clean, scalable backend architecture**

This project shows **system thinking**, not tutorial-following.

---

## 🧠 Real-World Problem Solved

Small hardware stores typically rely on:
- Manual billing
- Excel stock tracking
- Inconsistent invoices

This system replaces that with:
- Fast counter-side billing
- Accurate inventory updates
- Branded, trustworthy invoices

Designed for **daily shop usage**, not screenshots.

---

## 🏗 Architecture

```

React (Vite + Tailwind)
↓
REST Controllers (Spring Boot)
↓
Service Layer (Business Logic)
↓
Repository Layer (JPA / Hibernate)
↓
MySQL Database

```

✔ Layered MVC architecture  
✔ Separation of concerns  
✔ Easy to extend (multi-branch ready)

---

## ✨ Key Features

### Billing & Sales
- Product ID–based fast search
- Cart-based billing flow
- GST slider
- Estimation vs Tax Invoice
- One-click A5 PDF download

### Inventory
- Duplicate-safe Product IDs
- Add-or-increment stock
- Low-stock indicators
- Edit/delete with confirmations

### Security
- Spring Security + JWT
- BCrypt password hashing
- Role-based route protection
- Axios auth interceptor

---

## 🔐 User Roles

### 👑 Admin
- User & role management
- Product & category control
- Inventory adjustment
- Invoice access & edits
- Full system visibility

### 💼 Cashier
- Sales & billing
- Customer lookup
- Invoice generation
- Restricted, safe access

---

## ⚡ Quickstart (Windows – One Click)

1. Double-click `START_BILLING_SYSTEM.bat`  
   *(or `START_BILLING_SYSTEM_SILENT.vbs` for silent start)*  
2. Browser auto-opens to login  
3. Demo credentials:
   - `admin1 / test123`
   - `cashier1 / test123`
4. Stop with `STOP_BILLING_SYSTEM.bat`

Zero setup friction.

---

## 🛠 Prerequisites

- JDK 21
- MySQL 8+
- Node.js 18+
- Maven 3.6+

---

## 🗂 Project Structure

```

backend/              # Spring Boot API
cashier-frontend/     # React + Vite UI
demo/                 # Demo assets
START_BILLING_SYSTEM.bat
STOP_BILLING_SYSTEM.bat

````

Readable > clever.

---

## 🧭 Installation (Once)

### Database
```sql
CREATE DATABASE billing_system;
````

(Optional seed)

```bash
mysql -u root -p billing_system < backend/TEST_DATA.sql
```

### Backend config

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/billing_system
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```

### Frontend deps

```bash
cd cashier-frontend
npm install
```

---

## 🚀 Run (Dev Mode)

Backend (9090):

```bash
cd backend
mvn spring-boot:run
```

Frontend (5173):

```bash
cd cashier-frontend
npm run dev
```

---

## 🛡 Backend Details

* Spring Boot REST API
* JWT authentication
* Role-based authorization
* Modules: items, categories, customers, bills, refunds, reports

**Sample endpoints**

```
POST   /auth/login
GET    /items
PATCH  /items/{id}/stock
POST   /bills
GET    /bills/date-range
```

Build:

```bash
mvn clean package
```

---

## 💻 Frontend Details

* React 19 + Vite 7
* Tailwind CSS 4
* React Router 7
* Chart.js
* jsPDF for invoice generation

PDF logic:

```
cashier-frontend/src/pages/SalesPage.jsx
```

---

## 🎯 Cashier Flow (Happy Path)

Login → Sales
Search Product → Add to cart
Adjust qty → Set GST
Generate **Estimation** or **Tax Invoice**
→ A5 PDF downloads instantly

---

## 📚 Documentation

* `INSTALLATION_GUIDE.md`
* `TEST_DATA.sql` (60 items, 60 bills, 200+ transactions)

### Default Users

| Username | Password | Role    |
| -------- | -------- | ------- |
| admin1   | test123  | ADMIN   |
| cashier1 | test123  | CASHIER |

---

## 🧑‍💻 What This Project Proves

* Backend architecture skills
* Real-world business understanding
* Secure system design
* Production-oriented thinking

This is **interview-safe** and **discussion-heavy**.

---

## 🛣 Roadmap

* Multi-branch support
* Analytics dashboard
* Barcode scanning
* Cloud deployment

---

## 📄 License

MIT License.

---

## ⭐ Final Note

If you’re a recruiter:

> This project shows how I design and own real systems.

If you’re a developer:

> Fork it. Break it. Improve it.

⭐ Star the repo if it helped you learn something real.

