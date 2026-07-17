import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-24 p-8 bg-white rounded-[2rem] shadow-xl text-center">
      <h2 className="text-3xl font-bold font-serif text-charcoal-900 mb-6">Welcome Back</h2>
      <p className="text-gray-500 mb-8">Login to manage your URLs and custom domains.</p>
      <form className="flex flex-col gap-4">
        <input 
          type="email" 
          placeholder="Email address" 
          className="w-full px-6 py-4 rounded-2xl bg-cream-100/50 focus:ring-2 focus:ring-mint-500/50 outline-none text-charcoal-900"
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full px-6 py-4 rounded-2xl bg-cream-100/50 focus:ring-2 focus:ring-mint-500/50 outline-none text-charcoal-900"
        />
        <button type="submit" className="w-full py-4 mt-4 bg-charcoal-900 text-white font-bold rounded-2xl hover:bg-black transition-colors">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
