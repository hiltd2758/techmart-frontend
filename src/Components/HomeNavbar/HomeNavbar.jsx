import React from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../../Context/AuthContext";

const HomeNavbar = () => {
  const { user, logout } = useAuth();
  return (
    <div className="w-full">
      <div className="lg:container w-full mx-auto ">
        <div className="flex items-center justify-between">
          <div className="logo_wrapper">
            <Link to={"/"}>
              <h3 className="text-[3.5rem] text-[#484848] uppercase font-normal">
                TechMart
              </h3>
            </Link>
          </div>
          {/* navbar */}
          <nav className="flex items-center gap-[3.5rem]">
            <NavLink
              to={"/"}
              className="text-base text-[#484848] capitalize font-normal font-poppins"
            >
              home
            </NavLink>
            <NavLink
              to={"/"}
              className="text-base text-[#484848] capitalize font-normal font-poppins"
            >
              deals
            </NavLink>
            <NavLink
              to={"/"}
              className="text-base text-[#484848] capitalize font-normal font-poppins"
            >
              new arrivals
            </NavLink>

            {user ? (
              // User Dropdown / Avatar
              <div className="relative group">
                <button className="flex items-center gap-3 focus:outline-none">
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
                    {/* Placeholder for now if no avatar URL */}
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                    )}
                  </div>
                  <span className="text-base text-[#484848] font-medium hidden sm:block">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  {user.roles && user.roles.includes("ADMIN") && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Admin Dashboard
                    </Link>
                  )}

                  <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    My Profile
                  </Link>
                  <Link to="/account/order-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Orders
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              // Sign In / Sign Up
              <>
                <NavLink
                  to={"/login"}
                  className="text-base text-[#484848] capitalize font-normal font-poppins"
                >
                  sign in
                </NavLink>
                <NavLink
                  to={"/register"}
                  className="text-base text-[#484848] capitalize font-normal font-poppins px-5 py-2.5 bg-black text-white rounded-lg"
                >
                  sign up
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HomeNavbar;
