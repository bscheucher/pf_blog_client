import React, { useEffect, useState, useContext, useRef } from "react";
import { getAllTags, getPostsByTagName } from "../services/api";
import LoadingIndicator from "../components/LoadingIndicator";
import PostCard from "../components/PostCard";
import { AuthContext } from "../services/AuthContext";

function TagsPage() {
  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isTagsLoading, setIsTagsLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const resultsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsTagsLoading(true);
      try {
        const response = await getAllTags();
        setTags(response.data || []);
      } catch (error) {
        console.error("Error fetching tags:", error.message);
        alert("Failed to fetch tags.");
      } finally {
        setIsTagsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTag && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedTag]);

  const handleTagClick = async (tagName) => {
    setIsPostsLoading(true);
    try {
      const response = await getPostsByTagName(tagName);
      setPosts(response.data || []);
      setSelectedTag(tagName.trim());
    } catch (error) {
      console.error("Error fetching posts for tag:", error.message);
      alert("Failed to fetch posts for the selected tag.");
    } finally {
      setIsPostsLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mt-5">
        <h4 className="mb-3 px-3">Tags</h4>
        {isTagsLoading ? (
          <LoadingIndicator />
        ) : tags.length > 0 ? (
          <div className="row g-3">
            {tags.map((tag) => (
              <div className="col-12 col-md-6 px-5" key={tag.id}>
                <button
                  className="btn btn-link"
                  onClick={() => handleTagClick(tag.name)}
                  aria-label={`View posts tagged ${tag.name}`}
                >
                  {tag.name}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">
            It seems there are no tags available at the moment.
          </p>
        )}
      </div>
      {selectedTag && (
        <div id="results" ref={resultsRef} className="mt-5">
          <h4 className="mb-3 px-3">Posts in "{selectedTag}"</h4>
          {isPostsLoading ? (
            <LoadingIndicator />
          ) : posts.length > 0 ? (
            <div className="row">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          ) : (
            <p className="text-muted mx-5">No posts found for this tag.</p>
          )}
        </div>
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

export default TagsPage;
