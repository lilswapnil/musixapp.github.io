import NavBar from "./pages/NavBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div>
            <NavBar />
            <Outlet />
        </div>
    )
}