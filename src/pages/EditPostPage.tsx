import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { getPost, updatePost } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Post } from "../types";

const EditPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(id!);
        const postData = response.data;
        if (user?._id !== postData.author._id) {
          setError("You are not authorized to edit this post.");
          return;
        }
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
      } catch (err) {
        setError("Failed to load post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    try {
      await updatePost(id!, title, content);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError("Failed to update post.");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-accent mb-6">Edit Post</h1>
        <form onSubmit={handleSubmit} className="bg-secondary p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-accent mb-1">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}
             className="w-full px-3 py-2 border border-primary-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
             required maxLength={300}/>
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-accent mb-1">Content</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-primary-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={8} required />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => navigate(`/posts/${id}`)}
              className="px-4 py-2 border border-primary-light rounded-md text-primary-dark hover:bg-primary-light">Cancel</button>
            <button type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;