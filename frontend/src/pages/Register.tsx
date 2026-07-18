import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
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
      const data = await registerUser(email, password);
      login(data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-24 p-8 bg-white rounded-[2rem] shadow-xl text-center border border-gray-100">
      <h2 className="text-3xl font-bold font-serif text-charcoal-900 mb-6">Create an Account</h2>
      <p className="text-gray-500 mb-8">Join us to start branding your short links.</p>
      
      {error && <div className="mb-4 text-sm font-bold text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="text" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name" 
          className="w-full px-6 py-4 rounded-2xl bg-cream-100/50 focus:ring-2 focus:ring-mint-500/50 outline-none text-charcoal-900 font-medium"
        />
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
          className="w-full py-4 mt-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-[#e05b3d] transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-70"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
