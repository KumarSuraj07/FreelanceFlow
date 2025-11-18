# FreelanceFlow - Complete MERN Stack CRM

A beautiful, full-featured CRM application for freelancers to manage clients, projects, invoices, and meeting notes. Built with React, Node.js, Express, MongoDB, Tailwind CSS, Three.js, and Framer Motion.

## Features

### 🔐 Authentication
- JWT-based authentication
- Secure login/signup
- Role-based access (freelancer only)

### 👥 Client Management
- Add, edit, delete clients
- Client details with contact information
- Project type and budget tracking
- Status management (Active/Inactive/Completed)

### 📝 Meeting Notes
- Add meeting notes linked to clients
- Date, note text, and next steps
- Full CRUD operations
- Client-specific note viewing

### 🚀 Projects & Deliverables
- Create projects for each client
- Track project status and deadlines
- Manage deliverables with completion status
- Visual progress tracking

### 💰 Invoicing System
- Create professional invoices
- Auto-generate invoice numbers
- Tax calculations
- PDF generation with Puppeteer
- Email invoices to clients
- Payment status tracking

### ⏰ Payment Reminders
- Automated email reminders
- Daily cron job for overdue invoices
- Status updates (Paid/Unpaid/Overdue)

### 🎨 Beautiful UI
- Modern design with Tailwind CSS
- Animated Three.js background
- Smooth animations with Framer Motion
- Responsive design
- Glass morphism effects

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Puppeteer** - PDF generation
- **Nodemailer** - Email service
- **Node-cron** - Scheduled tasks

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Three.js** - 3D graphics
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hook Form** - Form handling

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FreelanceFlow
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelanceflow
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Setup
Make sure MongoDB is running, then seed the database:
```bash
cd ../backend
npm run seed
```

### 5. Start the Application

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Login Credentials
After seeding the database:
- **Email:** john@freelancer.com
- **Password:** password123

## Project Structure

```
FreelanceFlow/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── middleware/          # Authentication middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── scripts/            # Database seeding
│   ├── utils/              # Utility functions
│   ├── server.js           # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── forms/      # Form components
│   │   │   ├── layout/     # Layout components
│   │   │   └── ui/         # UI components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client by ID
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id` - Get invoice by ID
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/:id/pdf` - Download invoice PDF
- `POST /api/invoices/:id/send` - Email invoice

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `GET /api/notes/client/:clientId` - Get notes by client
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## Features in Detail

### Dashboard
- Overview statistics (clients, projects, invoices, revenue)
- Recent invoices table
- Animated stat cards

### Client Management
- Comprehensive client information
- Status tracking
- Budget management
- Contact details

### Project Tracking
- Project status (Pending/In Progress/Completed)
- Deadline management
- Deliverable tracking with completion status
- Client association

### Invoice System
- Professional invoice generation
- Automatic calculations (subtotal, tax, total)
- PDF export functionality
- Email delivery
- Payment status tracking

### Meeting Notes
- Date-based note organization
- Next steps tracking
- Client-specific filtering
- Full CRUD operations

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update colors in `src/index.css`
- Customize Three.js animations in `ThreeBackground.jsx`

### Email Configuration
- Update email settings in `.env`
- Modify email templates in `utils/emailService.js`
- Configure SMTP settings for your provider

### PDF Templates
- Customize invoice PDF layout in `utils/invoiceService.js`
- Add company branding and styling

## Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred database
2. Configure environment variables
3. Deploy to Heroku, Railway, or your preferred platform

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Update API base URL for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**FreelanceFlow** - Streamline your freelance business with beautiful, modern tools. 🚀