import React, { useEffect, useState, useContext, useRef } from "react";
import { getAllCategories, getPostsByCategoryName } from "../services/api";
import LoadingIndicator from "../components/LoadingIndicator";
import PostCard from "../components/PostCard";
import { AuthContext } from "../services/AuthContext";

function CategoriesPage() {
  const [categorys, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const resultsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsCategoriesLoading(true);
      try {
        const response = await getAllCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categorys:", error.message);
        alert("Failed to fetch categorys.");
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedCategory]);

  const handleCategoryClick = async (categoryName) => {
    setIsPostsLoading(true);
    try {
      const response = await getPostsByCategoryName(categoryName);
      setPosts(response.data || []);
      setSelectedCategory(categoryName.trim());
    } catch (error) {
      console.error("Error fetching posts for category:", error.message);
      alert("Failed to fetch posts for the selected category.");
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
        <h4 className="mb-3 px-3">Categories</h4>
        {isCategoriesLoading ? (
          <LoadingIndicator />
        ) : categorys.length > 0 ? (
          <div className="row g-3">
            {categorys.map((category) => (
              <div className="col-12 col-md-6 px-5" key={category.id}>
                <button
                  className="btn btn-link"
                  onClick={() => handleCategoryClick(category.name)}
                  aria-label={`View posts categoryged ${category.name}`}
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">
            It seems there are no categorys available at the moment.
          </p>
        )}
      </div>
      {selectedCategory && (
        <div id="results" ref={resultsRef} className="mt-5">
          <h4 className="mb-3 px-3">Posts in "{selectedCategory}"</h4>
          {isPostsLoading ? (
            <LoadingIndicator />
          ) : posts.length > 0 ? (
            <div className="row">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          ) : (
            <p className="text-muted mx-5">No posts found for this category.</p>
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

export default CategoriesPage;
