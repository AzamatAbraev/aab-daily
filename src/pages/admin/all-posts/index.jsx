import { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Flex, Image, Pagination, Space, Table } from "antd";
import Search from "antd/es/input/Search";

import { changePage, searchPosts, getPosts } from "../../../redux/actions/post";
import { ENDPOINT, POSTS_LIMIT } from "../../../constants";

const AllPostsPage = () => {
  const dispatch = useDispatch();

  const { posts, total, loading, activePage, search } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    total === 0 && dispatch(getPosts());
  }, [dispatch, total]);

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
            src={`${ENDPOINT}upload/${data?._id}.${data?.name.split(".")[1]}`}
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
      render: (data) => <p>{data.slice(0, 50)}...</p>,
    },
    {
      title: "Posted by",
      dataIndex: "last_name",
      key: "last_name",
      render: (data, category) => {
        return (
          <p>
            {category?.user.first_name} {category?.user.last_name}
          </p>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: () => (
        <Space size="middle">
          <Button type="primary">Edit</Button>
          <Button danger type="primary">
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
            <Flex align="center" justify="space-between">
              <h1>All Posts</h1>
              <Button className="modal-btn" type="primary" size="large">
                Add category
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
    </Fragment>
  );
};

export default AllPostsPage;
