import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

import { ROLE, TOKEN } from "../constants";
import request from "../server";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(Cookies.get(TOKEN))
  );

  const [role, setRole] = useState(localStorage.getItem(ROLE));
  const [savedPassword, setSavedPassword] = useState(null);
  const [savedUsername, setSavedUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      let { data } = await request.get("auth/me");
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    isAuthenticated && getUser();
  }, [isAuthenticated]);

  const state = {
    isAuthenticated,
    role,
    savedPassword,
    savedUsername,
    loading,
    user,
    setIsAuthenticated,
    setRole,
    setSavedPassword,
    setSavedUsername,
    setLoading,
    setUser,
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthContextProvider;
