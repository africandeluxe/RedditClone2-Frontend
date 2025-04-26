import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyPosts, updateUsername, deletePost, getMe } from "../services/api";
import { Post } from "../types";
import PostCard from "../components/PostCard";
import { uploadProfilePicture } from "../services/api";

const ProfilePage = () => {
  const { user, logout, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

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

  const handleUpload = async () => {
    if (!profilePicture || !user) return;
  
    try {
      await uploadProfilePicture(user._id, profilePicture);
      setMessage("Profile picture updated!");
      const {data:updatedUser}=await getMe();
      setUser(updatedUser);
      setUsername(updatedUser.username);
    } catch (error) {
      console.error("Failed to upload profile picture", error);
      setMessage("Failed to upload profile picture.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-accent mb-6">My Profile</h1>
      <div className="mb-6">
        <label className="block text-sm mb-1 text-primary-dark">Profile Picture</label>
        {user?.profilePicture ? (
          <div className="mb-2">
            <img 
            src={`${process.env.REACT_APP_BACKEND_URL}${user.profilePicture}`} alt="Profile" className="h-32 w-32 rounded-full object-cover"/>
            </div>
            ) : (
            <p className="text-primary-light mb-2">No profile picture uploaded.</p>
            )}
            <input type="file" onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setProfilePicture(e.target.files[0]);
              }
              }} />
              <button onClick={handleUpload} className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">Upload Profile Picture</button>
          </div>

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