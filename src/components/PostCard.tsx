import { Link, useNavigate } from "react-router-dom";
import { Post } from "../types";
import { FaArrowUp, FaArrowDown, FaComment, FaTrash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { deletePost } from "../services/api";
interface PostCardProps {
  post: Post;
  onVote: (vote: 1 | -1) => void;
  showFullContent?: boolean;
  currentUserId?: string;
  onDelete?: ()=> void;
}

const PostCard = ({ post, onVote, showFullContent = false, currentUserId, onDelete }: PostCardProps) => {
  const { user } = useAuth();

  const author = typeof post.author === "string" || !post.author
    ? { _id: "", username: "Unknown", email: "" }
    : post.author;

  const hasVoted = typeof author._id === "string" && post.voters.includes(author._id);
  const navigate = useNavigate();
  const isAuthor = currentUserId && post.author && typeof post.author !== "string" && post.author._id === currentUserId;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post._id);
        window.location.reload();
      } catch (err) {
        alert("Failed to delete post.");
      }
    }
  };

  return (
    <div className={`bg-secondary rounded-lg shadow-md overflow-hidden ${!showFullContent ? 'hover:shadow-lg transition-shadow' : ''}`}>
      {!showFullContent && (
        <Link to={`/posts/${post._id}`} className="block">
          <div className="p-4">
            <h2 className="text-xl font-bold text-accent mb-2">{post.title}</h2>
            <p className="text-primary-dark mb-4 line-clamp-3">{post.content}</p>
          </div>
        </Link>
      )}
      {showFullContent && (
        <div className="p-4">
          <h2 className="text-2xl font-bold text-accent mb-4">{post.title}</h2>
          <p className="text-primary-dark mb-6 whitespace-pre-line">{post.content}</p>
        </div>
      )}
      <div className="bg-secondary-dark px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => onVote(1)} className={`flex items-center ${hasVoted ? 'text-primary' : 'text-primary-light'} hover:text-primary`} aria-label="Upvote">
            <FaArrowUp className="h-4 w-4 mr-1" />
            <span>{post.votes}</span>
          </button>
          <button onClick={() => onVote(-1)} className={`flex items-center text-primary-light hover:text-primary`} aria-label="Downvote" 
            disabled={!hasVoted}>
            <FaArrowDown className="h-4 w-4 mr-1" />
          </button>
        </div>

        <div className="flex items-center text-primary-light">
          <FaComment className="h-4 w-4 mr-1" />
          <span>{post.comments.length} comments</span>
        </div>
        <div className="text-sm text-accent">Posted by {author.username}</div>

        {isAuthor && (
          <div className="flex space-x-2">
            <button onClick={() => navigate(`/edit-post/${post._id}`)} className="text-sm text-blue-600 hover:underline">Edit</button>
            {onDelete && ( 
              <button onClick={onDelete} className="text-sm text-red-600 hover:underline">Delete</button>
              )}
              </div>
            )}
            </div>
          </div>
        );
      };

export default PostCard;