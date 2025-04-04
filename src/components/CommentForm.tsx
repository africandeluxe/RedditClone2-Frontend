import { useState } from "react";

interface CommentFormProps {
  onSubmit: (content: string) => void;
}

const CommentForm = ({ onSubmit }: CommentFormProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-accent mb-3">Add a comment</h3>
      <textarea value={content} onChange={(e) => setContent(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        rows={3} placeholder="What are your thoughts?" required />
      <div className="mt-3 flex justify-end">
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          Post Comment
        </button>
      </div>
    </form>
  );
};

export default CommentForm;