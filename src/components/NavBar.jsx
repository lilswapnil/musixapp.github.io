import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function NavBar() {

    return (
        <>
        <nav>
            <ul>   
                <img className='logo' src='./logo-light.svg' alt="logo" />
                <div className="nav-links">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/my-library">My Library</NavLink></li>
                    <li><NavLink to="/account">Account</NavLink></li>
                </div>
                <div className="search-container">
                    <input type="text" placeholder="Search a song..." />
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>
            </ul>
        </nav>
        </>
    )
}