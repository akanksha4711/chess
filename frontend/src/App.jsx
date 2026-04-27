import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Lobby } from "./pages/Lobby";
import { Navbar } from "./components/Navbar";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "./slices/authSlice";
import { Room } from "./pages/Room";
import { Leaderboard } from "./pages/Leaderboard";
import { Guest } from "./pages/Guest";
import NotFoundProtectedRoute from "./components/NotFoundProtectedRoute";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="*" element={<NotFoundProtectedRoute />} />
      <Route element={<Navbar />}>
        <Route path="/" element={<div>Home page</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/guest" element={<Guest />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/rooms/:roomCode" element={<Room />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
