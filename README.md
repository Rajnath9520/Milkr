# 🥛 Milkr - Complete Milk Delivery Management System

> A beautiful, modern, and full-featured milk delivery management platform built with React, Node.js, Express, and MongoDB.

[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-brightgreen)](https://mongodb.com)

![Login](<Screenshot 2026-02-12 132705.png>)
![Dashboard](<Screenshot 2026-02-12 132511.png>)
![Delivery](<Screenshot 2026-02-12 132543.png>)
![Billing](<Screenshot 2026-02-12 132602.png>)

## 🌟 Features

### 🎯 Core Features
- **Customer Management** - Add, edit, delete, and organize customers
- **Delivery Tracking** - Daily milk delivery records with status management
- **Billing System** - Automated billing, invoices, and payment tracking
- **Analytics Dashboard** - Real-time insights and performance metrics
- **User Authentication** - Secure JWT-based authentication with role management
- **Area-wise Organization** - Manage deliveries by locality/area
- **Mobile Responsive** - Beautiful UI that works on all devices

### ✨ Advanced Features
- **Bulk Operations** - Create delivery records for all customers at once
- **Payment Tracking** - Track paid and pending payments
- **Performance Analytics** - Staff performance and delivery metrics
- **Customer Retention** - Track customer engagement and churn
- **Revenue Forecasting** - Predict future revenue based on historical data
- **Invoice Generation** - Professional PDF invoices
- **Real-time Notifications** - Toast notifications for all actions
- **Search & Filter** - Powerful search across customers and records

## 🎨 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x450/3B82F6/ffffff?text=Dashboard+View)

### Customer Management
![Customers](https://via.placeholder.com/800x450/06B6D4/ffffff?text=Customer+Management)

### Analytics
![Analytics](https://via.placeholder.com/800x450/10B981/ffffff?text=Analytics+Dashboard)

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Router** - Navigation
- **Date-fns** - Date utilities

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin support

## 📁 Project Structure

```
milkr/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Helper functions
│   │   └── context/       # React context
│   └── package.json
│
├── backend/               # Node.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── server.js         # Entry point
│   └── package.json
│
└── docs/                 # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB 5.0+
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/Rajnath9520/milkr.git
cd milkr
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/milkr
JWT_SECRET=your_super_secret_key_change_this
CORS_ORIGIN=http://localhost:5173
EOL

# Start backend
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cat > .env << EOL
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Milkr
VITE_APP_VERSION=1.0.0
EOL

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. First Login
```
Email: admin@milkr.com
Password: Admin@123
```

## 📚 API Documentation

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/change-password
```

### Customers
```http
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
GET    /api/customers/stats/summary
```

### Milk Records
```http
GET    /api/milk-records
POST   /api/milk-records
PUT    /api/milk-records/:id
POST   /api/milk-records/bulk-create
GET    /api/milk-records/daily/:date
```

### Billing
```http
GET  /api/billing/monthly/:year/:month
GET  /api/billing/customer/:customerId
POST /api/billing/customer/:customerId/payment
GET  /api/billing/pending
GET  /api/billing/invoice/:customerId/:year/:month
```

### Analytics
```http
GET /api/analytics/dashboard
GET /api/analytics/monthly-comparison
GET /api/analytics/area-wise
GET /api/analytics/delivery-performance
GET /api/analytics/forecast
```

## 🎯 Usage Examples

### Add New Customer
```javascript
const customer = {
  name: "abcd",
  phone: "9876543210",
  address: "123 bilaspur Chhattisgarh",
  area: "Koni",
  milkPerDay: 2,
  location: { lat: ....., lng: ..... }
};

const response = await customerAPI.create(customer);
```

### Record Delivery
```javascript
const record = {
  customerId: "65abc123...",
  date: "XXXX-XX-XX",
  litres: 2,
  status: "Delivered"
};

const response = await milkRecordAPI.create(record);
```

### Get Monthly Bill
```javascript
const billing = await billingAPI.getMonthlyBilling(2025, 1);
console.log(billing.summary.totalRevenue);
```

## 🎨 UI Components

### Beautiful Login Screen
- Gradient backgrounds with animated elements
- Smooth form animations
- Professional branding
- Responsive design

### Interactive Dashboard
- Real-time statistics cards
- Animated charts with Recharts
- Recent activity feed
- Quick action buttons

### Customer Cards
- Avatar with initials
- Color-coded status badges
- Hover animations
- Mobile-optimized

### Toast Notifications
- Success, error, info types
- Auto-dismiss
- Slide-in animations
- Stacking support

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with salt rounds
- **Input Validation** - Server and client-side
- **CORS Protection** - Configured origins
- **SQL Injection Prevention** - MongoDB parameterization
- **XSS Protection** - React's built-in escaping
- **Rate Limiting** - API request throttling (optional)



### Backend Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/milkr
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Milkr
VITE_APP_VERSION=1.0.0
```


## 🐛 Known Issues

- [ ] Google Maps integration pending
- [ ] PDF invoice generation pending
- [ ] Email notifications pending
- [ ] SMS alerts pending

## 🗺️ Roadmap

### Version 1.1
- [ ] PDF invoice downloads
- [ ] Email notifications
- [ ] SMS integration
- [ ] WhatsApp alerts

### Version 1.2
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Multi-language support
- [ ] Advanced analytics

### Version 2.0
- [ ] Payment gateway integration
- [ ] Route optimization
- [ ] Inventory management
- [ ] CRM features

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 👥 Team

- **Rajnath Singh Tomar** - Full Stack Developer


## ⭐ Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

**Built with ❤️ for making milk delivery management easier**

© 2026 Milkr. All rights reserved.
