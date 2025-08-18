import Layout from "./components/ProtectedLayout/index";
import Routing from "./Page/Routing";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const user = useSelector((state) => state.user?.user);
  console.log(user?.role, "user apjsx");
  return (
    <div>
      {user ? (
        <Layout>
          <ToastContainer/>
          <Routing />
        </Layout>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
