import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import { FaChessKnight } from "react-icons/fa";
import { TfiCup } from "react-icons/tfi";
import { IoLogOut } from "react-icons/io5";
import { IoLogIn } from "react-icons/io5";

export const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <div className="bg-[url()] bg-cover bg-center h-screen w-screen">
      <div className="p-6 bg-blue-600 text-white font-bold text-2xl flex flex-row justify-between">
        <div>
          <Link to="/lobby">
            <div className="flex items-center gap-2">
              <FaChessKnight size={32} />
              Lobby
            </div>
          </Link>
        </div>
        <div>
          {user ? (
            <div className="flex gap-8">
              <NavLink to="/leaderboard">
                <div className="flex items-center gap-2">
                  <TfiCup size={32} />
                  Leaderboard
                </div>
              </NavLink>
              <button onClick={handleLogout}>
                <div className="flex items-center gap-2">
                  <IoLogOut size={32} />
                  Logout
                </div>
              </button>
            </div>
          ) : (
            <div className="flex flex-row gap-8">
              <Link to="/login">
                <div className="flex items-center gap-2">
                  <IoLogIn size={32} />
                  Login
                </div>
              </Link>
              <Link to="/signup">
                <div className="flex items-center gap-2">Signup</div>
              </Link>
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
