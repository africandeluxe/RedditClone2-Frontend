import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post, Comment, isComment } from '../types';
import { getPost, createComment, deleteComment, votePost, voteComment } from "../services/api";
import { useAuth } from "../context/AuthContext";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";
import PostCard from "../components/PostCard";

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voteError, setVoteError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(id!);
        setPost(response.data);
      } catch (err) {
        setError("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handlePostVote = async (vote: 1 | -1) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await votePost(id!, vote);


      const response = await getPost(id!);
      setPost(response.data);
      setVoteError("");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to vote on post";
      setVoteError(msg);
    }
  };

  const handleCommentVote = async (commentId: string, vote: 1 | -1) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const response = await voteComment(commentId, vote);
      setPost(prevPost => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          comments: prevPost.comments.map(c => 
            typeof c !== "string" && c._id === commentId ? response.data : c
          )
        };
      });
      setVoteError("");
    } catch (error:any) {
      const msg = error?.response?.data?.message || "Failed to vote on comment";
      setVoteError(msg);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const response = await createComment(id!, content);
      setPost(prevPost => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          comments: [...prevPost.comments, response.data]
        };
      });
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setPost(prevPost => {
        if (!prevPost) return null;
  
        const comments = prevPost.comments as (Comment | string)[];
  
        const validComments: Comment[] = comments.filter((c): c is Comment => {
          return typeof c !== 'string' && '_id' in c;
        });
  
        const filteredComments = validComments.filter(c => c._id !== commentId);
  
        return {
          ...prevPost,
          comments: filteredComments
        };
      });
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };
  

  const getValidComments = (comments: (Comment | string)[]): Comment[] => {
    return comments.filter((c): c is Comment => typeof c !== 'string');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
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

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-accent mb-4">Post not found</h2>
          <button onClick={() => navigate('/')} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <PostCard post={post} onVote={handlePostVote} showFullContent={true} />
        <div className="mt-8">
        {voteError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {voteError}
            </div>
          )}
          <h2 className="text-xl font-bold text-accent mb-4">Comments ({post.comments.length})</h2>
          {isAuthenticated && (
            <div className="mb-8">
              <CommentForm onSubmit={handleAddComment} />
            </div>
          )}

          {post.comments.length > 0 ? (
            <CommentList comments={getValidComments(post.comments)} currentUserId={user?._id} 
            postAuthorId={
              typeof post.author !== "string" ? post.author._id : undefined
            } onDelete={handleDeleteComment} onVote={handleCommentVote} />
          ) : (
            <div className="bg-secondary-dark p-4 rounded text-center">
              <p className="text-primary-dark">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;