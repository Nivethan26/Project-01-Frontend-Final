import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Services from "./components/Services";
import LayoutEm from "./components/Employee/LayoutEm";
import LayoutEm1 from "./components/Employee/LayoutEm1";
import Layout from "./components/Layout";
import Layout1 from "./components/Layout1";
import Layout2 from "./components/Layout2";
import Layout3 from "./components/Layout3";
import About from "./components/AboutUs/About";
import Contactus from "./components/ContactUs/Contactus";
import CareerJOB from "./components/career/CareerJOB";
import CareerLife from "./components/career/CareerLife";
import CareerPeople from "./components/career/CareerPeople";
import Career1 from "./components/career/Career1";
import Jobs from "./components/job/Jobs";
import JobDetails from "./components/job/JobDetails";
import ServiceDetail from '../src/components/service/ServiceDetail';
import Courses from '../src/components/Course/Courses';
import CourseDetails from '../src/components/Course/CourseDetails'; // Import the CourseDetails component
import 'bootstrap/dist/css/bootstrap.min.css';

// Employee New Layout Imports
import EmployeeDashboardLayout from "./components/Employee/Dashboard/EmployeeDashboardLayout";
import EmployeeHome from "./components/Employee/Dashboard/Pages/EmployeeHome";
import EmployeeBookings from "./components/Employee/Dashboard/Pages/EmployeeBookings";
import EmployeeMyJobs from "./components/Employee/Dashboard/Pages/EmployeeMyJobs";
import EmployeeJobs from "./components/Employee/Dashboard/Pages/EmployeeJobs";
import EmployeeLeave from "./components/Employee/Dashboard/Pages/EmployeeLeave";
import EmployeeMessages from "./components/Employee/Dashboard/Pages/EmployeeMessages";
import EmployeeProfile from "./components/Employee/Dashboard/Pages/EmployeeProfile";
import Home from "./components/Home/Home";
import Login from "./components/Home/Login";
import Register from "./components/Home/Register";
import ForgotPassword from "./components/Home/ForgotPassword";
import ResetPassword from "./components/Home/ResetPassword";
import DashBoard from "./components/Home/DashBoard";
import Admin from "./components/Admin";
import User from "./components/User";
import BookingStation from "./components/BookingStation";
import PaymentForm from "./booking/components/PaymentForm/PaymentForm";
import AppAlertsProvider from "./components/ui/AppAlertsProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import BookingWizard from "./components/BookingWizard/BookingWizard";
import BookingPage from "./components/BookingPage/BookingPage";

// ScrollToTop component to reset window scroll on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const EmployeeDashboardRedirect = () => {
  return (
    <ProtectedRoute allowedRoles={["employee"]}>
      <Navigate to="/employee/dashboard" replace />
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <div>
    <AppAlertsProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout3>
              <About />
            </Layout3>
          }
        />
        <Route
          path="/services"
          element={
            <Layout3>
              <Services />
            </Layout3>
          }
     />
        
        <Route
          path="/contactus"
          element={
            <Layout3>
              <Contactus />
            </Layout3>
          }
        />
        <Route
          path="/career"
          element={
            <Layout3>
              <Career1 />
            </Layout3>
          }
        />
        <Route
          path="/course"
          element={
            <Layout3>
              <Courses />
            </Layout3>
          }
        />
        
        <Route
          path="/careerjob"
          element={
            <Layout3>
              <CareerJOB />
            </Layout3>
          }
        />
        <Route
          path="/careerlife"
          element={
            <Layout3>
              <CareerLife />
            </Layout3>
          }
        />
        <Route
          path="/careerpeople"
          element={
            <Layout3>
              <CareerPeople />
            </Layout3>
          }
        />
        <Route
          path="/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout1>
              <Login />
            </Layout1>
          }
        />
        <Route
          path="/register"
          element={
            <Layout1>
              <Register />
            </Layout1>
          }
        />
        <Route path="/loginregister" element={<Navigate to="/login" replace />} />
        <Route
          path="/forgot-password"
          element={
            <Layout1>
              <ForgotPassword />
            </Layout1>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <Layout1>
              <ResetPassword />
            </Layout1>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout2>
                <DashBoard />
              </Layout2>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeHome />} />
          <Route path="bookings/*" element={<EmployeeBookings />} />
          <Route path="jobs" element={<EmployeeMyJobs />} />
          <Route path="leave" element={<EmployeeLeave />} />
          <Route path="messages" element={<EmployeeMessages />} />
          <Route path="profile" element={<EmployeeProfile />} />
        </Route>

        <Route path="/employee-dashboard" element={<EmployeeDashboardRedirect />} />
        <Route path="/user-dashboard" element={<Navigate to="/user" replace />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <User />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-station/:stationId/*"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BookingStation />
            </ProtectedRoute>
          }
        />
        {/* Backward compat redirects for old station URLs */}
        <Route path="/bookingstation01/*" element={<Navigate to="/booking-station/1" replace />} />
        <Route path="/bookingstation02/*" element={<Navigate to="/booking-station/2" replace />} />
        <Route path="/bookingstation03/*" element={<Navigate to="/booking-station/3" replace />} />
        <Route path="/bookingstation04/*" element={<Navigate to="/booking-station/4" replace />} />

        {/* Checkout Route */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <PaymentForm />
            </ProtectedRoute>
          }
        />

        <Route path="/courses/:id" element={<CourseDetails />} /> {/* View course details by ID */}
        <Route path="/courses" element={<Courses />} /> {/* List specific course */}
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/booking" element={<Layout3><BookingPage /></Layout3>} />
        <Route path="/book-service" element={<Layout3><BookingWizard /></Layout3>} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Redirect old employee routes to the new dashboard */}
        <Route path="/changePassword/:id" element={<Navigate to="/employee/profile" replace />} />
        <Route path="/History/:id" element={<Navigate to="/employee/leave" replace />} />
        <Route path="/profileupdate/:id" element={<Navigate to="/employee/profile" replace />} />
        <Route path="/profile/:id" element={<Navigate to="/employee/profile" replace />} />
        <Route path="/welcome/:id" element={<Navigate to="/employee/dashboard" replace />} />
      
      </Routes>
     
    </BrowserRouter>
    
    </AppAlertsProvider>



    </div>
  );
};

export default App;