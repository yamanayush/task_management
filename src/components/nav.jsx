import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

const Nav = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  return (
    <div className="  mx-auto ">
      <div className="flex justify-between items-center">
        <div></div>
        {user && (
          <div className="flex items-center gap-3 pr-4">
            <div className="text-sm text-gray-700">{user.email}</div>
            <button onClick={() => dispatch(logout())} className="bg-purple-600 text-white px-3 py-1 rounded">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
