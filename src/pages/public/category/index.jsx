import { Fragment, memo, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import request from "../../../server";
import { ENDPOINT, LIMIT } from "../../../constants";

import "./style.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";

const CategoryPage = () => {
  const [category, setCategory] = useState();
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(null);
  let [posts, setPosts] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const { categoryId } = useParams();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const getCategory = async () => {
      try {
        let { data } = await request.get(`category/${categoryId}`);
        setCategory(data);
      } catch (err) {
        console.log(err);
      }
    };

    const getPostsByCategory = async () => {
      try {
        let { data } = await request.get(
          `post?category=${categoryId}&search=${search}&page=${activePage}&limit=${LIMIT}`
        );
        console.log(data.data);
        setTotal(data.pagination.total);
        setPosts(data.data);
      } catch (err) {
        console.log(err);
      }
    };

    getPostsByCategory();
    getCategory();
  }, [categoryId, activePage, search]);

  let pagination = Math.ceil(total / LIMIT);
  let arr = [];
  for (let i = 1; i <= pagination; i++) {
    arr.push(i);
  }

  return (
    <Fragment>
      <section id="category" className="home__category">
        <div className="container category__page__container">
          <h1 className="category__header">{category?.name}</h1>
          <div className="category__content">
            <p className="category__desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore.
            </p>
          </div>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <p>&#62;</p>
            <Link to={`/category/${categoryId}`}>{category?.name}</Link>
          </div>
        </div>
      </section>
      <section className="all-posts">
        <div className="container">
          <div className="container all-posts__container">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              type="text"
              placeholder="Searching..."
            />
          </div>
          <div className="posts-row">
            {posts?.map((post) => (
              <div key={post._id} className="post-card">
                <Link to={`/blog-post/${post?._id}`} className="post-image">
                  <LazyLoadImage
                    src={`${ENDPOINT}upload/${post?.photo._id}.jpg`}
                    alt={post.category?.name}
                  />
                </Link>
                <div className="post-info">
                  <p className="post-subtitle">{post.category.name}</p>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-desc">{post?.description}</p>
                </div>
              </div>
            ))}
          </div>
          {total > LIMIT ? (
            <ul className="pagination">
              <li className="pagination-item">
                <button
                  onClick={() => setActivePage(activePage - 1)}
                  className={`pagination-prev ${
                    activePage === 1 ? "disabled" : ""
                  }`}
                >
                  &#60; Prev
                </button>
              </li>
              {arr.map((page) => (
                <li key={page} className="pagination-item">
                  <button
                    onClick={() => setActivePage(page)}
                    className={`pagination-link ${
                      page === activePage ? "active" : ""
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li className="pagination-item">
                <button
                  className={`pagination-next ${
                    activePage === total ? "disabled" : ""
                  }`}
                >
                  Next &#62;
                </button>
              </li>
            </ul>
          ) : null}
        </div>
      </section>
    </Fragment>
  );
};

const MemoCategoryPage = memo(CategoryPage);

export default MemoCategoryPage;
