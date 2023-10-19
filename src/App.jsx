import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/public/home";
import PostsPage from "./pages/public/posts";
import BlogPostPage from "./pages/public/blog-post";
import AboutPage from "./pages/public/about";
import RegisterPage from "./pages/public/register";
import LoginPage from "./pages/public/login";
import AdminLayout from "./components/layout/admin";

import FrontLayout from "./components/layout/front";
import MyPostsPage from "./pages/user/my-posts";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import AccountPage from "./pages/account";
import DashboardPage from "./pages/admin/dashboard";
import NotFoundPage from "./pages/public/not-found";
import CategoryPage from "./pages/public/category";
import CategoriesPage from "./pages/admin/categories";
import UsersPage from "./pages/admin/users";
import UserPostsPage from "./pages/admin/posts";
import AllPostsPage from "./pages/admin/all-posts";

function App() {
  const { isAuthenticated, role } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<FrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/blog-post/:blogId" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/my-posts"
            element={
              isAuthenticated && role == "user" ? (
                <MyPostsPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/account"
            element={
              isAuthenticated ? <AccountPage /> : <Navigate to="/login" />
            }
          />
        </Route>
        {isAuthenticated && role === "admin" ? (
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:categoryId" element={<UserPostsPage />} />
            <Route path="/allposts" element={<AllPostsPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>
        ) : null}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
