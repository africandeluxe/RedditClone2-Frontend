import { Comment, User } from "../types";
import { FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
  onDelete: (commentId: string) => void;
  onVote: (commentId: string, vote: 1 | -1) => void;
}

const CommentList = ({ comments, currentUserId, onDelete, onVote }: CommentListProps) => {
  const getAuthorDetails = (author: User | string | null | undefined): User => {
    if (!author || typeof author === "string") {
      return { _id: author || "", username: "Unknown", email: "" };
    }
    return author;
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const author = getAuthorDetails(comment.author);
        const canDelete = currentUserId === author._id;

        return (
          <div key={comment._id} className="bg-secondary p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-accent">{author.username}</span>
              {canDelete && (
                <button onClick={() => onDelete(comment._id)} className="text-primary hover:text-primary-dark" aria-label="Delete comment">
                  <FaTrash className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-primary-dark whitespace-pre-line">{comment.content}</p>
            <div className="flex items-center mt-2 space-x-2">
              <button onClick={() => onVote(comment._id, 1)} className="text-primary-light hover:text-primary" aria-label="Upvote">
                <FaArrowUp className="h-4 w-4" />
              </button>
              <span className="text-sm">{comment.votes ?? 0}</span>
              <button onClick={() => onVote(comment._id, -1)} className="text-primary-light hover:text-primary" aria-label="Downvote">
                <FaArrowDown className="h-4 w-4" />
              </button>
            </div>
            {comment.createdAt && (
              <p className="text-xs text-primary-light mt-2">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;