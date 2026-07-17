import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shortenUrl } from '../api';

const Home: React.FC = () => {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // For now, alias is not sent to backend per backend spec, but we allow user to type it
      const response = await shortenUrl(url);
      setShortUrl(response.short_url);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div className="flex flex-col items-center pt-16">
      {/* Main Form Section */}
      <div className="w-full max-w-2xl bg-[#E8DCD1] rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-[#D5C5B5]/30 relative overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2a2420] text-center mb-10 tracking-tight">
          Shorten Your Link
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste long url here..."
              className="w-full px-6 py-4 rounded-full border-none focus:ring-4 focus:ring-[#7C5236]/20 shadow-inner bg-[#F4F0EB] text-[#2a2420] placeholder-[#8c7e73] text-lg outline-none transition-all"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8c7e73] font-medium">swiftzip.co/</span>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="alias (optional)"
                className="w-full pl-[110px] pr-6 py-4 rounded-full border-none focus:ring-4 focus:ring-[#7C5236]/20 shadow-inner bg-[#F4F0EB] text-[#2a2420] placeholder-[#8c7e73] text-lg outline-none transition-all"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-4 rounded-full bg-[#7C5236] text-white font-bold text-lg hover:bg-[#68432a] active:scale-[0.98] transition-all disabled:opacity-70 shadow-lg shadow-[#7C5236]/20 whitespace-nowrap"
            >
              {isLoading ? 'Zipping...' : 'Zip It!'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 text-center text-red-600 bg-red-100/50 py-3 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#D5C5B5]/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-grow overflow-hidden">
                <p className="text-sm text-[#8c7e73] font-medium mb-1 uppercase tracking-wider">Your Shortened URL</p>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-[#7C5236] hover:underline truncate block">
                  {shortUrl}
                </a>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={handleCopy}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[#F4F0EB] text-[#7C5236] font-semibold hover:bg-[#eadecc] transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={() => navigate('/dashboard', { state: { shortCode: shortUrl.split('/').pop() } })}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-[#2a2420] text-white font-semibold hover:bg-black transition-colors"
                >
                  Analytics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 text-center text-[#8c7e73] text-sm max-w-md">
        <p>A portfolio project by Ujjwal Jagtap showcasing Distributed Systems, FastAPI, React, and Redis Caching.</p>
      </div>
    </div>
  );
};

export default Home;
