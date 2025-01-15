import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../services/api";
import PostCard from "../components/PostCard";
import { AuthContext } from "../services/AuthContext";
import LoadingIndicator from "../components/LoadingIndicator";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const { isLoggedIn, userId } = useContext(AuthContext);
  const [isPostsLoading, setIsPostsLoading] = useState(false);

  if (userId) console.log("UserId in Homepage:", userId);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsPostsLoading(true);
      try {
        const { data } = await getAllPosts();

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
        alert("Failed to fetch posts. Check the console for details.");
      } finally {
        setIsPostsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h1>All Posts</h1>
      {isLoggedIn && (
        <Link
          to={`/posts`}
          role="button"
          className="btn btn-outline-secondary mt-3 mb-1"
        >
          Create post
        </Link>
      )}

      {isPostsLoading ? (
        <LoadingIndicator />
      ) : posts.length > 0 ? (
        <div className="row">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
          ))}
        </div>
      ) : (
        <p className="text-muted mx-5">No posts found.</p>
      )}
      <button
        className="btn btn-primary position-fixed bottom-0 end-0 m-3"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        Top
      </button>
    </div>
  );
}

export default HomePage;
