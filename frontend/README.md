# 🥛 Milkr Frontend - Complete React Structure

## 📁 Project Structure

```
milkr-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── logo.png
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Avatar.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatsCard.jsx
│   │   │   ├── RevenueChart.jsx
│   │   │   ├── DeliveryChart.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   └── QuickActions.jsx
│   │   │
│   │   ├── customers/
│   │   │   ├── CustomerTable.jsx
│   │   │   ├── CustomerForm.jsx
│   │   │   ├── CustomerCard.jsx
│   │   │   └── CustomerDetails.jsx
│   │   │
│   │   ├── delivery/
│   │   │   ├── DeliveryList.jsx
│   │   │   ├── DeliveryForm.jsx
│   │   │   └── DeliveryStatus.jsx
│   │   │
│   │   ├── billing/
│   │   │   ├── BillingTable.jsx
│   │   │   ├── Invoice.jsx
│   │   │   └── PaymentForm.jsx
│   │   │
│   │   └── auth/
│   │       ├── LoginForm.jsx
│   │       └── RegisterForm.jsx
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Customers.jsx
│   │   ├── Delivery.jsx
│   │   ├── Billing.jsx
│   │   ├── Analytics.jsx
│   │   ├── Profile.jsx
│   │   ├── Settings.jsx
│   │   ├── Login.jsx
│   │   └── NotFound.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CustomerContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── customerService.js
│   │   ├── deliveryService.js
│   │   └── billingService.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCustomers.js
│   │   ├── useDelivery.js
│   │   └── useToast.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   │
│   ├── styles/
│   │   ├── index.css
│   │   └── animations.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
│
├── .env
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Setup Instructions

```bash
# Create Vite React project
npm create vite@latest milkr-frontend -- --template react
cd milkr-frontend

# Install dependencies
npm install

# Install additional packages
npm install react-router-dom axios recharts lucide-react framer-motion react-hot-toast date-fns

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start development server
npm run dev
```

## 📦 Package.json

```json
{
  "name": "milkr-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "recharts": "^2.10.3",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.5",
    "react-hot-toast": "^2.4.1",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
```

## ⚙️ Configuration Files

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        milk: {
          50: '#fefefe',
          100: '#fdfefe',
          200: '#fbfdfe',
          300: '#f8fcfe',
          400: '#f5fbfe',
          500: '#f2fafe',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

### .env
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Milkr
VITE_APP_VERSION=1.0.0
# Mapbox token is required for address autocomplete and reverse geocoding.
# Add your Mapbox public token below (do NOT commit secrets):
# VITE_MAPBOX_TOKEN=pk.your_mapbox_token_here
```

