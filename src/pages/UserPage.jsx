import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../services/AuthContext";
import { getUserById } from "../services/api";
import UserCard from "../components/UserCard";
import LoadingIndicator from "../components/LoadingIndicator";

function UserPage() {
  const { isLoggedIn, userId } = useContext(AuthContext); // Extract context at the top level
  const [user, setUser] = useState(null); // Initialize as null or {}
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoadingUser(true);
      try {
        const { data } = await getUserById(userId);
        setUser(data);
      } catch (error) {
        console.error("Error fetching User:", error.message);
        alert("Failed to fetch user. Check the console for details.");
      } finally {
        setIsLoadingUser(false);
      }
    };

    if (userId) {
      // Only fetch if userId exists

      fetchUser();
    }
  }, [userId]);

  return (
    <div className="container mt-4">
      {isLoadingUser ? (
        <LoadingIndicator />
      ) : (
        <div className="row">
          {user ? (
            <UserCard user={user} isLoggedIn={isLoggedIn} />
          ) : (
            <p>No user data available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserPage;
