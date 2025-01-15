import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  createPost,
  assignCategoryToPost,
  assignTagToPost,
  getAllTags,
  getAllCategories,
} from "../services/api";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [message, setMessage] = useState("");
  const { userId, isLoggedIn } = useContext(AuthContext);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
        alert("Failed to fetch categories. Check the console for details.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await getAllTags();
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags:", error.message);
        alert("Failed to fetch tags. Check the console for details.");
      }
    };
    fetchTags();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setMessage("User not logged in. Please log in to create a post.");
      return;
    }

    const postData = { title, content, authorId: userId };
    

    try {
      console.log("Submitting post:", postData);
      const response = await createPost(postData);
      console.log("Post created successfully:", response.data);
      setMessage("Post created successfully!");
      if (selectedCategories.length > 0) {
        selectedCategories.forEach(async (categoryId) => {
          console.log("Assigning category:", categoryId);
          await assignCategoryToPost({ postId: response.data.id, categoryId });
        });
      }

      if (selectedTags.length > 0) {
        selectedTags.forEach(async (tagId) => {
          console.log("Assigning tag:", tagId);
          await assignTagToPost({ postId: response.data.id, tagId });
        });
      }
      // Reset form fields
      setTitle("");
      setContent("");
      setSelectedCategories([]);
      setSelectedTags([]);
      navigate("/");
    } catch (error) {
      console.error(
        "Error creating post:",
        error.response?.data || error.message
      );
      setMessage(
        "Error creating post: " +
          (error.response?.data.message || "Unknown error")
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Create a New Post</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleCreatePost}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            id="content"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Categories</label>
          <select
            multiple
            className="form-select"
            value={selectedCategories}
            onChange={(e) =>
              setSelectedCategories(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <select
            multiple
            className="form-select"
            value={selectedTags}
            onChange={(e) =>
              setSelectedTags(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
