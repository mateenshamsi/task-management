import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { Link, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [useDefaultCredentials, setUseDefaultCredentials] = useState(false); // Track checkbox state

  const handleLogin = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setPasswordError('');

    if (!username) {
      setUsernameError('Username is required');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    try {
      const result = await axios.post('/api/login', { username, password });
      const data = result.data;
      setUserInfo(data);

      if (result.status === 200 && data) {
        toast.success('Successfully signed in');
        setRedirect(true);
      } else {
        toast.error('Error signing in');
      }
    } catch (err) {
      console.error('Login error:', err.message);
      toast.error('An error occurred during login');
    }
  };

  // Handle default credentials if checkbox is checked
  React.useEffect(() => {
    if (useDefaultCredentials) {
      setUsername('admin');
      setPassword('admin@123');
    } else {
      setUsername('');
      setPassword('');
    }
  }, [useDefaultCredentials]);

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mb-[190px] flex flex-col min-h-screen justify-center items-center">
      <h1 className="text-4xl font-bold mb-12">Login</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}
      <form className="mb-6" onSubmit={handleLogin}>
        <label htmlFor="username" className="block mb-2 text-2xl">
          Username
        </label>
        <input
          type="username"
          id="username"
          name="username" 
          className="outline-none mb-4 w-full rounded-lg px-4 py-2 border"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {usernameError && <p className="text-red-500 text-sm mb-4">{usernameError}</p>}

        <label htmlFor="password" className="block mb-2 text-2xl">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="outline-none mb-2 w-full rounded-lg px-4 py-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}

        {/* Default credentials checkbox */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="use-default-credentials"
            checked={useDefaultCredentials}
            onChange={() => setUseDefaultCredentials(!useDefaultCredentials)}
            className="mr-2"
          />
          <label htmlFor="use-default-credentials" className="text-lg">
            Use Default Credentials (admin / admin@123)
          </label>
        </div>

        <div className="flex justify-center mt-4">
          <button className="bg-gray-400 rounded-lg w-full px-4 py-2">Login</button>
        </div>
        <p className="mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register " className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
