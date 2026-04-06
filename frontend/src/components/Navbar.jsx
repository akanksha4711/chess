import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Outlet } from "react-router-dom";
import { logout } from "../slices/authSlice";

export const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logout());
  }

  return (
    <div className="bg-[url()] bg-cover bg-center h-screen w-screen">
      <div className="p-4 bg-blue-400 flex flex-row justify-between">
        <div>
          <Link to="/lobby">Lobby</Link>
        </div>
        <div>
          {user ? (
            <div className="flex gap-4">
              <NavLink to="/leaderboard">Leaderboard</NavLink>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="flex flex-row gap-4">
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        {/* <div className="absolute inset-0 bg-white opacity-10"></div> */}
        <Outlet />
      </div>
    </div>
  );
};
