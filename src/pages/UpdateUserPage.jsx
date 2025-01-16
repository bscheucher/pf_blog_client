import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";
import { getUserById, updateUser } from "../services/api";
import useValidation from "../services/Validation";

const UpdateUserPage = () => {
  const { userId: authUserId } = useContext(AuthContext); // Authenticated user ID
  const { id } = useParams(); // Extract user ID from route parameters
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { errors, validate, validateForm } = useValidation();

  useEffect(() => {
    if (!authUserId || authUserId.toString() !== id) {
      navigate("/login"); // Redirect if not authorized
      return;
    }

    // Fetch user details for pre-filling the form
    const fetchUser = async () => {
      try {
        const { data } = await getUserById(id);
        setFormData({
          username: data.username,
          email: data.email,
          password: "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError("Failed to load user data.");
      }
    };

    fetchUser();
  }, [id, authUserId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;
    setError("");
    setSuccess("");

    try {
      const updatedUserData = {
        ...(formData.username && { username: formData.username }),
        ...(formData.email && { email: formData.email }),
        ...(formData.password && { password: formData.password }),
      };

      if (Object.keys(updatedUserData).length === 0) {
        setError("Please fill at least one field to update.");
        return;
      }

      const response = await updateUser(id, updatedUserData);

      if (response.status === 200) {
        setSuccess("User updated successfully!");
        setTimeout(() => navigate(`/user`), 1500); // Redirect after success
      }
    } catch (err) {
      console.error("Error updating user:", err.message);

      // Check if error response contains a string message or an object
      const errorMessage =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.errors
          ? JSON.stringify(err.response.data.errors)
          : "An error occurred while updating.";

      setError(errorMessage);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update User</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter new username"
          />
          {errors.username && (
            <small className="text-danger">{errors.username}</small>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter new email"
          />
          {errors.email && (
            <small className="text-danger">{errors.email}</small>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter new password"
          />
          {errors.password && (
            <small className="text-danger">{errors.password}</small>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateUserPage;
