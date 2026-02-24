# Campus Management System

![Django](https://img.shields.io/badge/Django-5.0.1-green?logo=django)
![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwindcss)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-Educational-yellow)

A full-stack web application for managing campus resources including blocks, classrooms, courses, faculty, and students with role-based access control.

## ✨ Key Highlights

- **Modern Glassmorphism UI**: Sleek dark theme with backdrop blur effects and smooth animations
- **3 User Roles**: Admin, Faculty, Student - each with tailored dashboards
- **Real-time Analytics**: Visual charts for campus utilization & workload
- **Interactive Notifications**: Working notification system with read/dismiss functionality
- **Bulk Operations**: CSV upload for mass data entry
- **Modern Stack**: Django REST + React 19 + Tailwind CSS
- **One-Command Setup**: Get running in under 2 minutes



Note: the `start.ps1` automation script has been removed from this repository. To run the application locally you must start the backend and frontend servers separately (see Manual Setup below).

Then open:
- **Application**: http://localhost:5173
- **Login (demo accounts)**: see the **Login Credentials** section below

🎯 **First Steps**: Start both servers, then login using any demo account below and explore dashboards.

---

## 📋 Prerequisites

- **Python 3.8+** (installed as `py`)
- **Node.js 16+** (includes npm)
- **PowerShell** (for Windows startup script)

---

## 🌐 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend App** | http://localhost:5173 | Main application interface |
| **Backend API** | http://127.0.0.1:8001/api/ | REST API endpoints |
| **Django Admin** | http://127.0.0.1:8001/admin/ | Database admin panel |

---

## 👥 Login Credentials (All Working)

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| **Admin** | `admin` | `Demo@123` | Full system access |
| **Faculty** | `faculty1` | `Demo@123` | Assigned courses only |
| **Student** | `student1` | `Demo@123` | Enrolled courses only |

> 💡 **Quick Copy**: admin / Demo@123 | faculty1 / Demo@123 | student1 / Demo@123

### Access Permissions

| Role | Blocks | Classrooms | Courses | Faculty | Students | Analytics |
|------|--------|------------|---------|---------|----------|-----------|
| Admin | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Faculty | 👁️ View | 👁️ View | 📚 Own Only | ❌ | ❌ | 📊 Limited |
| Student | ❌ | ❌ | 📚 Enrolled | ❌ | ❌ | ❌ |

### Creating More Accounts
1. Login as **Admin** (`admin / Demo@123`)
2. Navigate to **Add Faculty** or **Add Students** in the sidebar
3. Choose:
   - **Manual Form**: Fill details with username/password
   - **CSV Upload**: Bulk import from CSV file



---

## 📁 Project Structure

```
Campus Management 4/
├── backend/                 # Django REST API
│   ├── campus/             # Campus models and views
│   ├── users/              # User authentication
│   ├── config/             # Django settings
│   ├── manage.py           # Django management
│   └── requirements.txt    # Python dependencies
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── pages/         # Application pages
│   │   ├── components/    # Reusable components
│   │   └── auth/          # Authentication logic
│   └── package.json       # Node dependencies

└── README.md              # This file
```

---

## 🔧 Manual Setup (If script fails)

### Backend Setup

```powershell
# Create virtual environment
py -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r backend\requirements.txt

# Run migrations
py backend\manage.py migrate

# Start backend server
py backend\manage.py runserver
```

### Seed / Re-seed Demo Data (Optional)

If you want to ensure demo data exists (or you reset the database), run:

```powershell
py backend\manage.py seed_demo_data
```

### Frontend Setup

```powershell
# Install dependencies
npm --prefix frontend install

# Start frontend server
npm --prefix frontend run dev
```

---

## 📊 Features

### Admin Dashboard
- **Blocks Management**: Add/view blocks with classroom counts and capacity
- **Classrooms Management**: Manage individual classrooms with utilization tracking
- **Faculty Management**: Add faculty with workload tracking
- **Student Management**: Add students with course enrollments
- **Course Management**: Assign faculty and classrooms to courses
- **Bulk Operations**: CSV upload for faculty and students
- **Analytics**: Campus utilization and workload statistics

### Faculty Dashboard
- **My Courses**: View assigned courses only
- **Workload Tracking**: Monitor teaching hours and utilization
- **Limited Analytics**: View relevant campus statistics

### Student Dashboard
- **My Enrollments**: View enrolled courses only
- **Course Information**: Access class schedules and details

