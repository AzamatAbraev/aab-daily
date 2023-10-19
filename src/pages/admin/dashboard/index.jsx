import { useEffect } from "react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { AuthContext } from "../../../context/AuthContext";

import { getCategories } from "../../../redux/actions/category";
import { getUsers } from "../../../redux/actions/user";
import { getPosts } from "../../../redux/actions/post";

import "./style.scss";

const DashboardPage = () => {
  const { username } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { total } = useSelector((state) => state.category);
  const { total: userTotal } = useSelector((state) => state.user);
  const { total: postTotal } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getPosts());
    dispatch(getUsers());
  }, [dispatch, total]);

  const [date, setDate] = useState("");
  useEffect(() => {
    const date = new Date();
    let currentDay = date.toDateString();
    setDate(currentDay);
  }, []);

  return (
    <section className="dashboard">
      <div className="main-card">
        <p className="current-date">{date}</p>
        <div className="dashboard-greeting">
          <h3 className="dashboard-username">Welcome back, {username}</h3>
          <p className="dashboard-reminder">
            Always stay updated in your admin portal
          </p>
        </div>
      </div>
      <div className="wrapper">
        <div className="statistics">
          <h2 className="statistics-title">Statistics</h2>
          <div className="stats-row">
            <div className="stats-card">
              <h3>{total}</h3>
              <p>Categories</p>
            </div>
            <div className="stats-card">
              <h3>+{userTotal}</h3>
              <p>New users</p>
            </div>
            <div className="stats-card">
              <h3>{postTotal}</h3>
              <p>Total posts</p>
            </div>
            <div className="stats-card">
              <h3>2</h3>
              <p>Average post</p>
            </div>
            <div className="stats-card">
              <h3>+70%</h3>
              <p>Active users</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
