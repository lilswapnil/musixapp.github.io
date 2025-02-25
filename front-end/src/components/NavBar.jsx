import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import logo from '../assets/logo-light.svg';

export default function NavBar() {
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = () => {
        if (searchInput.trim()) {
            navigate(`/search?query=${searchInput}`);
        }
    };

    const isSearchPage = location.pathname === '/search';

    return (
        <>
        <nav>
            <ul>   
                <img className='logo' src={ logo } alt="logo" />
                <div className="nav-links">
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/my-library">Library</NavLink></li>
                    <li><NavLink to="/account">Account</NavLink></li>
                </div>
                <div className={`search-container ${isSearchPage ? 'active' : ''}`}>
                    <input 
                        type="text" 
                        placeholder="Search a song..." 
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
    );
}