### Role-Based Access
- **Admin**: Full access to all data and features
- **Faculty**: Access only to assigned courses and personal data
- **Student**: Access only to enrolled courses and personal data

### Modern UI Features
- **Glassmorphism Design**: Frosted glass cards with backdrop blur effects
- **Dark Theme**: Eye-friendly dark gradient backgrounds
- **Smooth Animations**: Fade-in, slide-in, and hover transitions
- **Interactive Notifications**: Click to view, mark as read, dismiss
- **Responsive Layout**: Works on desktop and mobile devices
- **Role-Specific Accents**: Color-coded headers per user role
- **Quick Login Buttons**: One-click demo credential fill

---

## 📤 CSV Upload Format

### Blocks CSV
```csv
block_name,total_classrooms,total_capacity,description
Block A,10,300,Main academic block
Block B,8,250,Engineering block
```

### Faculty CSV
```csv
faculty_name,registration_number,department,max_weekly_hours,assigned_hours,username,password
Dr. Smith,F001,Computer Science,20,15,jsmith,Pass@123
```

### Students CSV
```csv
name,registration_number,course_name,semester,username,password
John Doe,S001,B.Tech CSE,3,johndoe,Pass@123
```

---

## 🔐 Authentication

- **JWT-based authentication** for API access
- **Role-based permissions** enforced at backend level
- **Automatic user creation** when admin adds faculty/students
- **Secure password storage** with Django's built-in hashing

---

## 🛠️ Technologies Used

### Backend
- **Django 5.0.1** - Web framework
- **Django REST Framework** - API development
- **Simple JWT** - Token authentication
- **SQLite** - Database (development)

### Frontend
- **React 19.2.0** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling with custom glassmorphism effects
- **Lucide React** - Modern icon library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization

---

## 📝 Development Notes

### Environment Variables
Backend uses `.env` file in `backend/` folder:
```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Database
- Uses SQLite by default (`backend/db.sqlite3`)
- Auto-created on first run
- Migrations handled automatically by startup script

### API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/users/token/` | POST | Get JWT tokens (login) | ❌ |
| `/api/users/token/refresh/` | POST | Refresh access token | ❌ |
| `/api/users/register/` | POST | Register new user | ❌ |
| `/api/users/me/` | GET | Get current user profile | ✅ |
| `/api/campus/blocks/` | GET, POST | List/Create blocks | ✅ |
| `/api/campus/classrooms/` | GET, POST | List/Create classrooms | ✅ |
| `/api/campus/courses/` | GET, POST | List/Create courses | ✅ |
| `/api/campus/courses/my/` | GET | Get user's courses | ✅ |
| `/api/campus/faculty/` | GET, POST | List/Create faculty | ✅ |
| `/api/campus/students/` | GET, POST | List/Create students | ✅ |
| `/api/campus/enrollments/` | GET, POST | List/Create enrollments | ✅ |
| `/api/campus/enrollments/my/` | GET | Get user's enrollments | ✅ |
| `/api/campus/analytics/` | GET | Campus statistics | ✅ |
| `/api/campus/ai-insights/` | GET | AI-powered insights | ✅ |

> All authenticated endpoints require `Authorization: Bearer <token>` header

---

## 🐛 Troubleshooting

### Login Issues
1. Ensure backend is running (check http://127.0.0.1:8001/api/)
2. Clear browser cache and localStorage
3. Use correct credentials: `admin / Demo@123`

### Port Conflicts
- Backend uses port 8001
- Frontend uses port 5173
- If ports are busy, close other applications using them

### Script Issues
- Run PowerShell as Administrator if needed
- Ensure execution policy allows running scripts:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Verify both backend and frontend are running
4. Check browser console for JavaScript errors

---

## � Version History

| Version | Date | Changes |
|---------|------|----------|| 4.1 | Feb 2026 | Modern glassmorphism UI, notification system, unified demo passwords || 4.0 | Feb 2026 | Role-based dashboards, AI insights, CSV uploads |
| 3.0 | Jan 2026 | JWT authentication, analytics charts |
| 2.0 | Dec 2025 | React frontend, REST API |
| 1.0 | Nov 2025 | Initial Django monolith |

---

## 👨‍💻 Author

**Ankesh Maurya**
- GitHub: [@ankeshmaurya](https://github.com/ankeshmaurya)
- Project: PEP Project - Campus Management System

---

## 📄 License

This project is for educational purposes. Use responsibly and follow your institution's data handling policies.

---

<p align="center">
  Made with ❤️ for better campus management
</p>
