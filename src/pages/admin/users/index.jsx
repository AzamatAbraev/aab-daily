import {
  Alert,
  Button,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Pagination,
  Space,
  Table,
} from "antd";
import Search from "antd/es/input/Search";
import { UserOutlined } from "@ant-design/icons";

import { useEffect } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ENDPOINT, USER_LIMIT } from "../../../constants";
import {
  changeUsersPage,
  controlModal,
  deleteUser,
  editUser,
  getUsers,
  searchUsers,
  sendUsers,
  showModal,
} from "../../../redux/actions/user";

import "./style.scss";

const UsersPage = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    users,
    total,
    loading,
    activePage,
    search,
    isModalOpen,
    isModalLoading,
    selected,
  } = useSelector((state) => state.user);

  useEffect(() => {
    total === 0 && dispatch(getUsers());
  }, [dispatch, total]);

  const handleOk = async () => {
    const values = await form.validateFields();
    dispatch(sendUsers({ values, selected, activePage, search, form }));
  };

  const closeModal = () => {
    dispatch(controlModal(false));
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "photo",
      key: "photo",
      render: (data) =>
        data ? (
          <Image src={`${ENDPOINT}upload/${data.split("_")[1]}`} />
        ) : (
          <UserOutlined />
        ),
    },
    {
      title: "First name",
      dataIndex: "first_name",
      key: "first_name",
      render: (data) => <p className="firstName">{data}</p>,
    },
    {
      title: "Last name",
      dataIndex: "last_name",
      key: "last_name",
      render: (data) => <p className="lastName">{data}</p>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Account created",
      dataIndex: "createdAt",
      key: "description",
      render: (data) => <p className="accountCreated">{data.split("T")[0]}</p>,
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (data) => (
        <Space size="middle">
          <Button onClick={() => dispatch(editUser(form, data))} type="primary">
            Edit
          </Button>
          <Button
            onClick={() =>
              Modal.confirm({
                title: "Do you want to delete this user ?",
                onOk: () => dispatch(deleteUser(data, search)),
              })
            }
            danger
            type="primary"
          >
            Delete
          </Button>
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
            <Flex className="dashboard-title-container" align="center" justify="space-between">
              <h1>All Users</h1>
              <Button
                onClick={() => dispatch(showModal(form))}
                className="modal-btn"
                type="primary"
                size="large"
              >
                Add user
              </Button>
            </Flex>
            <Search
              placeholder="Searching .."
              onChange={(e) => dispatch(searchUsers(e.target.value))}
              size="large"
            />
            <p className="search-results">A total of {total} users found</p>
          </Fragment>
        )}
        dataSource={users}
        columns={columns}
        pagination={false}
      />
      {total > USER_LIMIT ? (
        <Pagination
          className="pagination"
          total={total}
          pageSize={USER_LIMIT}
          current={activePage}
          onChange={(page) => dispatch(changeUsersPage(page, search))}
        />
      ) : null}
      <Modal
        title="User Info"
        open={isModalOpen}
        maskClosable={false}
        confirmLoading={isModalLoading}
        onOk={handleOk}
        okText={selected === null ? "Add user" : "Save user"}
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
            label="First name"
            name="first_name"
            rules={[
              {
                required: true,
                message: "Please write your first name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last name"
            name="last_name"
            rules={[
              {
                required: true,
                message: "Please write your last name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please write your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {selected === null ? null : (
            <Alert type="error" message="Editing password is not allowed !" />
          )}

          {selected === null ? (
            <Fragment>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please write your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm password"
                name="confirm"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Fragment>
          ) : null}
        </Form>
      </Modal>
    </Fragment>
  );
};

export default UsersPage;
