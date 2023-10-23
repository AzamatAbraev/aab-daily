import { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Flex,
  Image,
  Pagination,
  Space,
  Table,
  Modal,
  Form,
  Input,
  Upload,
  Select,
} from "antd";
import Search from "antd/es/input/Search";

import {
  changePage,
  searchPosts,
  getPosts,
  showModal,
  controlModal,
  sendPosts,
  deletePost,
  editPost,
  uploadImage,
} from "../../../redux/actions/post";
import { ENDPOINT, POSTS_LIMIT } from "../../../constants";
import { Link } from "react-router-dom";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getCategoryImage } from "../../../utils/getImage";
import request from "../../../server";
import { useState } from "react";

const AllPostsPage = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);

  const {
    total,
    loading,
    activePage,
    search,
    isModalOpen,
    isModalLoading,
    selected,
    imageLoading,
    imageData,
    posts,
  } = useSelector((state) => state.post);

  useEffect(() => {
    const getCategories = async () => {
      let {data: {data}} = await request.get("category");
      let options = data?.map((category) => {
        return {
          value: category?._id,
          label: category?.name,
        }
      })
      setOptions(options);
    }
    getCategories()
  }, [])



  useEffect(() => {
    total === 0 && dispatch(getPosts());
  }, [dispatch, total]);

  const handleOk = async () => {
    const values = await form.validateFields();
    values.photo = imageData._id;
    dispatch(sendPosts({ values, selected, activePage, search, form }));
  };

  const closeModal = () => {
    dispatch(controlModal(false));
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "photo",
      key: "photo",
      render: (data) => {
        return (
          <Image
            height={50}
            width={50}
            alt=""
            src={`${ENDPOINT}upload/${data?._id}.${data?.name?.split(".")[1]}`}
          />
        );
      },
    },
    {
      title: "Post title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (data) => <p className="table-info">{data.slice(0, 50)}...</p>,
    },
    {
      title: "Posted by",
      dataIndex: "last_name",
      key: "last_name",
      render: (data, category) => {
        return (
          <p className="table-info">
            {category?.user?.first_name} {category?.user?.last_name}
          </p>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (data) => (
        <Space size="middle">
          <Button onClick={() => dispatch(editPost(form, data))} type="primary">
            Edit
          </Button>
          <Button
            onClick={() =>
              Modal.confirm({
                title: "Do you want to delete this category ?",
                onOk: () => dispatch(deletePost(data, search)),
              })
            }
            danger
            type="primary"
          >
            Delete
          </Button>
          <Link to={`/blog-post/${data}`}>Read more</Link>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <Table
        loading={loading}
        scroll={{
          x: 1000,
        }}
        title={() => (
          <Fragment>
            <Flex align="center" justify="space-between">
              <h1>All Posts</h1>
              <Button
                onClick={() => dispatch(showModal(form))}
                className="modal-btn"
                type="primary"
                size="large"
              >
                Add post
              </Button>
            </Flex>
            <Search
              placeholder="Searching .."
              onChange={(e) => dispatch(searchPosts(e.target.value))}
              size="large"
            />
            <p className="search-results">A total of {total} posts found</p>
          </Fragment>
        )}
        dataSource={posts}
        columns={columns}
        pagination={false}
      />
      {total > POSTS_LIMIT ? (
        <Pagination
          className="pagination"
          total={total}
          pageSize={POSTS_LIMIT}
          current={activePage}
          onChange={(page) => dispatch(changePage(page, search))}
        />
      ) : null}
      <Modal
        title="Category Info"
        open={isModalOpen}
        maskClosable={false}
        confirmLoading={isModalLoading}
        onOk={handleOk}
        okText={selected === null ? "Add post" : "Save post"}
        onCancel={closeModal}
      >
        <Form
          form={form}
          className="modal-form"
          name="category"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please write post title!",
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
              style={{
                width: "100%",
              }}
              options={options}
            />
          </Form.Item>

          <Form.Item
            label="Popular tags"
            name="tags"
            rules={[
              {
                required: true,
                message: "Please write appropriate tags!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please write at least 10 words!",
              },
            ]}
          >
            <Input.TextArea
              showCount
              minLength={10}
              maxLength={1000}
              className="category__description__input"
            />
          </Form.Item>
          <Form.Item>
            <Upload
              name="avatar"
              listType="picture-card"
              className="category-upload"
              showUploadList={false}
              onChange={(e) => dispatch(uploadImage(e.file.originFileObj))}
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
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default AllPostsPage;
