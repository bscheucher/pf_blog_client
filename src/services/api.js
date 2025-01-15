import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;

// User routes
export const registerUser = (userData) => API.post("/users/register", userData);
export const updateUser = (userId, userData) => API.put(`/users/${userId}/update`, userData);
export const loginUser = (credentials) => API.post("/users/login", credentials);
export const getUserById = (userId) => API.get(`/users/${userId}`);
export const logoutUser = () => API.post("/users/logout");
// Post routes
export const getAllPosts = () => API.get("/posts");
export const getPostById = (postId) => API.get(`/posts/${postId}`);
export const createPost = (postData) => API.post("/posts", postData);
export const updatePost = (postId, updatedData) =>
  API.put(`/posts/${postId}`, updatedData);
export const deletePost = (postId) => API.delete(`/posts/${postId}`);
export const getPostsByCategoryName = (categoryName) =>
  API.get(`/posts/of-category`, { params: { categoryName } });
export const getPostsByTagName = (tagName) =>
  API.get(`/posts/of-tag`, { params: { tagName } });

export const searchInPosts = (query) =>
  API.get(`posts/search`, { params: { query } });

// Comment routes
export const createComment = (commentData) =>
  API.post("/posts/comment", commentData);
export const getPostComments = (postId) => API.get(`/posts/${postId}/comments`);

// Like routes
export const getPostLikes = (postId) => API.get(`/posts/${postId}/likes`);
export const assignLikeToPost = (data) => API.post("/posts/add-like", data);

// Category & Tag routes (similarly add for likes)
export const getAllCategories = () => API.get("/posts/categories");
export const assignCategoryToPost = (data) =>
  API.post("/posts/add-category", data);
export const updatePostCategories = (data) =>
  API.put("/posts/update-categories", data);
export const getPostCategories = (postId) =>
  API.get(`/posts/${postId}/categories`);
export const getAllTags = () => API.get("/posts/tags");
export const assignTagToPost = (data) => API.post("/posts/add-tag", data);
export const updatePostTags = (data) => API.put("/posts/update-tags", data);
export const getPostTags = (postId) => API.get(`/posts/${postId}/tags`);
