import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PostPage from "./pages/PostPage";
import CreatePostPage from "./pages/CreatePostPage";
import UpdatePostPage from "./pages/UpdatePostPage";
import CategoriesPage from "./pages/CategoriesPage";
import TagsPage from "./pages/TagsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import UserPage from "./pages/UserPage";
import UpdateUserPage from "./pages/UpdateUserPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/posts" element={<CreatePostPage />} />
        <Route path="/posts/:id" element={<UpdatePostPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/tags" element={<TagsPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/users/:id/update" element={<UpdateUserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
