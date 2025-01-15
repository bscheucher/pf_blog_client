import { getPostLikes, assignLikeToPost } from "../services/api";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../services/AuthContext";
import "./components-css/PostCard.css";

function PostDetail({ post }) {
  const [likes, setLikes] = useState([]);

  const postId = parseInt(post.id);

  const { userId, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { data } = await getPostLikes(postId);
        setLikes(Array.isArray(data) ? data : []); // Ensure likes is always an array
      } catch (error) {
        console.error("Error fetching likes:", error.message);
        alert("Failed to fetch likes. Check the console for details.");
      }
    };
    fetchLikes();
  }, [postId]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert("Please log in to like posts.");
      return;
    }

    try {
      const { data } = await assignLikeToPost({ postId, userId });
      if (data) {
        setLikes((prevLikes) => [...(prevLikes || []), data]); // Handle possible null/undefined prevLikes
      }
    } catch (error) {
      console.error("Error liking the post:", error.message);
      alert("Failed to like the post. Please try again.");
    }
  };

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-3 fw-bold">{post.title}</h2>
          <p className="card-text text-muted">{post.content}</p>
          <p className="card-text">
            <small className="text-muted">Author: {post.author}</small>
          </p>
          <p className="card-text">
            <small className="text-muted">Created: {post.created_at}</small>
          </p>
          <p className="card-text">
            <small className="text-muted">Last edited: {post.updated_at}</small>
          </p>
          <div className="d-flex align-items-center mt-3">
            <img
              src="/assets/images/like.png"
              className="img-fluid me-2 like-img"
              alt="like"
              style={{ width: "20px", height: "20px", cursor: "pointer" }}
              onClick={handleLike}
            />
            <span>{likes.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
