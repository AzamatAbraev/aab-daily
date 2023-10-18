import { Link, useNavigate } from "react-router-dom";
import { Fragment, useContext, useEffect, useState } from "react";
import { Form, Input } from "antd";
import { toast } from "react-toastify";

import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { ROLE, TOKEN } from "../../constants";
import Loader from "../../utils/Loader";

import request from "../../server";

import "./style.scss";

const AccountPage = () => {
  const { setIsAuthenticated, setRole, setLoading, loading, user, getUser } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [file, setFile] = useState();
  const [password, setPassword] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [setLoading]);

  useEffect(() => {
    form.setFieldsValue(user);
    setPhoto(user?.photo);
  }, [user, form]);

  const logout = async () => {
    let confirmation = confirm("Do you want to log out ?");
    if (confirmation) {
      Cookies.remove(TOKEN);
      localStorage.removeItem(ROLE);
      setIsAuthenticated(false);
      setRole(null);
      navigate("/");
    }
  };

  const onFinish = async (values) => {
    console.log(values);
    try {
      await request.put("auth/details", values);
      toast.success("Saved successfully");
      navigate("/");
      getUser();
    } catch (err) {
      console.log(err);
    } finally {
      Form.setFieldsValue();
    }
  };

  const resetPassword = () => {
    setPassword(!password);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const password = {
      currentPassword: e.target.currentPassword.value,
      newPassword: e.target.newPassword.value,
    };
    try {
      await request.put("auth/password", password);
      toast.success("Password changed");
      setPassword(false);
    } catch (err) {
      console.log(err.response);
      toast.error(err.response.data);
    }
  };

  const handleChange = (e) => {
    console.log(e);
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <section id="register">
          <div className="container register__container">
            <h1 className="login__title">Account</h1>
            <div className="form-main">
              <div className="form-photo">
                <div className="upload-image">
                  <img
                    src={file}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <form>
                  <input
                    onChange={handleChange}
                    className="form-input"
                    type="file"
                    placeholder="Set profile picture"
                  />
                  <button className="upload-btn" type="submit">
                    Upload Image
                  </button>
                </form>
                <div className="logout-container">
                  <p className="logout-label">Do you want to log out ? </p>
                  <Link className="logout-btn" onClick={logout} type="primary">
                    Logout
                  </Link>
                </div>
                <div className="logout-container">
                  <p className="logout-label">Password change ? </p>
                  <Link
                    title="Click to reset your password"
                    className="password-btn"
                    onClick={resetPassword}
                    type="primary"
                  >
                    Reset
                  </Link>
                </div>
                {password ? (
                  <form
                    onSubmit={changePassword}
                    name="password"
                    style={{
                      maxWidth: "90%",
                    }}
                    autoComplete="off"
                  >
                    <input
                      required
                      type="password"
                      className="form-input"
                      placeholder="Current password"
                      name="currentPassword"
                    />
                    <input
                      required
                      type="password"
                      placeholder="New password"
                      name="newPassword"
                      className="form-input"
                    />
                    <button type="submit" className="reset-btn">
                      Reset
                    </button>
                  </form>
                ) : null}
              </div>
              <Form
                className="account-form"
                form={form}
                name="basic"
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
                // style={{
                //   maxWidth: "90%",
                // }}
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  label="First name"
                  name="first_name"
                  rules={[
                    {
                      required: true,
                      message: "Please fill!",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
                <Form.Item
                  label="Last name"
                  name="last_name"
                  rules={[
                    {
                      required: true,
                      message: "Please fill !",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please fill !",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please fill !",
                    },
                  ]}
                >
                  <Input className="form-input" />
                </Form.Item>
                <Form.Item label="Address" name="address">
                  <Input className="form-input" />
                </Form.Item>
                <Form.Item label="Phone number" name="phoneNumber">
                  <Input className="form-input" />
                </Form.Item>
                <Form.Item
                  label="Description"
                  name="info"
                  rules={[
                    {
                      required: true,
                      message: "Please fill !",
                    },
                  ]}
                >
                  <Input.TextArea className="text-area form-input" />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    span: 24,
                  }}
                >
                  <button className="save-btn" type="submit">
                    Save
                  </button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </section>
      )}
    </Fragment>
  );
};

export default AccountPage;
