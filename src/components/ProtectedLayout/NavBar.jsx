
import { IoIosSearch, IoMdAdd } from "react-icons/io";
import { RiMenu2Fill } from "react-icons/ri";
import {useSelector } from "react-redux";
import {useNavigate} from "react-router-dom";



const Navbar = ({ toggleSidebar }) => {
   const user = useSelector((state) => state.user?.user);
    const navigate = useNavigate();

 
  return (
    <nav className="gap-6 relative py-6 capitalize text-base flex md:relative top-0 z-[15]  items-start sm:items-center">
      <ul className="flex max-w-max items-center gap-4 ">
        <li
          onClick={toggleSidebar}
          className=" transition-all duration-300 rounded-full cursor-pointer hover:text-primary"
        >
          <RiMenu2Fill size={20} className="text-lg sm:text-xl" />
        </li>
      </ul>
        
      { user?.role === "ADMIN"
                      ? 
                       <div className="flex flex-col flex-1 justify-between   sm:flex-row items-center gap-5 ">
                      <div className="relative w-full sm:w-[65%] md:w-[75%]">
                        <input
                          id="searchQuery"
                          type="text"
                          // value={searchQuery}
                          // onChange={(e) => setSearchQuery(e.target.value)}
                          className=" w-full px-10 py-2 border rounded-full bg-white text-gray-700"
                          placeholder="Search"
                        />
                        <IoIosSearch className="w-6 h-6 absolute top-2 left-2 text-gray-500" />
                      </div>
                      <div
                        onClick={() => navigate("/register")}
                        className=" cursor-pointer bg-green-600 md:py-3 py-2 lg:py-2 w-full sm:w-[35%] flex items-center justify-center gap-2 px-2 border rounded-full"
                      >
                        <IoMdAdd className="lg:w-5 w-4 h-4 lg:h-5 text-white" />
                        <p className="font-medium sm:text-[12px] md:text-sm lg:text-lg text-white">Add New User</p>
                      </div>
                    </div> 
                      :  
                      <div className="flex flex-col flex-1 justify-between   sm:flex-row items-center gap-5 ">
                      <div className="relative w-full sm:w-[65%] md:w-[75%]">
                        <input
                          id="searchQuery"
                          type="text"
                          // value={searchQuery}
                          // onChange={(e) => setSearchQuery(e.target.value)}
                          className=" w-full px-10 py-2 border rounded-full bg-white text-gray-700"
                          placeholder="Search"
                        />
                        <IoIosSearch className="w-6 h-6 absolute top-2 left-2 text-gray-500" />
                      </div>
                      <div
                        onClick={() => navigate("/add-survey/:userId")}
                        className=" cursor-pointer bg-green-600 md:py-3 py-2 lg:py-2 w-full sm:w-[35%] flex items-center justify-center gap-2 px-2 border rounded-full"
                      >
                        <IoMdAdd className="lg:w-5 w-4 h-4 lg:h-5 text-white" />
                        <p className="font-medium sm:text-[12px] md:text-sm lg:text-lg text-white">Create New Survey</p>
                      </div>
                    </div> 
                  }
         
    
      {/* <div className="md:block hidden">
      </div> */}
     
    </nav>
  );
};

export default Navbar;
