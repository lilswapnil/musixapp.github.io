import { useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function NavBar() {
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();
    // Add search functionality here
    const handleSearch = () => {
        if (searchInput.trim()) {
            navigate(`/search?query=${searchInput}`);
            // Add search functionality here
        }
    }

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
                    <input 
                        type="text" 
                        placeholder="Search a song..." 
                        // Adds value and onChange here
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <FontAwesomeIcon 
                        icon={faSearch} 
                        className="search-icon" 
                        onClick={handleSearch}
                    />
                </div>
            </ul>
        </nav>
        </>
    )
}