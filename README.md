# Cx Finance

> A modern and intuitive platform for personal finance management, goals tracking, and financial report analysis.

---

## 🚀 About the Project

**Cx Finance** is a web application designed to simplify personal financial management. Featuring a clean, responsive interface focused on user experience (UX), the platform allows users to log income and expenses, track progress toward short-, medium-, and long-term goals, and generate detailed cash flow reports.

---

## 🛠️ Tech Stack

### **Frontend**
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
![Bootstrap Icons](https://img.shields.io/badge/Bootstrap_Icons-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

### **Backend & Database**
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

## 📋 Features Implemented

### 🔐 **Authentication & Dynamic Validation**
* Responsive Login and Registration forms styled with Bootstrap 5.
* Real-time validation (`input` event) using Regex for strong passwords.
* Dynamic comparison between password and password confirmation fields.
* Terms of Service checkbox validation.
* Reactive enable/disable state for the submit button with visual feedback (`.is-valid` / `.is-invalid`).

### 📊 **Dashboard (Overview)**
* Structured layout with a dark fixed Sidebar and a user Topbar.
* Financial summary cards (Total Balance, Income, Expenses) highlighted with colored side borders (`border-start border-4`).
* Dedicated area reserved for interactive flow and category charts.

### 💰 **Finances Management (`finances.html`)**
* Interactive transaction list with category badges (Work, Food, Housing, etc.).
* Dynamic view switching via **jQuery** between the **Transaction Table** and the **New Record Form** using `.toggleClass('d-none')`.
* Form with custom type selector (*Income* or *Expense*), amount, date, category, and description.
* Period filters (This month, This year, All period) and search functionality.

### 🎯 **Goals Management (`goals.html`)**
* Visual tracking of goals categorized by timeframe (Short, Medium, and Long Term).
* Dynamic progress bars (`.progress-bar`) calculating the target percentage achieved.
* Action button for individual goal management.

### 📈 **Financial Reports (`reports.html`)**
* Configurable time filters for historical analysis.
* Key performance indicator cards with colored borders highlighting Total Income, Total Expenses, and Period Balance.
* Ready-to-use action for exporting reports in PDF format.

---

## 📁 Project Structure

```text
cx-finance/
├── css/
│   └── global.css          # Custom global styles
├── images/                 # Logos and vector/image icons
├── wireframes/             # Figma wireframes for the project
├── js/
│   ├── signup.js           # Validation for the registration form
│   └── finances.js         # jQuery logic for view toggling and DOM actions
│   └── index.js            # Personalized passoword validation
├── index.html              # Login / Authentication page
├── signup.html             # Signup / Registration page
├── dashboard.html          # User overview and metrics page
├── finances.html           # Income/expense management and new record view
├── goals.html              # Financial goals tracking
├── reports.html            # Report analysis and export
└── README.md
