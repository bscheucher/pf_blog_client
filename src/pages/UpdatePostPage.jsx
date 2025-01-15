import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../services/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  updatePost,
  getAllCategories,
  getAllTags,
  getPostCategories,
  getPostTags,
  updatePostCategories,
  updatePostTags,
} from "../services/api";

function UpdatePostPage() {
  const { id } = useParams();
  const { isLoggedIn, userId } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          postRes,
          categoriesRes,
          tagsRes,
          postCategoriesRes,
          postTagsRes,
        ] = await Promise.all([
          getPostById(id),
          getAllCategories(),
          getAllTags(),
          getPostCategories(id),
          getPostTags(id),
        ]);

        // Populate state with the fetched data
        setTitle(postRes.data.title);
        setContent(postRes.data.content);
        setCategories(categoriesRes.data || []);
        setTags(tagsRes.data || []);
        setSelectedCategories(
          postCategoriesRes.data.map((cat) => cat.id) || []
        );
        setSelectedTags(postTagsRes.data.map((tag) => tag.id) || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        alert("Failed to fetch data.");
      }
    };
    fetchData();
  }, [id]);

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const postData = { title, content, authorId: userId };

    try {
      const response = await updatePost(id, postData);
      console.log("Payload for updatePostCategories:", {
        postId: response.data.id,
        categoryIds: selectedCategories,
      });

      await Promise.all([
        updatePostCategories({
          postId: response.data.id,
          categoryIds: selectedCategories,
        }),
        updatePostTags({
          postId: response.data.id,
          tagIds: selectedTags,
        }),
      ]);
      console.log(selectedCategories);
      setMessage("Post updated successfully!");
      setTimeout(() => navigate(`/post/${id}`), 1500);
    } catch (error) {
      console.error(
        "Error updating post:",
        error.response?.data || error.message
      );

      setMessage("Error updating post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Update Post</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleUpdatePost}>
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
            aria-label="Post title"
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
            aria-label="Post content"
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
                Array.from(e.target.selectedOptions, (option) =>
                  parseInt(option.value)
                )
              )
            }
            aria-label="Post categories"
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
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
                Array.from(e.target.selectedOptions, (option) =>
                  parseInt(option.value)
                )
              )
            }
            aria-label="Post tags"
          >
            {tags.length > 0 ? (
              tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))
            ) : (
              <option disabled>No tags available</option>
            )}
          </select>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdatePostPage;
