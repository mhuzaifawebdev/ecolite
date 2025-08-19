import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { SiGooglesheets } from "react-icons/si";
import { GoCalendar, GoGitCompare, GoPackage, GoPencil, GoPerson, GoShieldCheck } from "react-icons/go";
import { IoLogOutOutline, IoMenu } from "react-icons/io5";
import { IoMdNotifications } from "react-icons/io";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import store from "../../Store";
import { setUserInRD } from "../../Store/Slices/userSlice";
import axios from "axios";
import { baseUrlImg } from "../../Config/Urls";
import { dataMatch, eprStatuses, installationStatuses, leadStatuses } from "../../utils/enums.utils.js";
import navigationGuard from "../../utils/navigationGuard";

const Sidebar = ({ isSidebarCompress, setIsSidebarCompress }) => {
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user?.user);
  const navigate = useNavigate();

  // State management
  const [openDropdown, setOpenDropdown] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 786);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get current path with query params
  const currentPath = pathname + window.location.search;

  // Sidebar links configuration
  const adminLinks = [
    {
      icon: <MdOutlineDashboardCustomize />,
      name: "Dashboard",
      slug: "/",
      isDropdown: false,
    },
    {
      icon: <GoPerson />,
      name: "Users",
      slug: "/user-list",
      isDropdown: false,
    },
    {
      icon: <GoPencil />,
      name: "Surveys",
      slug: "/surveys",
      isDropdown: false,
    },
    {
      icon: <SiGooglesheets />,
      name: "Leads",
      isDropdown: true,
      subLinks: [
        { name: "All Leads", slug: "/csv" },
        ...leadStatuses.map((status) => ({
          name: status.name,
          slug: `/csv?status=${encodeURIComponent(status.value)}`,
        })),
      ],
    },
    {
      icon: <GoPackage />,
      name: "Data Match",
      isDropdown: true,
      subLinks: [
        ...dataMatch.map((status) => ({
          name: status.name,
          slug: `/csv?dataMatchStatus=${encodeURIComponent(status.value)}`,
        })),
      ],
    },
    {
      icon: <GoShieldCheck />,
      name: "EPR Status",
      isDropdown: true,
      subLinks: [
        ...eprStatuses.map((status) => ({
          name: status.name,
          slug: `/csv?eprStatus=${encodeURIComponent(status.value)}`,
        })),
      ],
    },
    {
      icon: <GoGitCompare />,
      name: "Install Status",
      isDropdown: true,
      subLinks: [
        ...installationStatuses.map((status) => ({
          name: status.name,
          slug: `/csv?installStatus=${encodeURIComponent(status.value)}`,
        })),
      ],
    },
    {
      icon: <GoCalendar />,
      name: "Survey Calendar",
      slug: "/survey-calendar",
      isDropdown: false,
    },
    {
      icon: <GoCalendar />,
      name: "Install Calendar",
      slug: "/install-calendar",
      isDropdown: false,
    },
  ];

  const userLinks = [
    {
      icon: <MdOutlineDashboardCustomize />,
      name: "Dashboard",
      slug: "/user-dashboard",
      isDropdown: false,
    },
    {
      icon: <IoMdNotifications />,
      name: "Notification",
      slug: "/notifications",
      isDropdown: false,
    },
  ];

  // Effects
  useEffect(() => {
    const { profileImage } = JSON.parse(localStorage.getItem("user")) || {};
    setProfileImage(profileImage || null);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 786;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const links = user?.role === "ADMIN" ? adminLinks : userLinks;
    const activeDropdown = links.find(
      item => item.isDropdown && item.subLinks?.some(subItem => subItem.slug === currentPath)
    );
    setOpenDropdown(activeDropdown?.name || null);
  }, [currentPath, user?.role]);

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem("user");
    store.dispatch(setUserInRD(null));
    axios.defaults.headers.common.Authorization = null;
    navigate("/login");
  };

  const toggleDropdown = (itemName) => {
    setOpenDropdown(prev => prev === itemName ? null : itemName);
  };

  const navigateTo = async (slug) => {
    // Check if navigation should be prevented
    const shouldPrevent = await navigationGuard.shouldPreventNavigation();
    
    // If shouldPrevent is false or undefined, proceed with navigation
    if (!shouldPrevent) {
      navigate(slug);
      if (isMobile) setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarCompress(prev => !prev);
  };

  // Derived values
  const linksToRender = user?.role === "ADMIN" ? adminLinks : userLinks;
  const profileImageURL = profileImage ? `${baseUrlImg}/${profileImage}` : "";

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          onClick={toggleMobileMenu}
          className="fixed top-4 right-2 z-50 p-2 bg-primaryHover rounded-md text-white shadow-lg"
        >
          <IoMenu className="h-6 w-6" />
        </button>
      )}

      {/* Overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`z-50 bg-primary flex flex-col justify-between min-h-screen h-full top-0 left-0 
          transition-all duration-300 overflow-hidden 
          ${isMobile ? 
            `fixed w-64 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}` : "fixed w-64"
           
          }`
        }
      >
        {/* Header */}
        <div className="overflow-y-auto flex-1">
          <div className="cursor-pointer mb-2 p-4">
            <img
              src="/image/ecolit-logo.png"
              alt="Logo"
             />
          </div>

          {/* Navigation Links */}
          <ul className="py-2 capitalize px-4">
            {linksToRender.map((item, index) => {
              const isActive = currentPath === item.slug;
              const isDropdownSelected = openDropdown === item.name;
              const hasActiveSubLink = item.subLinks?.some(subItem => subItem.slug === currentPath);

              return (
                <li key={index} className="py-1">
                  {item.isDropdown ? (
                    <>
                      <div
                        onClick={() => toggleDropdown(item.name)}
                        className={`cursor-pointer flex items-center justify-between px-3 py-3 rounded-lg ${
                          isDropdownSelected || hasActiveSubLink
                            ? "bg-white text-primaryHover"
                            : "bg-primaryHover text-white"
                        }`}
                      >
                        <div className="flex items-center gap-4 text-xl">
                          <span>
                            {React.cloneElement(item.icon, {
                              color: (isDropdownSelected || hasActiveSubLink) ? "#002a30" : "#fff",
                            })}
                          </span>
                          <span className="block text-sm font-bold">
                            {item.name}
                          </span>
                        </div>
                        <span className={`transition-transform duration-200 ${isDropdownSelected ? "" : "rotate-180"}`}>
                          ▲
                        </span>
                      </div>
                      {isDropdownSelected && (
                        <ul className="ml-6 mt-1">
                          {item.subLinks.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <div
                                onClick={() => navigateTo(subItem.slug)}
                                className={`px-3 py-2 cursor-pointer ${
                                  currentPath === subItem.slug
                                    ? "text-primaryHover font-bold"
                                    : "text-white hover:text-primaryHover"
                                }`}
                              >
                                {subItem.name}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <div
                      className={`cursor-pointer flex items-center gap-4 px-3 py-3 rounded-lg ${
                        isActive ? "bg-white text-primaryHover" : "bg-primaryHover text-white"
                      }`}
                      onClick={() => navigateTo(item.slug)}
                    >
                      <span className="text-xl">
                        {React.cloneElement(item.icon, {
                          color: isActive ? "#002a30" : "#fff",
                        })}
                      </span>
                      <span className="block text-sm font-bold">
                        {item.name}
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-center gap-4 p-4 bg-primary border-t border-primaryHover">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-primaryHover hover:text-primaryHover hover:bg-white transition-colors"
            title="Logout"
          >
            <IoLogOutOutline className="h-6 w-6" />
          </button>
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-primaryHover hover:text-primaryHover hover:bg-white transition-colors"
            title={isSidebarCompress ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <img
              src={profileImageURL}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.target.src = "";
              }}
            />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;