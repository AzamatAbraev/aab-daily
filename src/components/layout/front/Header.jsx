import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import useScreenSize from "../../../hooks/screenSize";

import logo from "../../../assets/images/logo.svg";
import menu from "../../../assets/images/menu.svg";

import "./Header.scss";
import { AuthContext } from "../../../context/AuthContext";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchLanguage } from "../../../redux/actions/language";

const Header = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const screenSize = useScreenSize();
  const [handleNav, setHandleNav] = useState(false);

  const dispatch = useDispatch();
  const { language: lang, languageType } = useSelector(
    (state) => state.language
  );

  useEffect(() => {
    if (screenSize > 720) {
      setHandleNav(false);
    }
  }, [screenSize]);

  const openNav = () => {
    setHandleNav(!handleNav);
  };

  const closeNav = () => {
    setHandleNav(false);
  };

  return (
    <header id="header">
      <nav className="nav">
        <div className="container nav__container">
          <div className="nav__logo">
            {isAuthenticated ? (
              <Link className="nav__logo" to="/my-posts">
                {lang.myPosts}
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
                {lang.home}
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/posts" className="nav__link">
                Blog
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/about" className="nav__link">
                {lang.about}
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/register" className="nav__link">
                {lang.register}
              </NavLink>
            </li>
            <li className="nav__item">
              {isAuthenticated ? (
                <Link to="/account" className="nav__login__btn">
                  Account
                </Link>
              ) : (
                <Link to="/login" className="nav__login__btn">
                  {lang.login}
                </Link>
              )}
            </li>
            <li className="nav__item">
              <select
                onChange={(e) => dispatch(switchLanguage(e.target.value))}
                value={languageType}
              >
                <option value="en">EN</option>
                <option value="uz">UZ</option>
              </select>
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
                  {lang.home}
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink onClick={closeNav} to="/posts" className="nav__link">
                  Blog
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink onClick={closeNav} to="/about" className="nav__link">
                  {lang.about}
                </NavLink>
              </li>
              <li className="nav__item">
                <NavLink
                  onClick={closeNav}
                  to="/register"
                  className="nav__link"
                >
                  {lang.register}
                </NavLink>
              </li>
              {isAuthenticated ? (
                <Link
                  onClick={closeNav}
                  to="/account"
                  className="nav__login__btn"
                >
                  Account
                </Link>
              ) : (
                <Link
                  onClick={closeNav}
                  to="/login"
                  className="nav__login__btn"
                >
                  {lang.login}
                </Link>
              )}
              <li className="nav__item">
                <select
                  onChange={(e) => dispatch(switchLanguage(e.target.value))}
                  value={languageType}
                >
                  <option value="en">EN</option>
                  <option value="uz">UZ</option>
                </select>
              </li>
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
};

export default Header;
