import { Fragment, memo, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import { AuthContext } from "../../../context/AuthContext";
import { ROLE, TOKEN } from "../../../constants";
import request from "../../../server";
import loginSchema from "../../../schemas/loginSchema";

import "./style.scss";
import Loader from "../../../utils/Loader";

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    loading,
    setLoading,
    setSavedUsername,
    setIsAuthenticated,
    setRole,
    setPassword,
  } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    let timerId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [setLoading]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const {
          data: { token, role },
        } = await request.post("auth/login", values);
        if (role === "user") {
          navigate("/my-posts");
        } else {
          navigate("/dashboard");
        }
        setIsAuthenticated(true);
        setRole(role);
        Cookies.set(TOKEN, token);
        request.defaults.headers.Authorization = "Bearer " + token;
        localStorage.setItem(ROLE, role);
        setSavedUsername(values.username);
        setPassword(values.password);
      } catch (err) {
        toast.error(err.response.data);
      }
    },
  });

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <section id="login">
          <div className="container login__container">
            <h1 className="login__title">Login</h1>
            <form onSubmit={formik.handleSubmit} className="login__form">
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                autoComplete="off"
                name="username"
                type="text"
                placeholder="Username"
              />
              {formik.touched.username && formik.errors.username ? (
                <p className="error-message">{formik.errors.username}</p>
              ) : null}

              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                name="password"
                className="login__password"
                type="password"
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="error-message">{formik.errors.password}</p>
              ) : null}
              <button className="login__btn" type="submit">
                Login
              </button>
            </form>
          </div>
        </section>
      )}
    </Fragment>
  );
};

const MemoLoginPage = memo(LoginPage);

export default MemoLoginPage;
