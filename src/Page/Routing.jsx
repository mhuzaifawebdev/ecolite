import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserInRD } from "../Store/Slices/userSlice";
import ProtectedRoute from "./ProtectedRoute";
import SingleUserSurvey from "../components/SingleUserSurvey";
import Login from "../components/Login";
import Register from "../components/Register";
import UserDashboard from "./UserDashboard";
import ProfilePage from "../components/Profile";
import AdminDashboard from "../components/AdminDashboard";
import Notifications from "../components/Notification";
import SurveyForm from "../components/CreateSurvey";
import SurveyList from "../components/SurveyList";
import SurveyDetails from "../components/SurveyDetails";
import Csv from "../components/Csv";
import NotificationPage from "../components/Notification";
import LeadFormPage from "../components/Lead/LeadFormPage.jsx";
import CategoryDetail from "../components/CatDetail";
import CustomBigCalendar from "../components/Calender.jsx";
import InstallCalender from "../components/InstallCalender.jsx";
import UserList from "../components/UserList.jsx";
const Routing = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  console.log(user?.role, "user routing.js");

  useEffect(() => {
    const LSUSER = JSON.parse(localStorage.getItem("user"));
    if (LSUSER) {
      dispatch(setUserInRD(LSUSER));
      axios.defaults.headers.common.Authorization = `${LSUSER?.accessToken}`;
    }
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path="*" element={<Navigate to="/" replace={true} />} />
        <Route
            path="/"
            element={
              user ? (
                  user?.role === "ADMIN" ? (
                      <ProtectedRoute component={AdminDashboard} role="ADMIN" />
                  ) : (
                      <ProtectedRoute component={UserDashboard} role="POSTER" />
                  )
              ) : (
                  <Navigate to={'/login'} replace={true} />
              )
            }
        />
        <Route
            path="/csv"
            element={<ProtectedRoute component={Csv} role="ADMIN" />}
        />
        <Route
            path="/add-lead"
            element={<ProtectedRoute component={LeadFormPage} role="ADMIN" />}
        />
        <Route
            path="/edit-lead/:id"
            element={<ProtectedRoute component={LeadFormPage} role="ADMIN" />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/surveys" element={<SurveyList />} />
        <Route path="/surveys/:surveyId" element={<SurveyDetails />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/single-survey" element={<SingleUserSurvey />} />
        <Route path="/cat-detail" element={<CategoryDetail />} />
        {/*ParentComponent*/}
        <Route
          path="/user/:userId/surveys"
          element={<ProtectedRoute component={SurveyList} />}
        />
        <Route
          path="/surveys/:userId"
          element={<ProtectedRoute component={SurveyDetails} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute component={ProfilePage} />}
        />
        <Route
          path="/add-survey/:userId"
          element={<ProtectedRoute component={SurveyForm} />}
        />
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute component={AdminDashboard} role="ADMIN" />}
        />
        <Route
          path="/notifications/:userId"
          element={<ProtectedRoute component={Notifications} />}
        />
        <Route
          path="/user-dashboard"
          element={<ProtectedRoute component={UserDashboard} />}
        />
        <Route
        path="/user-list"
        element={<ProtectedRoute component={UserList} />}
        />
        <Route
          path="/single-survey"
          element={<ProtectedRoute component={SingleUserSurvey} />}
        />
        <Route
        path="/survey-calendar"
        element ={<ProtectedRoute component={CustomBigCalendar}/>}
        />
           <Route
        path="/install-calendar"
        element ={<ProtectedRoute component={InstallCalender}/>}
        />
      </Routes>
    </div>
  );
};

export default Routing;
