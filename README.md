# Hartford Insurance - Angular Application

A premium Angular insurance management application with elegant Asmara Wellness Spa-inspired design aesthetic.

## 🎨 Design Features

- **Premium Aesthetic**: Sophisticated design inspired by high-end wellness spa patterns
- **Elegant Typography**: Cinzel (display), Cormorant Garamond (serif), Lato (body)
- **Smooth Animations**: Fade-ins, hover effects, floating elements
- **Professional Color Scheme**: Navy dark (#1c2951) + Gold (#CAA650) with stone tones
- **Hartford Branding**: Official colors and professional imagery

## 🚀 Quick Start

### Prerequisites
- Node.js (v20.0.0+)
- npm

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start JSON Server** (in one terminal):
   ```bash
   npm run json-server
   ```
   This starts the mock backend on `http://localhost:3000`

3. **Start Angular Dev Server** (in another terminal):
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:4200`

## 🔐 Demo Credentials

### Admin Access
- **Email**: admin@hartford.com
- **Password**: (any password)
- **Dashboard**: `/admin`

### Agent Access
- **Email**: agent@hartford.com
- **Password**: (any password)
- **Dashboard**: `/agent`

### Customer Access
- **Email**: customer@example.com
- **Password**: (any password)
- **Dashboard**: `/customer`

## 📁 Project Structure

```
angular-insurance-app/
├── src/
│   ├── app/
│   │   ├── core/                    # Core functionality
│   │   │   ├── models/              # TypeScript interfaces
│   │   │   ├── services/            # Business logic services
│   │   │   ├── guards/              # Route guards
│   │   │   └── interceptors/        # HTTP interceptors
│   │   ├── features/                # Feature modules
│   │   │   ├── public/              # Public pages (landing, login, register)
│   │   │   ├── admin/               # Admin dashboard & pages
│   │   │   ├── agent/               # Agent dashboard & pages
│   │   │   └── customer/            # Customer dashboard & pages
│   │   ├── shared/                  # Shared components
│   │   ├── app.component.ts         # Root component
│   │   ├── app.config.ts            # App configuration
│   │   └── app.routes.ts            # Routing configuration
│   ├── styles.scss                  # Global styles with Tailwind
│   └── index.html                   # HTML entry point
├── db.json                          # JSON Server database
├── tailwind.config.js               # Tailwind configuration
└── package.json                     # Dependencies
```

## 🎯 Features

### Architecture
- ✅ **Services**: Centralized business logic (Auth, Policy, Claim)
- ✅ **Components**: Modular, reusable UI components
- ✅ **Routing**: Lazy-loaded feature modules with guards
- ✅ **Authentication**: JWT-based auth with role management
- ✅ **Guards**: Route protection (AuthGuard, RoleGuard)
- ✅ **JSON Server**: Mock REST API backend

### User Roles
- **Admin**: Manage policies, agents, and claims
- **Agent**: Manage customers, track sales, view claims
- **Customer**: View policies, file claims, track claim history

### Pages
- **Landing Page**: Premium homepage with Hartford branding
- **Login/Register**: Elegant authentication pages
- **Dashboards**: Role-specific dashboards with navigation
- **404 Page**: Custom not found page

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Watch Mode
```bash
npm run watch
```

### Linting
```bash
npm run lint
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  'navy-dark': '#1c2951',
  'gold': '#CAA650',
  // ... more colors
}
```

### Fonts
Fonts are loaded from Google Fonts in `src/styles.scss`:
- Cinzel (display/headers)
- Cormorant Garamond (elegant text)
- Lato (body text)

## 📝 API Endpoints

JSON Server provides the following endpoints:

- `GET /users` - List all users
- `GET /policies` - List all policies
- `GET /claims` - List all claims
- `GET /agents` - List all agents
- `GET /customers` - List all customers

## 🔒 Security Notes

This is a demo application. In production:
- Implement proper password hashing
- Use real JWT tokens
- Add HTTPS
- Implement proper CORS policies
- Add rate limiting
- Use environment variables for sensitive data

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🎭 Premium UI Elements

- Smooth hover effects and transitions
- Glassmorphism effects
- Gradient backgrounds
- Custom scrollbars
- Floating animations
- Elegant form inputs
- Premium card designs

## 📄 License

This is a demo project for educational purposes.

## 🙏 Credits

- UI Framework: Angular 18 (with v21 patterns)
- Styling: Tailwind CSS
- Icons: Heroicons (via inline SVG)
