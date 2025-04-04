import { Link } from "react-router-dom";
import { Post } from "../types";
import { FaArrowUp, FaArrowDown, FaComment } from "react-icons/fa";

interface PostCardProps {
  post: Post;
  onVote: (vote: 1 | -1) => void;
  showFullContent?: boolean;
}

const PostCard = ({ post, onVote, showFullContent = false }: PostCardProps) => {
  const author = typeof post.author === "string" || !post.author
    ? { _id: "", username: "Unknown", email: "" }
    : post.author;

  const hasVoted = typeof author._id === "string" && post.voters.includes(author._id);

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
      </div>
    </div>
  );
};

export default PostCard;