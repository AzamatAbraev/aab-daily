import { Button, Flex, Image, Pagination, Space, Table } from "antd";
import Search from "antd/es/input/Search";
import { useEffect } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  changePage,
  getCategories,
  searchCategories,
} from "../../../redux/actions/category";
import { getCategoryImage } from "../../../utils/getImage";
import { CATEGORY_LIMIT } from "../../../constants";

import "./style.scss";

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, total, loading, activePage } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    total === 0 && dispatch(getCategories());
  }, [dispatch, total]);

  const columns = [
    {
      title: "Image",
      dataIndex: "photo",
      key: "photo",
      render: (data) => <Image src={getCategoryImage(data)} height={50} width={50} />,
    },
    {
      title: "Category name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (data) => <p>{data.slice(0, 50)}...</p>,
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (data) => (
        <Space size="middle">
          <Button type="primary">Edit</Button>
          <Button danger type="primary">
            Delete
          </Button>
          <Link to={`/categories/${data}`} type="primary">
            See posts
          </Link>
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
              <h1>Categories</h1>
              <Button
                // onClick={showModal}
                className="modal-btn"
                type="primary"
                size="large"
              >
                Add category
              </Button>
            </Flex>
            <Search
              placeholder="Searching .."
              onChange={(e) => dispatch(searchCategories(e.target.value))}
              size="large"
            />
            <p className="search-results">A total of {total} categories found</p>
          </Fragment>
        )}
        dataSource={categories}
        columns={columns}
        pagination={false}
      />
      {total > CATEGORY_LIMIT ? (
        <Pagination
          className="pagination"
          total={total}
          pageSize={CATEGORY_LIMIT}
          current={activePage}
          onChange={(page) => dispatch(changePage(page))}
        />
      ) : null}
    </Fragment>
  );
};

export default CategoriesPage;
