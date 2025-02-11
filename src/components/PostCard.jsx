import { Link } from "react-router-dom";

import { getPostLikes, assignLikeToPost } from "../services/api";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../services/AuthContext";
import "./components-css/PostCard.css";
import { formatDate } from "../services/formatDate";

function PostCard({ post }) {
  const [likes, setLikes] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false); // State to toggle text display
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

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h6 className="card-title fw-bold">{post.title}</h6>
        <p className="card-text text-muted">
          {isExpanded ? post.content : truncateText(post.content, 100)}
        </p>
        <button className="btn btn-link p-0" onClick={toggleExpand}>
          {isExpanded ? "Show less" : "Read more"}
        </button>
        <p className="card-text">
          <small className="text-muted">Author: {post.author}</small>
        </p>
        <p className="card-text">
          <small className="text-muted">Created: {formatDate(post.created_at)}</small>
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
        <Link
          to={`/post/${post.id}`}
          role="button"
          className="btn btn-primary mt-3"
        >
          Go to post
        </Link>
      </div>
    </div>
  );
}

export default PostCard;
