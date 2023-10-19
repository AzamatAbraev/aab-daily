import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { LazyLoadImage } from "react-lazy-load-image-component";

import request from "../../server";
import { ENDPOINT } from "../../constants";
import icon from "../../assets/images/icon.svg";


import "./CategoryCarousel.scss";

const CategoryCarousel = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        let { data } = await request.get("category");
        setCategories(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCategories();
  }, []);

  const addDefaultImage = (e) => {
    e.target.src = icon;
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },

      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
        },
      },
    ],
  };
  
  return (
    <Slider {...settings}>
      {categories.map((category) => (
        <Link
          to={`category/${category._id}`}
          key={category._id}
          className="wrapper"
        >
          <div className="category__card">
            <LazyLoadImage
              onError={(e) => addDefaultImage(e)}
              src={`${ENDPOINT}upload/${category.photo._id}.${
                category.photo.name.split(".")[1]
              }`}
              alt="Icon"
            />
            <h3 className="category__card__title">{category.name}</h3>
            <p className="category__card__desc">
              {category.description.slice(0, 40)}{" "}
              {category.description.length > 40 ? "..." : ""}
            </p>
          </div>
        </Link>
      ))}
    </Slider>
  );
};

const MemoCategoryCarousel = memo(CategoryCarousel);

export default MemoCategoryCarousel;
