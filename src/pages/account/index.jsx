import { Fragment, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { toast } from "react-toastify";
import { Form, Input, Modal, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import { AuthContext } from "../../context/AuthContext";
import { uploadImage } from "../../redux/actions/my-posts";
import { getCategoryImage } from "../../utils/getImage";
import Loader from "../../utils/Loader";
import request from "../../server";

import "./style.scss";

const AccountPage = () => {
  const { logout, setLoading, loading, user, getUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [password, setPassword] = useState(false);
  const [form] = Form.useForm();
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { imageData, imageLoading } = useSelector((state) => state.myPosts);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [setLoading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    form.setFieldsValue(user);
    setPhoto(user?.photo);
  }, [user, form, imageData]);

  const onFinish = async (values) => {
    try {
      await request.put("auth/details", { ...values, photo: imageData });
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
      toast.error(err.response.data);
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <section id="register">
          <div className="container register__container">
            <Tabs className="tab">
              <TabList className="tab-account">
                <Tab className="tab-item tab1">Edit account info</Tab>
                <Tab className="tab-item tab2">Set profile picture</Tab>
              </TabList>

              <TabPanel>
                <h1 className="login__title">Account</h1>
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
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  {/* <div
                    style={{ padding: "10px", background: "grey" }}
                    className="form-image"
                  >
                    <img
                      style={{ width: "100%" }}
                      src={`${ENDPOINT}upload/${user?.photo}.svg`}
                      alt="Profile picture"
                    />
                  </div> */}
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
                <div className="change-password">
                  <div className="logout-container">
                    <p className="logout-label">Do you want to log out ? </p>
                    <Link
                      className="logout-btn"
                      onClick={() =>
                        Modal.confirm({
                          title: "Do you want to log out ?",
                          onOk: () => logout(navigate),
                        })
                      }
                      type="primary"
                    >
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
                      className="change-password-form"
                      style={{
                        maxWidth: "100%",
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
              </TabPanel>
              <TabPanel>
                <h1 className="login__title">Profile Picture</h1>
                <div className="form-photo">
                  {/* <Upload
                    name="avatar"
                    className="form-uploader"
                    showUploadList={true}
                    onChange={uploadPhoto}
                  >
                    <Button
                      className="form-uploader-btn"
                      icon={<UploadOutlined />}
                    >
                      Upload an image
                    </Button>
                  </Upload> */}
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="category-upload"
                    showUploadList={false}
                    onChange={(e) =>
                      dispatch(uploadImage(e.file.originFileObj))
                    }
                  >
                    <div className="image-box">
                      {imageLoading ? (
                        <LoadingOutlined />
                      ) : imageData ? (
                        <img
                          className="upload-image"
                          src={getCategoryImage(imageData)}
                          alt="avatar"
                        />
                      ) : (
                        <div>
                          <PlusOutlined />
                          <div
                            style={{
                              marginTop: 8,
                            }}
                          >
                            Upload
                          </div>
                        </div>
                      )}
                    </div>
                  </Upload>
                </div>
              </TabPanel>
            </Tabs>
            <div className="form-main"></div>
          </div>
        </section>
      )}
    </Fragment>
  );
};

export default AccountPage;
