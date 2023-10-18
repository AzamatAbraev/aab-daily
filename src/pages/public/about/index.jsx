import { Fragment, memo, useContext, useEffect } from "react";

import teamImg from "../../../assets/images/about-main.png";
import threePeople from "../../../assets/images/why-we-started.png";

import "./style.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { AuthContext } from "../../../context/AuthContext";
import Loader from "../../../utils/Loader";
import { useLocation } from "react-router-dom";

const AboutPage = () => {
  const { loading, setLoading } = useContext(AuthContext);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setLoading(true);
    let timerId = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timerId)
    }
  }, [setLoading]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <section id="about" className="about">
          <div className="container about__container">
            <div className="about__main">
              <div className="about__mission">
                <p className="about__mission__subtitle">Our mision</p>
                <j3 className="about__mission__title">
                  Creating valuable content for creatives all around the world
                </j3>
                <p className="about__mission__desc">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Non blandit massa enim nec. Scelerisque viverra mauris in
                  aliquam sem. At risus viverra adipiscing at in tellus.
                </p>
              </div>
              <div className="about__vision">
                <p className="about__vision__subtitle">Our Vision</p>
                <j3 className="about__vision__title">
                  A platform that empowers individuals to improve
                </j3>
                <p className="about__vision__desc">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Non blandit massa enim nec. Scelerisque viverra mauris in
                  aliquam sem. At risus viverra adipiscing at in tellus.
                </p>
              </div>
            </div>
            <div className="about__team">
              <div className="about__team__info">
                <h2 className="about__team__title">Our team of creatives</h2>
                <h3 className="about__team__subtitle">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt.
                </h3>
                <p className="about__team__desc">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat.
                </p>
              </div>
              <div className="about__team__image">
                <LazyLoadImage src={teamImg} alt="Team hands" />
              </div>
            </div>
            <div className="about__team about__team__2">
              <div className="about__team__image">
                <LazyLoadImage
                  src={threePeople}
                  alt="Three people discussing"
                />
              </div>
              <div className="about__team__info">
                <h2 className="about__team__title">Why we started this Blog</h2>
                <h3 className="about__team__subtitle">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt.
                </h3>
                <p className="about__team__desc">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </Fragment>
  );
};

const MemoAboutPage = memo(AboutPage);

export default MemoAboutPage;
