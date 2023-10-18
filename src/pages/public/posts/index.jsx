import { Fragment, memo, useContext, useEffect, useState } from "react";
import { ENDPOINT, LIMIT_POSTS } from "../../../constants";
import { Link, useLocation } from "react-router-dom";

import { AuthContext } from "../../../context/AuthContext";
import Loader from "../../../utils/Loader";
import request from "../../../server";

import "./style.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";

const PostsPage = () => {
  const { loading, setLoading } = useContext(AuthContext);
  const { pathname } = useLocation();

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(null);
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setLoading(true);
    let timerId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [setLoading]);

  useEffect(() => {
    const controller = new AbortController();
    const getAllPosts = async () => {
      try {
        let { data } = await request.get(
          `/post?limit=${LIMIT_POSTS}&page=${activePage}&search=${search}`
        );
        setPosts(data.data);
        setTotal(data.pagination.total);
      } catch (err) {
        console.log(err);
      }
    };
    getAllPosts();

    return () => {
      controller.abort();
    };
  }, [activePage, search, setLoading]);

  let pagination = Math.ceil(total / LIMIT_POSTS);
  let arr = [];
  for (let i = 1; i <= pagination; i++) {
    arr.push(i);
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setActivePage(1);
  }

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <section className="all-posts-page">
          <div className="container all-posts">
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Searching..."
              className="search-input"
              type="text"
            />
            <h1 className="all-posts__title">All posts</h1>
            <div className="line"></div>
            <div className="posts-row">
              {posts.map((post) => (
                <div key={post?._id} className="post-card">
                  <Link
                    title="Click the image to read more"
                    to={`/blog-post/${post?._id}`}
                    className="post-image"
                  >
                    <LazyLoadImage
                      src={
                        post?.photo
                          ? `${ENDPOINT}/upload/${post?.photo._id}.${
                              post?.photo.name.split(".")[1]
                            }`
                          : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
                      }
                      alt={post?.category.name}
                    />
                  </Link>
                  <div className="post-info">
                    <p className="post-subtitle">{post?.category.name}</p>
                    <h3 className="post-title">{post?.title}</h3>
                    <p className="post-desc">{post?.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {total > LIMIT_POSTS ? (
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
                    onClick={() => setActivePage(activePage + 1)}
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
      )}
    </Fragment>
  );
};

const MemePostsPage = memo(PostsPage);

export default MemePostsPage;
