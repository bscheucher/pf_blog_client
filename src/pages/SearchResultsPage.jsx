import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { searchInPosts } from "../services/api";
import PostCard from "../components/PostCard";
import LoadingIndicator from "../components/LoadingIndicator";
import { AuthContext } from "../services/AuthContext";

function SearchResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn } = useContext(AuthContext);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query || query.trim().length < 3) {
        setError("Query must be at least 3 characters long.");
        return;
      }

      setLoading(true);
      setError("");
      setResults([]);

      try {
        const response = await searchInPosts({ query });
        setResults(response.data);
      } catch (err) {
        setError("Error fetching search results. Please try again later.");
        console.error(
          "Search error:",
          err.message || err.response?.data?.error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="container my-4">
      <h1 className="mb-4">Search Results</h1>

      {loading && <LoadingIndicator />}
      {error && <p className="text-danger">{error}</p>}

      {results.length > 0 ? (
        <div className="row">
          {results.map((post) => (
            <div className="col-md-4" key={post.id}>
              <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No results found.</p>
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

export default SearchResultsPage;
