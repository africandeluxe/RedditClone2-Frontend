import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-secondary-dark p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-accent">Reddit Clone</Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
            <Link to="/profile" className="text-primary hover:text-primary-dark">Profile</Link>
              <Link to="/create-post" className="text-primary hover:text-primary-dark">Create Post</Link>
              <button onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-primary hover:text-primary-dark">Login</Link>
              <Link to="/register" className="text-primary hover:text-primary-dark">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;