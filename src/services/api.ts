import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (username: string, email: string, password: string) => {
  return api.post("/auth/register", { username, email, password });
};

export const login = (email: string, password: string) => {
  return api.post("/auth/login", { email, password });
};

export const getMe = () => {
  return api.get("/auth/me");
};

export const getPosts = () => {
  return api.get("/posts");
};

export const getPost = (id: string) => {
  return api.get(`/posts/${id}`);
};

export const createPost = (title: string, content: string) => {
  return api.post("/posts", { title, content });
};

export const updatePost = (id: string, title: string, content: string) => {
  return api.put(`/posts/${id}`, { title, content });
};

export const deletePost = (id: string) => {
  return api.delete(`/posts/${id}`);
};

export const votePost = (id: string, vote: 1 | -1) => {
  return api.post(`/posts/${id}/vote`, { vote });
};

export const createComment = (postId: string, content: string) => {
  return api.post(`/comments/${postId}`, { content });
};

export const deleteComment = (id: string) => {
  return api.delete(`/comments/${id}`);
};

export const voteComment = (id: string, vote: 1 | -1) => {
  return api.post(`/comments/${id}/vote`, { vote });
};

export const getMyPosts = () => {
  return api.get("/posts/my-posts");
};

export const updateUsername = (username: string) => {
  return api.put("/auth/update-username", { username });
};

export default api;