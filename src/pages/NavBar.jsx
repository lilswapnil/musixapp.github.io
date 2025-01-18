import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
    <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/my-library">My Library</Link></li>
            <li><Link to="/account">Account</Link></li>
        </ul>
    </nav>
    )
}