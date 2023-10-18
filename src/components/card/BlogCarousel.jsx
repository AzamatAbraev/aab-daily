import { memo, useEffect, useState } from "react";
import Slider from "react-slick";

import request from "../../server";
import { ENDPOINT } from "../../constants";
import { Link } from "react-router-dom";
import { longDate } from "../../constants/dateConvert";

import carouselBlog from "../../assets/images/carousel-1.svg";

import "./BlogCarousel.scss";

const BlogCarousel = () => {
  const [blogs, setBlogs] = useState([]);
  const [photoExists, setPhotoExists] = useState(null);

  const getPopularBlogs = async () => {
    try {
      let { data } = await request.get("/post/lastones");
      setBlogs(data);
      setPhotoExists(data?.photo._id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    getPopularBlogs();

    return () => {
      controller.abort();
    };
  }, []);

  const setDefaultImage = (e) => {
    if (e.target.src === null) {
      e.target.src = carouselBlog;
    }
  };
  console.log(blogs);

  console.log(photoExists);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          dots: false,
        },
      },
      {
        breakpoint: 630,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };
  return (
    <Slider {...settings}>
      {blogs.map((blog) => (
        <div key={blog._id} className="carousel__card card">
          <Link to={`/blog-post/${blog?._id}`} className="card__image">
            <img
              onError={() => setDefaultImage()}
              className="blog-carousel-image"
              src={
                blog?.photo ?
                `${ENDPOINT}/upload/${blog?.photo._id}.${`${blog?.photo.name.split(".")[1]}`}` : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
              }
            />
          </Link>
          <div className="card__content">
            <div className="card__subheader">
              <p>
                By
                <span>
                  {blog?.user.first_name} {blog?.user.last_name}
                </span>
              </p>
              <p>{longDate(blog.createdAt)}</p>
            </div>
            <h3 className="card__title">{blog.title}</h3>
            <p className="card__desc">{blog.description}</p>
            <Link to={`/blog-post/${blog._id}`} className="read-more-btn">
              Read More
            </Link>
          </div>
        </div>
      ))}
    </Slider>
  );
};

const MemoBlogCarousel = memo(BlogCarousel);

export default MemoBlogCarousel;
