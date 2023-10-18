import { Fragment, useCallback, useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../context/AuthContext";
import Loader from "../../../utils/Loader";

import "./style.scss";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import request from "../../../server";
import { ENDPOINT } from "../../../constants";
import { Form, Input, Modal, Select, Upload } from "antd";
import { useDebugValue } from "react";

const MyPostsPage = () => {
  const { loading, setLoading } = useContext(AuthContext);

  const [category, setCategory] = useState(null);
  const [photoId, setPhotoId] = useState(null);
  const [categories, setCategories] = useState(null);
  const [sortedCategories, setSortedCategories] = useState([]);
  const [userPost, setUserPost] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    let timerId = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timerId);
    };
  }, [setLoading]);

  const [form] = Form.useForm();

  const getUserPost = useCallback(async () => {
    try {
      let { data } = await request.get(`post/user?search=${search}`);
      setUserPost(data?.data);
    } catch (err) {
      toast.error(err);
    }
  }, [search]);

  useEffect(() => {
    let options;
    options = categories?.map((category) => {
      return {
        value: category?._id,
        label: category?.name,
      };
    });
    setSortedCategories(options);

    const getCategories = async () => {
      try {
        let { data } = await request.get("category");
        setCategories(data?.data);
      } catch (err) {
        toast.error(err.response.data);
      }
    };

    getCategories();
    getUserPost();
  }, [categories, getUserPost]);

  const handleOk = async () => {
    try {
      let values = await form.validateFields();
      let res = await request.post("post", {
        ...values,
        photo: photoId,
      });
      console.log(res);
    } catch (err) {
      toast.error(err.response.data);
    }
    setIsModalOpen(false);
  };

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value) => {
    console.log(value);
    setCategory(value);
  };

  const uploadPhoto = async (e) => {
    try {
      let formData = new FormData();
      formData.append("file", e.file.originFileObj);
      console.log(e.file.originFileObj);
      let response = await request.post("auth/upload", formData);
      setPhotoId(response?.data.split(".")[0].split("_")[1]);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    deletePost();
  }, []);

  const deletePost = async (id) => {
    try {
      let confirmation = confirm("Do you want to delete the post ?");
      if (confirmation) {
        await request.delete(`post/${id}`);
      }
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <section id="my-posts">
          <div className="container my-posts">
            <div className="my-posts__header">
              <h1 className="my-posts__title">All posts</h1>
              <button onClick={showModal} className="add-post-btn">
                Add post
              </button>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              placeholder="Searching..."
              className="search-input"
              type="text"
            />
            <div className="line"></div>
            <div className="posts-row">
              {userPost?.map((post) => (
                <div key={post?._id} className="post-card">
                  <Link
                    title="Click the image to read more"
                    to={`/blog-post/${post?._id}`}
                    className="post-image"
                  >
                    <img
                      src={
                        post?.photo
                          ? `${ENDPOINT}upload/${post?.photo._id}.${
                              post?.photo.name.split(".")[1]
                            }`
                          : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
                      }
                      alt=""
                    />
                  </Link>
                  <div className="post-info">
                    <p className="post-subtitle">{post?.category.name}</p>
                    <h3 className="post-title">{post?.title}</h3>
                    <p className="post-desc">{post?.description}</p>
                    <button className="edit-btn">Edit</button>
                    <button
                      onClick={() => deletePost(post?._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Modal
              title="Create your post"
              open={isModalOpen}
              onOk={handleOk}
              okText="Add post"
              onCancel={handleCancel}
            >
              <Form
                id="post-form"
                name="Post"
                form={form}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
                style={{
                  maxWidth: 700,
                }}
                autoComplete="off"
              >
                <Form.Item
                  label="Post title"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please include your title!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Category"
                  name="category"
                  rules={[
                    {
                      required: true,
                      message: "Please include your title!",
                    },
                  ]}
                >
                  <Select
                    value={category}
                    style={{
                      width: "100%",
                    }}
                    onChange={handleChange}
                    options={sortedCategories}
                  />
                </Form.Item>
                <Form.Item label="Popular tags" name="tags">
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Please include description!",
                    },
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item label="Upload an image" name="photo">
                  <Upload
                    name="avatar"
                    className="avatar-uploader"
                    showUploadList={false}
                    onChange={uploadPhoto}
                  >
                    Upload
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </section>
      )}
    </Fragment>
  );
};

export default MyPostsPage;
