import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import useScreenSize from "../../../hooks/screenSize";

import logo from "../../../assets/images/logo.svg";
import menu from "../../../assets/images/menu.svg";

import "./Header.scss";
import { AuthContext } from "../../../context/AuthContext";

const Header = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [handleNav, setHandleNav] = useState(false);
  const screenSize = useScreenSize();

  const openNav = () => {
    setHandleNav(!handleNav);
  };
  return (
    <header>
      <nav className="nav">
        <div className="container nav__container">
          <div className="nav__logo">
            {isAuthenticated ? (
              <Link className="nav__logo" to="/my-posts">
                My posts
              </Link>
            ) : (
              <Link to="/" className="logo__link">
                <img src={logo} alt="Website logo" />
              </Link>
            )}
          </div>
          <ul className="nav__menu">
            <li className="nav__item">
              <NavLink to="/" className="nav__link">
                Home
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/posts" className="nav__link">
                Blog
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/about" className="nav__link">
                About Us
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/register" className="nav__link">
                Register
              </NavLink>
            </li>
            <li className="nav__item">
              {isAuthenticated ? (
                <Link to="/account" className="nav__login__btn">
                  Account
                </Link>
              ) : (
                <Link to="/login" className="nav__login__btn">
                  Login
                </Link>
              )}
            </li>
          </ul>
          <div className="hamburger">
            <button onClick={openNav} className="nav__control__btn">
              <img src={menu} alt="Menu" />
            </button>
          </div>
          {handleNav && screenSize <= 720 ? (
            <div className="nav__res__menu">
              <li className="nav__item">
                <NavLink to="/" className="nav__link">
                  Home
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink to="/posts" className="nav__link">
                  Blog
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink to="/about" className="nav__link">
                  About Us
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink to="/register" className="nav__link">
                  Register
                </NavLink>
              </li>
              {isAuthenticated ? (
                <Link to="/account" className="nav__login__btn">
                  Account
                </Link>
              ) : (
                <Link to="/login" className="nav__login__btn">
                  Login
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
};

export default Header;
