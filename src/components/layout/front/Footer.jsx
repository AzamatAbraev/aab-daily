import { Link } from "react-router-dom";
import facebook from "../../../assets/images/facebook.svg";
import instagram from "../../../assets/images/instagram.svg";
import linkedin from "../../../assets/images/linkedin.svg";
import twitter from "../../../assets/images/twitter.svg";

import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__info">
          <p>Yunusobod 14, Tashkent City</p>
          <div className="footer__contact">
            <Link title="Click to email" className="footer__email" to="mailto:azamatabraev03@gmail.com">
              azamatabraev03@gmail.com
            </Link>
            <Link title="Click to make a phone call" to="tel:+998938140031" className="footer__phone">+998938140031</Link>
          </div>
        </div>
        <div className="footer__media">
          <Link to="https://www.facebook.com/">
            <img src={facebook} alt="Facebook" className="footer-img" />
          </Link>
          <Link to="https://www.twitter.com/">
            <img src={twitter} alt="twitter" className="footer-img" />
          </Link>
          <Link to="https://www.instagram.com/">
            <img src={instagram} alt="instagram" className="footer-img" />
          </Link>
          <Link to="https://www.linkedin.com/in/azamat-abraev">
            <img src={linkedin} alt="linkedin" className="footer-img" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
