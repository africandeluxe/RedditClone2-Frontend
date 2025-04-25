import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Post } from "../types";
import { getPosts, votePost } from "../services/api";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import LogoutButton from "../components/LogoutButton";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [voteError, setVoteError] = useState("");
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleVote = async (postId: string, direction: 1 | -1) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await votePost(postId, direction);
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
      setVoteError("");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to vote on post";
      setVoteError(msg);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-accent mb-8">Recent Posts</h1>
        {voteError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {voteError}
            </div>
          )}
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg text-primary-dark">No posts yet. Be the first to create one!</p>
            <Link to="/create-post" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
              Create Post
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard key={post._id} post={post} onVote={(direction) => handleVote(post._id, direction)}showFullContent={false} 
              currentUserId={user?._id}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;