# BloodCare - Blood Donation Platform



BloodCare is a **MERN stack** based blood donation platform that connects blood donors with those in need, making the donation process seamless, efficient, and life-saving. The platform allows users to register as donors, create donation requests, search for donors, donate funds, and manage requests based on their roles (Donor, Volunteer, Admin).

## Live Site
🔗 **Live Link:** https://blood-care-a11.netlify.app/

## Admin Credentials (For Testing)
- **Email:** tasnifmasad40@gmail.com
- **Password:** Admin@123

## Key Features
### Public Features
- User Registration & Login (Donor by default)
- Search Donors by Blood Group, District, Upazila
- View Public Pending Donation Requests
- View Donation Request Details (Private – Login Required)
- Funding Page (Stripe Payment Integration)

### Donor Features
- Create Donation Request
- View & Manage Own Donation Requests (Pending, In-progress, Done, Canceled)
- Update Profile (Name, Avatar, Blood Group, Address)
- Edit/Delete Own Donation Requests
- View Recent 3 Requests on Dashboard

### Volunteer Features
- View & Update Status of All Donation Requests
- View Platform Statistics (Total Users, Funding, Requests)

### Admin Features
- Manage All Users (Block/Unblock, Change Role: Donor → Volunteer → Admin)
- Manage All Donation Requests (Full Control)
- View Platform Statistics (Total Users, Total Funding, Total Requests)
- View & Manage All Funding Records

### Additional Features
- Role-based Access Control (RBAC)
- JWT Authentication (Protected Routes & APIs)
- Pagination & Filtering (Requests & Users)
- Responsive Dashboard with Sidebar
- Beautiful & Consistent UI/UX
- Secure Environment Variables for Firebase & MongoDB

## Tech Stack
### Frontend
- React.js + Vite
- React Router v6
- Tailwind CSS + DaisyUI
- React Hot Toast (Notifications)
- React Icons
- Axios
- React Helmet Async (SEO)
- React Hook Form (Forms)

### Backend
- Node.js + Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Stripe Payment Integration
- CORS
- Dotenv

### Deployment
- Frontend: Netlify
- Backend: Vercel

## NPM Packages Used (Client Side)
```bash
react react-dom react-router-dom react-router
tailwindcss daisyui axios react-hot-toast
react-icons react-helmet-async react-hook-form
@headlessui/react @heroicons/react