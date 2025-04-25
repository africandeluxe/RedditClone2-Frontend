import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyPosts, updateUsername, deletePost } from "../services/api";
import { Post } from "../types";
import PostCard from "../components/PostCard";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getMyPosts();
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch your posts");
      }
    };
    fetchPosts();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await updateUsername(username);
      setMessage("Username updated successfully!");
    } catch (err) {
      setMessage("Failed to update username.");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
  
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-accent mb-6">My Profile</h1>

      <div className="mb-6">
        <label className="block text-sm mb-1 text-primary-dark">Username</label>
        <input className="border border-gray-300 px-3 py-2 rounded w-full" value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <button onClick={handleUpdate} className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
          Update Username
        </button>
        {message && <p className="mt-2 text-sm text-accent">{message}</p>}
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-primary-dark">My Posts</h2>
      <div className="space-y-4">
        {posts.length > 0 ? posts.map((post) => (
          <PostCard key={post._id} post={post} onVote={() => {}} currentUserId={user?._id}
          onDelete={() => handleDeletePost(post._id)} />
        )) : <p>No posts yet.</p>}
      </div>
    </div>
  );
};

export default ProfilePage;