import { memo, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import BlogCarousel from "../../../components/card/BlogCarousel";
import CategoryCarousel from "../../../components/card/CategoryCarousel";

import { AuthContext } from "../../../context/AuthContext";
import request from "../../../server";
import { ENDPOINT } from "../../../constants";
import Loader from "../../../utils/Loader";


import "./style.scss";

const HomePage = () => {
  const { loading, setLoading } = useContext(AuthContext);
  const { pathname } = useLocation();

  const [latestPost, setLatestPost] = useState([]);
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  useEffect(() => {
    const controller = new AbortController();
    const getLatestPost = async () => {
      try {
        setLoading(true);
        let { data } = await request.get("post/lastone");
        setLatestPost(data);
        setImage(data?.photo?._id);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getLatestPost();

    return () => controller.abort();
  }, [setLoading]);

  useEffect(() => {
    const controller = new AbortController();

    const getLongDate = () => {
      let date = new Date(latestPost.createdAt);
      date = date.toDateString().split(" ");
      let newDate = "";
      for (let i = 0; i < date.length - 1; i++) {
        newDate += date[i] + " ";
      }
      setDate(newDate);
    };
    getLongDate();

    return () => {
      controller.abort();
    };
  }, [latestPost.createdAt]);


  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <section
            className="home"
            style={{
              backgroundImage: latestPost?.photo
                ? `url(${ENDPOINT}upload/${latestPost?.photo._id}.${
                    latestPost?.photo?.name.split(".")[1]
                  })`
                : "url(https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled.png)",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="container home__container">
              <h3 className="home__subtitle">
                Posted on <span>{latestPost.category?.name}</span>
              </h3>
              <h1 className="home__title">{latestPost?.title}</h1>
              <div className="home__details">
                <p className="home__author">
                  By{" "}
                  <span>
                    {latestPost.user?.first_name} {latestPost.user?.last_name}
                  </span>
                </p>
                <p className="home__date">{date}</p>
              </div>
              <p className="home__desc">{latestPost?.description}</p>
              <Link
                to={`/blog-post/${latestPost._id}`}
                className="home__posts__btn"
              >
                Read More
              </Link>
            </div>
          </section>
          <section className="blog">
            <div className="container blog-container">
              <h2 className="blog__title">Popular blogs</h2>
              <BlogCarousel />
              <div className="line"></div>
            </div>
          </section>
          <section className="category">
            <div className="container category__container">
              <h2 className="category__title">Choose A Category</h2>
              <CategoryCarousel />
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const MemoHomePage = memo(HomePage);

export default MemoHomePage;
