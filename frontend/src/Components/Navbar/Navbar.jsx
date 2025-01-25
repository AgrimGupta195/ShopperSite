import React, { useContext, useRef, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../Assets/nav_dropdown.png';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (menuRef.current) {
      menuRef.current.classList.toggle('nav-menu-visible');
    }
  };

  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="Shopper Logo" />
        <p>SHOPPER</p>
      </div>
      <img 
        src={nav_dropdown} 
        className={`nav-dropdown ${dropdownOpen ? 'open' : ''}`} 
        onClick={toggleDropdown} 
        alt="Toggle Menu" 
        aria-expanded={dropdownOpen} 
        aria-controls="nav-menu" 
      />
      <ul ref={menuRef} id="nav-menu" className={`nav-menu ${dropdownOpen ? 'nav-menu-visible' : ''}`}>
        <li key="shop" onClick={() => setMenu("shop")}>
          <Link to='/' style={{ textDecoration:"none" }}>Shop</Link>
          {menu === "shop" && <hr />}
        </li>
        <li key="men" onClick={() => setMenu("men")}>
          <Link to='/mens' style={{ textDecoration: 'none' }}>Men</Link>
          {menu === "men" && <hr />}
        </li>
        <li key="women" onClick={() => setMenu("women")}>
          <Link to='/women' style={{ textDecoration: 'none' }}>Women</Link>
          {menu === "women" && <hr />}
        </li>
        <li key="kids" onClick={() => setMenu("kids")}>
          <Link to='/kids' style={{ textDecoration: 'none' }}>Kids</Link>
          {menu === "kids" && <hr />}
        </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token')?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>:
        <Link to='/login'><button>Login</button></Link>}
        <Link to='/cart'><img src={cart_icon} alt="Cart" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
