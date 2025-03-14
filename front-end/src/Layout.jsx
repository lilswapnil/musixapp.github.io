import NavBar from "./components/NavBar";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const hideNavBar = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div>
      {!hideNavBar && <NavBar />}
      <Outlet />
    </div>
  );
}