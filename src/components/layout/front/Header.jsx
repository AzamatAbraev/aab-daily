import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import useScreenSize from "../../../hooks/screenSize";

import logo from "../../../assets/images/logo.svg";
import menu from "../../../assets/images/menu.svg";

import "./Header.scss";
import { AuthContext } from "../../../context/AuthContext";
import { useEffect } from "react";

const Header = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const screenSize = useScreenSize();
  const [handleNav, setHandleNav] = useState(false);

  useEffect(() => {
    if (screenSize > 720) {
      setHandleNav(false)
    }
  }, [screenSize])

  const openNav = () => {
    setHandleNav(!handleNav);
  };

  const closeNav = () => {
    setHandleNav(false);
  }

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
                <NavLink onClick={closeNav} to="/" className="nav__link">
                  Home
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink onClick={closeNav} to="/posts" className="nav__link">
                  Blog
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink onClick={closeNav} to="/about" className="nav__link">
                  About Us
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink onClick={closeNav} to="/register" className="nav__link">
                  Register
                </NavLink>
              </li>
              {isAuthenticated ? (
                <Link onClick={closeNav} to="/account" className="nav__login__btn">
                  Account
                </Link>
              ) : (
                <Link onClick={closeNav} to="/login" className="nav__login__btn">
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
