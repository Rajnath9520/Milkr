# 🥛 Milkr Backend API

Complete RESTful API for Milk Delivery Management System built with Node.js, Express, and MongoDB.

## 📋 Features

- ✅ **User Authentication** - JWT-based secure authentication
- ✅ **Customer Management** - CRUD operations for customers
- ✅ **Milk Records** - Daily delivery tracking
- ✅ **Billing System** - Automated billing and invoice generation
- ✅ **Analytics Dashboard** - Comprehensive analytics and reports
- ✅ **Role-Based Access** - Admin, Manager, and Delivery staff roles
- ✅ **Payment Tracking** - Track paid and pending payments
- ✅ **Area-wise Management** - Organize deliveries by area
- ✅ **Performance Metrics** - Delivery staff performance tracking

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd milkr-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start at `http://localhost:5000`

## 📁 Project Structure

```
milkr-backend/
├── server.js              # Main application entry point
├── models/
│   ├── Customer.js        # Customer schema
│   ├── MilkRecord.js      # Milk delivery record schema
│   └── User.js            # User/Staff schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── customers.js       # Customer management routes
│   ├── milkRecords.js     # Delivery record routes
│   ├── billing.js         # Billing and payment routes
│   └── analytics.js       # Analytics and reports routes
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── config/
│   └── db.js              # Database configuration
├── .env                   # Environment variables
├── .env.example           # Environment template
└── package.json           # Dependencies
```

## 🔐 API Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Getting Started

1. Register/Login to get your JWT token
2. Include the token in all subsequent requests
3. Token expires in 7 days (configurable)

## 📚 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/change-password` | Change password | Private |
| GET | `/users` | Get all users | Admin |
| PUT | `/users/:id/toggle-status` | Activate/Deactivate user | Admin |

### Customers (`/api/customers`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all customers | Private |
| GET | `/:id` | Get customer by ID | Private |
| POST | `/` | Create new customer | Private |
| PUT | `/:id` | Update customer | Private |
| DELETE | `/:id` | Delete customer | Admin/Manager |
| GET | `/area/:area` | Get customers by area | Private |
| GET | `/stats/summary` | Get customer statistics | Private |

### Milk Records (`/api/milk-records`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all records | Private |
| GET | `/:id` | Get record by ID | Private |
| POST | `/` | Create new record | Private |
| PUT | `/:id` | Update record | Private |
| DELETE | `/:id` | Delete record | Private |
| POST | `/bulk-create` | Create records for all customers | Private |
| GET | `/customer/:customerId` | Get customer's records | Private |
| GET | `/daily/:date` | Get records for specific date | Private |
| GET | `/stats/summary` | Get delivery statistics | Private |

### Billing (`/api/billing`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/monthly/:year/:month` | Get monthly billing | Private |
| GET | `/customer/:customerId` | Get customer billing | Private |
| POST | `/customer/:customerId/payment` | Record payment | Private |
| GET | `/pending` | Get pending payments | Admin/Manager |
| GET | `/area/:area` | Get area-wise billing | Private |
| GET | `/revenue/daily` | Get daily revenue | Admin/Manager |
| GET | `/invoice/:customerId/:year/:month` | Generate invoice | Private |

### Analytics (`/api/analytics`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard` | Get dashboard analytics | Private |
| GET | `/monthly-comparison` | Month-over-month comparison | Admin/Manager |
| GET | `/area-wise` | Area-wise analytics | Admin/Manager |
| GET | `/delivery-performance` | Staff performance | Admin/Manager |
| GET | `/customer-retention` | Retention analytics | Admin/Manager |
| GET | `/payment-trends` | Payment trends | Admin/Manager |
| GET | `/forecast` | Revenue forecast | Admin/Manager |

## 💾 Database Schema

### Customer Collection
```javascript
{
  name: String,
  address: String,
  location: { lat: Number, lng: Number },
  milkPerDay: Number,
  phone: String,
  area: String,
  assignedTo: ObjectId (User),
  status: Enum['Active', 'Inactive', 'Suspended'],
  pricePerLitre: Number,
  startDate: Date,
  endDate: Date,
  notes: String
}
```

### MilkRecord Collection
```javascript
{
  customerId: ObjectId (Customer),
  date: Date,
  litres: Number,
  status: Enum['Delivered', 'Pending', 'Cancelled', 'Skipped'],
  deliveredBy: ObjectId (User),
  deliveryTime: Date,
  pricePerLitre: Number,
  totalAmount: Number,
  paymentStatus: Enum['Paid', 'Pending', 'Partial'],
  notes: String,
  signature: String
}
```

### User Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: Enum['admin', 'delivery', 'manager'],
  fullName: String,
  phone: String,
  isActive: Boolean,
  lastLogin: Date,
  assignedAreas: [String]
}
```

## 🔒 User Roles & Permissions

### Admin
- Full access to all features
- User management
- System configuration

### Manager
- Customer management
- Billing and reports
- Staff performance monitoring
- Cannot manage users

### Delivery Staff
- View assigned customers
- Update delivery records
- Mark deliveries as complete
- Limited access to analytics

## 🌐 CORS Configuration

Configure allowed origins in `.env`:
```bash
CORS_ORIGIN=http://localhost:5173
```

For multiple origins:
```javascript
// In server.js
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true
}));
```

## 📊 Sample API Responses

### Login Success
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123def456789",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "delivery"
  }
}
```

### Get Customers
```json
{
  "customers": [
    {
      "_id": "65abc123def456789",
      "name": "Rajesh Kumar",
      "phone": "9876543210",
      "area": "Civil Lines",
      "milkPerDay": 2,
      "pricePerLitre": 60,
      "status": "Active"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 1
  }
}
```

## 🚀 Deployment

### Deploy to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set environment variables
5. Deploy!

**Build Command:** `npm install`  
**Start Command:** `npm start`

### Deploy to Railway

```bash
railway login
railway init
railway up
```

### Deploy to Heroku

```bash
heroku create milkr-api
git push heroku main
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
```

## 🧪 Testing

### Using Postman

1. Import the API collection (coming soon)
2. Set environment variables
3. Run authentication requests first
4. Use the token for protected routes

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123",
    "fullName": "Test User",
    "phone": "9876543210"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'

# Get Customers (with token)
curl -X GET http://localhost:5000/api/customers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for MongoDB Atlas)

### JWT Token Issues
- Check if JWT_SECRET is set in `.env`
- Verify token format: `Bearer <token>`
- Token might be expired (7 days default)

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| PORT | Server port | No | 5000 |
| MONGODB_URI | MongoDB connection string | Yes | - |
| JWT_SECRET | JWT signing secret | Yes | - |
| JWT_EXPIRE | Token expiration time | No | 7d |
| CORS_ORIGIN | Allowed CORS origin | No | * |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Support

For support, email support@milkr.com or create an issue on GitHub.

## 🎉 Acknowledgments

- Express.js for the web framework
- MongoDB for the database
- JWT for authentication
- All contributors and testers

---

**Made with ❤️ for efficient milk delivery management**