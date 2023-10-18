import { Fragment, memo, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";

import { AuthContext } from "../../../context/AuthContext";
import registerSchema from "../../../schemas/registerSchema";
import Loader from "../../../utils/Loader";
import request from "../../../server";

import "./style.scss";

const RegisterPage = () => {
  const { setSavedUsername, loading, setLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setLoading(true);
    let timerId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timerId)
    }
  }, [setLoading]);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      confirm: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        if (values.password === values.confirm) {
          const response = await request.post(`/auth/register`, values);
          console.log(response);
          toast.success("You are registrated !");
          setSavedUsername(values.first_name);
          navigate("/login");
        } else {
          toast.error("Please confirm your password");
        }
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
        <section id="register">
          <div className="container register__container">
            <h1 className="login__title">Register</h1>
            <form
              autoComplete="off"
              onSubmit={formik.handleSubmit}
              className="login__form"
            >
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.first_name}
                type="text"
                name="first_name"
                placeholder="First name"
              />
              {formik.touched.first_name && formik.errors.first_name ? (
                <p className="error-message">{formik.errors.first_name}</p>
              ) : null}
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.last_name}
                type="text"
                name="last_name"
                placeholder="Last name"
              />
              {formik.touched.last_name && formik.errors.last_name ? (
                <p className="error-message">{formik.errors.last_name}</p>
              ) : null}
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                required
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
                required
                name="password"
                className="login__password"
                type="password"
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="error-message">{formik.errors.password}</p>
              ) : null}
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirm}
                required
                name="confirm"
                className="confirm__password"
                type="password"
                placeholder="Confirm"
              />
              {formik.touched.confirm && formik.errors.confirm ? (
                <p className="error-message">{formik.errors.confirm}</p>
              ) : null}
              <button className="login__btn" type="submit">
                Register
              </button>
            </form>
          </div>
        </section>
      )}
    </Fragment>
  );
};

const MemoRegisterPage = memo(RegisterPage);

export default MemoRegisterPage;
