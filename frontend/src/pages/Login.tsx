import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser(email, password);
      login(data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-24 p-8 bg-white rounded-[2rem] shadow-xl text-center border border-gray-100">
      <h2 className="text-3xl font-bold font-serif text-charcoal-900 mb-6">Welcome Back</h2>
      <p className="text-gray-500 mb-8">Login to manage your URLs and custom domains.</p>
      
      {error && <div className="mb-4 text-sm font-bold text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address" 
          className="w-full px-6 py-4 rounded-2xl bg-cream-100/50 focus:ring-2 focus:ring-mint-500/50 outline-none text-charcoal-900 font-medium"
        />
        <input 
          type="password" 
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password" 
          className="w-full px-6 py-4 rounded-2xl bg-cream-100/50 focus:ring-2 focus:ring-mint-500/50 outline-none text-charcoal-900 font-medium"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-4 mt-4 bg-charcoal-900 text-white font-bold rounded-2xl hover:bg-black transition-colors shadow-lg shadow-black/10 disabled:opacity-70"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
