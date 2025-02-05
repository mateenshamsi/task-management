import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Register() {
  const navigate = useNavigate(); // Correct way to navigate
  const { userInfo } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [redirect, setRedirect] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return;
    } else {
      setEmailError('');
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    } else {
      setPasswordError('');
    }

    if (!username) {
      setUsernameError('Username is required');
      return;
    } else {
      setUsernameError('');
    }

    try {
      const result = await axios.post('/api/register', { username, email, password });
      if (result && result.data) {
        toast.success('Signed Up successfully');
        setRedirect(true); // This will trigger navigation in useEffect
      } else {
        toast.error('Error signing up');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error occurred during registration');
    }
  };

  // Handle redirection after successful registration
  useEffect(() => {
    if (redirect) {
      navigate('/login'); // Redirects to login page
    }
  }, [redirect, navigate]);

  // If user is already logged in, redirect to task board
  if (userInfo) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mb-[190px] flex flex-col min-h-screen justify-center items-center">
      <h1 className="text-4xl font-bold mb-12">Register</h1>

      <form className="mb-6" onSubmit={handleRegister}>
        <label htmlFor="username" className="block mb-2 text-2xl">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="outline-none mb-4 w-full rounded-lg px-4 py-2 border"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {usernameError && <p className="text-red-500 text-sm mb-4">{usernameError}</p>}

        <label htmlFor="email" className="block mb-2 text-2xl">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="outline-none mb-4 w-full rounded-lg px-4 py-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p className="text-red-500 text-sm mb-4">{emailError}</p>}

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

        <div className="flex justify-center mt-4">
          <button className="bg-gray-400 rounded-lg w-full px-4 py-2">Register</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
