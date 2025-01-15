import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../services/AuthContext";
import { useParams } from "react-router-dom";
import PostDetail from "../components/PostDetail";
import CommentCard from "../components/CommentCard";
import { Link } from "react-router-dom";
import { deletePost } from "../services/api";
import {
  getPostById,
  getPostComments,
  getPostCategories,
  getPostTags,
  createComment,
} from "../services/api";
import LoadingIndicator from "../components/LoadingIndicator";

function PostPage() {
  const { id } = useParams();
  const { isLoggedIn, userId } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentsRes, categoriesRes, tagsRes] =
          await Promise.all([
            getPostById(id),
            getPostComments(id),
            getPostCategories(id),
            getPostTags(id),
          ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
        setCategories(
          Array.isArray(categoriesRes.data) ? categoriesRes.data : []
        );
        setTags(Array.isArray(tagsRes.data) ? tagsRes.data : []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        alert("Failed to fetch data.");
      }
    };
    fetchData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isLoggedIn) return alert("You must be logged in to comment.");

    const trimmedComment = newComment.trim();
    if (!trimmedComment) return setError("Comment content cannot be empty.");

    try {
      const newCommentData = {
        content: trimmedComment,
        postId: Number(id),
        userId,
      };

      console.log("Submitting comment:", newCommentData);

      setNewComment("");
      await createComment(newCommentData);

      // Refresh comments from the database
      const { data: updatedComments } = await getPostComments(id);
      setComments(updatedComments);
    } catch (err) {
      console.error(
        "Error submitting comment:",
        err.response?.data || err.message
      );
      setError("Failed to create comment.");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deletePost(id);
      alert("Post deleted successfully.");
      // Redirect to another page, e.g., home or posts list
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to delete post:", error.message);
      alert("An error occurred while deleting the post.");
    }
  };

  return (
    <div className="container mt-4">
      {post ? <PostDetail post={post} /> : <LoadingIndicator />}

      <div className="btn-group" role="group">
        {isLoggedIn && post && post.author_id === userId && (
          <Link
            to={`/posts/${post.id}`}
            role="button"
            className="btn btn-outline-secondary mt-3 mb-1"
          >
            Update post
          </Link>
        )}
        {isLoggedIn && post && post.author_id === userId && (
          <button
            onClick={handleDeletePost}
            type="button"
            className="btn btn-danger mt-3 mb-1"
          >
            Delete Post
          </button>
        )}
      </div>
      <div className="mt-5">
        <h4 className="mb-3">Comments</h4>
        {comments.length > 0 ? (
          <div className="row g-3">
            {comments.map((comment) => (
              <div className="col-12 col-md-6" key={comment.id}>
                <CommentCard comment={comment} />
              </div>
            ))}
          </div>
        ) : (
          <p>No comments yet.</p>
        )}

        {/* Add Comment Form */}
        <div className="mt-4">
          <h5>Add a Comment</h5>
          <form onSubmit={handleCommentSubmit}>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary">
              Submit Comment
            </button>
          </form>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="mb-3">Categories</h4>
        {categories.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category.id || category.name}
                className="badge bg-primary text-light"
              >
                {category.name}
              </span>
            ))}
          </div>
        ) : (
          <p>No categories yet.</p>
        )}
      </div>

      <div className="mt-5">
        <h4 className="mb-3">Tags</h4>
        {tags.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id || tag.name}
                className="badge bg-secondary text-light"
              >
                {tag.name}
              </span>
            ))}
          </div>
        ) : (
          <p>No tags yet.</p>
        )}
      </div>
    </div>
  );
}

export default PostPage;
