import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminHome from "../admin/pages/home/AdminHome";
import AdminEm from "../admin/pages/employee/AdminEm";
import Employ from "../admin/pages/employee/Employ";
import Sidebar from "../admin/components/sidebar/Sidebar";
import Topbar from "../admin/components/topbar/Topbar";
import ListJob from "../admin/pages/jobs/ListJob";
import Addjob from "../admin/pages/jobs/Addjob";
import AddLeaveType from "../admin/pages/employee/AddLeaveType";
import EditLeaveType from "../admin/pages/employee/EditLeaveType";
import EmployeeDetails from "../admin/pages/employee/EmployeeDetails";
import CreateEmployeeForm from "../admin/pages/employee/CreateEmployeeForm";
import DeclinedApplicationDetails from "../admin/pages/employee/DeclinedApplicationDetails";
import DeclinedApplications from "../admin/pages/employee/DeclinedApplications";
import LeaveApplication from "../admin/pages/employee/LeaveApplication";

import ViewEmployeeDetails from "../admin/pages/employee/ViewEmployeeDetails";
import PendingApplications from "../admin/pages/employee/PendingApplications";
import EditJob from "../admin/pages/jobs/EditJob";
import Viewjobform from "../admin/pages/jobs/Viewjobform";
import LeaveTypes from "../admin/pages/employee/LeaveTypes";
import BookingsList01 from "../admin/pages/bookingList/BookingList01";
import BookingsList02 from "../admin/pages/bookingList/BookingList02";
import BookingsList03 from "../admin/pages/bookingList/BookingList03";
import BookingsList04 from "../admin/pages/bookingList/BookingList04";
import MessagesList from "../admin/pages/messagesList/MessagesList";
import ListCourse from '../admin/pages/course/ListCourse';
import AddCourse from '../admin/pages/course/AddCourse';
import EditCourse from '../admin/pages/course/EditCourse';
import ListService from "../admin/pages/service/ListService";
import AddService from "../admin/pages/service/AddService";
import EditService from "../admin/pages/service/EditService";
import ApplyCourseList from '../admin/pages/course/ApplyCourseList';
import ApprovedApplications from "../admin/pages/employee/ApprovedApplications";
import ListCustomer from "../admin/pages/customer/ListCustomer";
import "./Admin.css";
import ApprovedApplicationDetails from "../admin/pages/employee/ApprovedApplicationDetails";

const Admin = () => {
  return (
    <>
      <Topbar />
      <div className="container_admin">
        <Sidebar />
        <div className="mainContent">
          <Routes>
            <Route path="/" element={<AdminHome />} /> {/* Default route */}
            <Route path="/adminEm" element={<AdminEm />} />
            <Route path="/adminEm/leaveTypes" element={<LeaveTypes />} />
            <Route path="/adminEm/addLeaveType" element={<AddLeaveType />} />
            <Route path="/adminEm/edit/:id" element={<EditLeaveType />} />
            <Route path="/adminEm/employ" element={<Employ />} />
            <Route path="/adminEm/ViewEmployeeDetails/:id" element={<ViewEmployeeDetails />} />
            <Route path="/adminEm/employeeDetails/:id" element={<EmployeeDetails />} /> 
            <Route path="/adminEm/createEmployeeForm" element={<CreateEmployeeForm />} />
            <Route path="/adminEm/pendingApplications" element={<PendingApplications />} />
            <Route path="/adminEm/leaveApplication" element={<LeaveApplication />} />
            <Route path="/adminEm/declinedApplications" element={<DeclinedApplications />} />
            <Route path="/adminEm/declinedApplicationDetails/:id" element={<DeclinedApplicationDetails />} />  
            <Route path="/bookingList01" element={<BookingsList01 />} />
            <Route path="/bookingList02" element={<BookingsList02 />} />
            <Route path="/bookingList03" element={<BookingsList03 />} />
            <Route path="/bookingList04" element={<BookingsList04 />} />
            <Route path="/messageList" element={<MessagesList />} />
            {/* Course management routes */}
            <Route path="/courses" element={<ListCourse />} /> {/* List all courses */}
            <Route path="/courses/course/create" element={<AddCourse />} /> {/* Add new course */}
            <Route path="/courses/course/:id/edit" element={<EditCourse />} /> {/* Edit course by ID */}
            <Route path="/services" element={<ListService />} />
            <Route path="/services/service/create" element={<AddService />} />
            <Route path="/services/service/:id/edit" element={<EditService />} />
            <Route path="/courseApply" element={<ApplyCourseList />} />
            <Route  path="/jobs" element={<ListJob />} />
              <Route path="/jobs/job/create" element={<Addjob />} />
              <Route path="/jobs/job/:id/edit" element={<EditJob />} />
              <Route path="/jobApply" element={<Viewjobform />} />
              <Route path="/adminEm/approvedApplications" element={<ApprovedApplications />} />
              <Route path="/adminEm/approvedApplicationDetails/:id" element={<ApprovedApplicationDetails />} />
              <Route path="/customer" element={<ListCustomer />} /> 
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Admin;
