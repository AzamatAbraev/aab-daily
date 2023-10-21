import { Fragment, useCallback, useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../context/AuthContext";
import Loader from "../../../utils/Loader";
import { UploadOutlined } from "@ant-design/icons";

import "./style.scss";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import request from "../../../server";
import { ENDPOINT } from "../../../constants";
import { Button, Form, Input, Modal, Select, Upload } from "antd";

const MyPostsPage = () => {
  const { loading, setLoading } = useContext(AuthContext);

  const [category, setCategory] = useState(null);
  const [photoId, setPhotoId] = useState(null);
  const [categories, setCategories] = useState(null);
  const [sortedCategories, setSortedCategories] = useState([]);
  const [userPost, setUserPost] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

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

  const getCategories = useCallback(async () => {
    try {
      let { data } = await request.get("category");
      setCategories(data?.data);
    } catch (err) {
      toast.error(err.response.data);
    }
  }, []);

  useEffect(() => {
    let options;
    options = categories?.map((category) => {
      return {
        value: category?._id,
        label: category?.name,
      };
    });
    setSortedCategories(options);

    getCategories();
    getUserPost();
  }, [categories, getUserPost, getCategories]);

  const uploadPhoto = useCallback(async (e) => {
    try {
      let formData = new FormData();
      formData.append("file", e.file.originFileObj);
      console.log(e.file.originFileObj);
      let { data } = await request.post("upload", formData);
      setPhotoId(data?._id);
    } catch (err) {
      console.log(err.response.data);
    }
  }, []);

  const handleOk = async () => {
    try {
      let values = await form.validateFields();
      if (selected === null) {
        await request.post("post", {
          ...values,
          photo: photoId,
        });
      } else {
        await request.put(`post/${selected}`, {...values, photo: photoId});
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response.data);
    }
    setIsModalOpen(false);
  };

  const showModal = useCallback(() => {
    form.resetFields();
    setIsModalOpen(true);
  }, [form]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  const handleChange = (value) => {
    console.log(value);
    setCategory(value);
  };

  useEffect(() => {
    deletePost();
  }, []);

  const deletePost = (id) => {
    try {
      request.delete(`post/${id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  const editPost = async (id) => {
    console.log(id);
    try {
      showModal(true);
      setSelected(id);
      let { data } = await request.get(`post/${id}`);
      form.setFieldsValue(data);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(selected);

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
                    <button
                      onClick={() => editPost(post?._id)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      // onClick={() => deletePost(post?._id)}
                      onClick={() =>
                        Modal.confirm({
                          title: "Do you want to delete the post ?",
                          onOk: () => deletePost(post?._id),
                        })
                      }
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Modal
              title={selected === null ? "Create your post" : "Edit your post"}
              open={isModalOpen}
              onOk={handleOk}
              okText={selected === null ? `Add post` : "Save post"}
              onCancel={handleCancel}
              width={700}
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
                    showUploadList={true}
                    onChange={uploadPhoto}
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
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
