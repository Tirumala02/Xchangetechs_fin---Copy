import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between p-5 font-medium bg-gray-900">
      <div className="container m-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={assets.logo} className="w-48" alt="Logo" />
        </Link>

        {/* Navigation Links */}
        <ul className="hidden sm:flex gap-5 text-sm text-gray-200">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>HOME</p>
          </NavLink>
          <NavLink to="/collection" className="flex flex-col items-center gap-1">
            <p>COLLECTION</p>
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
          </NavLink>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-6 z-10">
          {/* Search Icon */}
          <img
            onClick={() => {
              setShowSearch(true);
              navigate('/collection');
            }}
            src={assets.search_icon}
            className="w-5 cursor-pointer invert"
            alt="Search"
          />

          {/* Profile Icon */}
          <div className="group relative flex items-center gap-4">
            <img
              onClick={() => (token ? null : navigate('/login'))}
              className="w-5 cursor-pointer invert"
              src={assets.profile_icon}
              alt="Profile"
            />
            {token && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p className="cursor-pointer hover:text-orange-500">
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate('/orders')}
                    className="cursor-pointer hover:text-orange-500"
                  >
                    Orders
                  </p>
                  <p
                    onClick={logout}
                    className="cursor-pointer hover:text-orange-500"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="relative flex items-center">
            <img
              src={assets.cart_icon}
              className="w-6 min-w-5 invert"
              alt="Cart"
            />
            <p className="absolute top-[-5px] right-[-5px] w-4 text-center leading-4 bg-orange-500 text-white rounded-full text-[10px]">
              {getCartCount()}
            </p>
          </Link>

          {/* Hamburger Menu for Mobile */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden invert"
            alt="Menu"
          />
        </div>

        {/* Sidebar Menu for Small Screens */}
        <div
          className={`absolute z-10 top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
            visible ? 'w-full' : 'w-0'
          }`}
        >
          <div className="flex z-10 flex-col text-gray-900">
            <div
              onClick={() => setVisible(false)}
              className="flex justify-between items-center gap-4 p-3 cursor-pointer"
            >
              <img
                className="h-4 rotate-180 invert"
                src={assets.dropdown_icon}
                alt="Back"
              />
              <p>Back</p>
              <img
                className="h-4 rotate-180 invert"
                src={assets.cross_icon}
                alt="Close"
              />
            </div>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/"
            >
              HOME
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/collection"
            >
              COLLECTION
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/about"
            >
              ABOUT
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
              to="/contact"
            >
              CONTACT
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
