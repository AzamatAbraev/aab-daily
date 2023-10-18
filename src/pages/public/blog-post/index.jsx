import { Fragment, memo, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import request from "../../../server";
import { ENDPOINT } from "../../../constants";
import { longDate } from "../../../constants/dateConvert";

import deafaultImg from "../../../assets/images/why-we-started.png";

import "./style.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { AuthContext } from "../../../context/AuthContext";
import Loader from "../../../utils/Loader";
import homeBackground from "../../../assets/images/home-background.png"

const BlogPostPage = () => {
  const { loading, setLoading } = useContext(AuthContext);

  const [post, setPost] = useState();
  const { blogId } = useParams();

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true);
        let { data } = await request.get(`post/${blogId}`);
        setPost(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [blogId, setLoading]);

  const setDefaultImage = (e) => {
    if (e.target.src === null) {
      e.target.src = deafaultImg;
    }
  };

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <section id="blog-post">
          <div className="container blog-post">
            <div className="blog-post__image">
              <LazyLoadImage
                className="blog-post-image"
                // onError={(e) => setDefaultImage(e.target.src)}
                src={
                  post?.photo
                    ? `${ENDPOINT}/upload/${post?.photo._id}.${
                        post?.photo.name.split(".")[1]
                      }`
                    : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
                }
                alt=""
              />
            </div>
            <div className="blog-post__content container-md">
              <div className="blog-post__subheader">
                <img
                  className="blog-post__main__image"
                  src={`${ENDPOINT}/upload/${post?._id}.jpg`}
                  alt=""
                />
                <div className="blog-post__author">
                  <h3>
                    {post?.user.first_name} {post?.user.last_name}
                  </h3>
                  <p>Posted on {longDate(post?.createdAt)}</p>
                </div>
              </div>
              <div className="blog-post__header">
                <h1 className="blog-post__title">{post?.title}</h1>
                <p className="blog-post__subtitle">
                  {post?.category.name} (
                  {post?.tags.map((item) => (
                    <span key={item}>#{item}</span>
                  ))}
                  )
                </p>
              </div>
              <div className="blog-post__main">
                <p className="blog-post__text">{post?.description}</p>
                <p className="blog-post__text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Non blandit massa enim nec. Scelerisque viverra mauris in
                  aliquam sem. At risus viverra adipiscing at in tellus. Sociis
                  natoque penatibus et magnis dis parturient montes. Ridiculus
                  mus mauris vitae ultricies leo. Neque egestas congue quisque
                  egestas diam. Risus in hendrerit gravida rutrum quisque non.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </Fragment>
  );
};

const MemorBlogPostPage = memo(BlogPostPage);

export default MemorBlogPostPage;
