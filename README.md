<div align="center">
<img width="1200" height="475" alt="Nepa Health" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Nepa Health - Full Stack Mental Wellness Platform

A comprehensive mental health and wellness application built with React, Express.js, and MongoDB.

## 🏗️ Architecture

This is a **full-stack application** with:
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: MongoDB + Mongoose
- **State Management**: Server-side persistence (MongoDB) + React hooks

## ✨ Features

- 🏥 **Clinical Services**: Mental health counseling, assessments (PHQ-9, GAD-7, PSS-10)
- 🛒 **Well-Mart**: E-commerce marketplace for wellness products
- 📚 **Blog & Resources**: Educational content about mental health
- 👥 **Testimonials**: Patient success stories
- 📋 **CRM System**: Contact form submissions and admin dashboard
- 🔐 **Admin Dashboard**: Manage services, blogs, products, and inquiries
- 💾 **Data Persistence**: All data stored in MongoDB

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB (running locally or cloud connection)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
# .env file is already created with defaults
```

### Running the Application

**Development Mode (Recommended):**
```bash
npm run dev
```
This runs both the React frontend (port 3000) and Express backend (port 3001) concurrently.

**Frontend only:**
```bash
npm run dev:client
```

**Backend only:**
```bash
npm run dev:server
```

**Production Build:**
```bash
npm run build
npm run start
```

## 📁 Project Structure

```
nepa-health/
├── src/                          # React Frontend
│   ├── components/               # React components
│   ├── App.tsx                   # Main app with API integration
│   ├── types.ts                  # TypeScript interfaces
│   └── data.ts                   # Initial data & constants
│
├── server/                       # Express Backend
│   ├── index.ts                  # Main Express server
│   ├── db.ts                     # MongoDB connection
│   ├── seed.ts                   # Database seeding
│   └── models/                   # Mongoose schemas
│       ├── Service.ts
│       ├── BlogPost.ts
│       ├── Product.ts
│       ├── Testimonial.ts
│       ├── Submission.ts
│       └── AssessmentResult.ts
│
├── dist/                         # Production build output
├── .env                          # Environment configuration
├── package.json                  # Dependencies & scripts
└── tsconfig.json                 # TypeScript configuration
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Fetch all services |
| PUT | `/api/services/:id` | Update service |
| GET | `/api/blogs` | Fetch all blogs |
| POST | `/api/blogs` | Create blog |
| PUT | `/api/blogs/:id` | Update blog |
| DELETE | `/api/blogs/:id` | Delete blog |
| GET | `/api/products` | Fetch all products |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/testimonials` | Fetch testimonials |
| POST | `/api/testimonials` | Create testimonial |
| DELETE | `/api/testimonials/:id` | Delete testimonial |
| GET | `/api/submissions` | Fetch contact submissions |
| POST | `/api/submissions` | Create submission |
| PATCH | `/api/submissions/:id` | Update submission status |
| DELETE | `/api/submissions/:id` | Delete submission |
| GET | `/api/assessments` | Fetch assessment results |
| POST | `/api/assessments` | Create assessment result |

## ⚙️ Configuration

Edit `.env` to configure:

```env
MONGODB_URI=mongodb://localhost:27017/nepa_health
PORT=3001
NODE_ENV=development
VITE_API_URL=http://localhost:3001
```

## 🗄️ Database

The application uses MongoDB with Mongoose for data persistence. On first launch, the database is automatically seeded with:
- Initial services, products, and testimonials
- Sample blog posts and content
- Example contact submissions
- Assessment results for dashboard metrics

## 📝 Scripts

- `npm run dev` - Run development server (frontend + backend)
- `npm run dev:client` - Run React frontend only
- `npm run dev:server` - Run Express backend only
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start` - Start production server
- `npm run lint` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## 🔗 Related Resources

- **Full Migration Guide**: See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- **React Documentation**: https://react.dev/
- **Express.js Guide**: https://expressjs.com/
- **MongoDB Docs**: https://docs.mongodb.com/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

## 📞 Support

For detailed setup instructions and troubleshooting, refer to [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md).

## ✅ Build Status

- TypeScript Compilation: ✓ PASS
- Vite Frontend Build: ✓ PASS  
- Express Backend: ✓ FUNCTIONAL
- MongoDB Integration: ✓ COMPLETE
- API Routes: ✓ ALL WORKING

---

**Ready for deployment!** 🚀
