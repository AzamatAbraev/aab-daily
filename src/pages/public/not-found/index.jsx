import { Link } from "react-router-dom";
import { memo } from "react";

import "./style.scss";

const NotFoundPage = () => {
  return (
    <section id="not-found">
      <div className="container not-found">
        <h1>404</h1>
        <h2>Sorry, we were unable to find that page</h2>
        <Link to="/" className="back-home">
          Start from home page
        </Link>
      </div>
    </section>
  );
};

const MemoNotFoundPage = memo(NotFoundPage);

export default MemoNotFoundPage;
