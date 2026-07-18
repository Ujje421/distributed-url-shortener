import React from 'react';
import { Link } from 'react-router-dom';

const Placeholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h1 className="text-5xl font-bold font-serif text-charcoal-900 mb-6">{title}</h1>
      <p className="text-gray-500 mb-8 max-w-lg">
        This section is currently under development. Please check back later.
      </p>
      <Link to="/" className="px-8 py-3 bg-charcoal-900 text-white rounded-full font-bold hover:bg-black transition-colors">
        Back to Home
      </Link>
    </div>
  );
};

export default Placeholder;
