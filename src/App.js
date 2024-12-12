import React from "react";
import { BrowserRouter, Routes, Route,Link } from "react-router-dom";
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
import ChangePassword from "./components/Employee/ChangePassword";
import EmLogin from "./components/Employee/EmLogin";
import History from "./components/Employee/History";
import Profile from "./components/Employee/Profile";
import ProfileUpdate from "./components/Employee/ProfileUpdate";
import Welcome from "./components/Employee/Welcome";
import ServiceDetail from '../src/components/service/ServiceDetail';
import Courses from '../src/components/Course/Courses';
import CourseDetails from '../src/components/Course/CourseDetails'; // Import the CourseDetails component
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home/Home";
import LoginRegister from "./components/Home/LoginRegister";
import DashBoard from "./components/Home/DashBoard";
import Admin from "./components/Admin";
import User from "./components/User";
import BookingStation04 from "./components/BookingStation04";
import BookingStation01 from "./components/BookingStation01";
import BookingStation02 from "./components/BookingStation02";
import BookingStation03 from "./components/BookingStation03";




const App = () => {
  return (
    <div>
    <BrowserRouter>
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
          path="/loginregister"
          element={
            <Layout1>
              <LoginRegister />
            </Layout1>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout2>
              <DashBoard />
            </Layout2>
          }
        />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/user/*" element={<User />} />
        <Route path="/bookingstation04/*" element={<BookingStation04 />} />
        <Route path="/bookingstation01/*" element={<BookingStation01 />} />
        <Route path="/bookingstation02/*" element={<BookingStation02 />} />
        <Route path="/bookingstation03/*" element={<BookingStation03 />} />
        <Route path="/courses/:id" element={<CourseDetails />} /> {/* View course details by ID */}
        <Route path="/courses" element={<Courses />} /> {/* List specific course */}
        <Route path="/services/:id" element={<ServiceDetail />} /> {/* View course details by ID */}
        <Route path="/jobs" element={<Jobs />} /> {/* Route for Courses */}
        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route path="/changePassword/:id" element={<LayoutEm1><ChangePassword /></LayoutEm1>} />
        <Route path="/emLogin" element={<EmLogin />} />
        <Route path="/History/:id" element={<LayoutEm1><History /></LayoutEm1>} />
        <Route path="/profileupdate/:id" element={<LayoutEm1><ProfileUpdate /></LayoutEm1>} />
        <Route path="/profile/:id" element={<LayoutEm1><Profile /></LayoutEm1>} />
        <Route path="/welcome/:id" element={<LayoutEm><Welcome /></LayoutEm>} />
      
      </Routes>
     
    </BrowserRouter>

   
        
    </div>
  );
};

export default App;