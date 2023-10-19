import { Button, Flex, Image, Pagination, Space, Table } from "antd";
import { useParams } from "react-router-dom";
import { Fragment } from "react";
import Search from "antd/es/input/Search";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { changePostsPage, getCategoryPosts, searchCategoryPosts } from "../../../redux/actions/categoryPosts";
import { useState } from "react";
import { CATEGORY_POSTS_LIMIT, ENDPOINT } from "../../../constants";

import "./style.scss";

const UserPostsPage = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState(null);
  const { posts, total, loading, activePage, search } = useSelector(
    (state) => state.categoryPosts
  );

  useEffect(() => {
    const controller = new AbortController()
    dispatch(getCategoryPosts(categoryId, search, activePage));

    return () =>{
      controller.abort();
    }
  }, [dispatch, categoryId, activePage, search]);

  useEffect(() => {
    const controller = new AbortController();
    setCategoryName(posts[0]?.category.name);

    return () => {
      controller.abort();
    }
  }, [posts]);

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
            src={`${ENDPOINT}upload/${data?._id}.${data?.name.split(".")[1]}`}
          />
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (data) => <p>{data.slice(0, 30)}...</p>,
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
          {/* <Link to={`/user-posts/${data}`} type="primary">
            See more
          </Link> */}
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
            <Flex
              className="posts-header"
              align="center"
              justify="space-between"
            >
              <h1 className="category-posts-title">{categoryName} </h1>
              <Button className="modal-btn" type="primary" size="large">
                Add post
              </Button>
            </Flex>
            <Search
            value={search}
              placeholder="Searching .."
              onChange={(e) => dispatch(searchCategoryPosts(e.target.value))}
              size="large"
            />
            <p className="search-results">A total of {total} posts found</p>
          </Fragment>
        )}
        dataSource={posts}
        columns={columns}
        pagination={false}
      />
      {total > CATEGORY_POSTS_LIMIT ? (
        <Pagination
          className="pagination"
          total={total}
          pageSize={CATEGORY_POSTS_LIMIT}
          current={activePage}
          onChange={(page) => dispatch(changePostsPage(page))}
        />
      ) : null}
    </Fragment>
  );
};

export default UserPostsPage;
