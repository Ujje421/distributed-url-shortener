import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shortenUrl } from '../api';

const Home: React.FC = () => {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [expiresIn, setExpiresIn] = useState<number | undefined>(undefined);
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await shortenUrl(url, expiresIn);
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
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-black tracking-tight mb-4">
            Link Management, <span className="text-[#0070F3]">Simplified.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Create fast, secure, and distributed short links with advanced caching and rate-limiting.
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Destination URL</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/long-url"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0070F3] focus:ring-1 focus:ring-[#0070F3] text-black placeholder-gray-400 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-grow">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Alias (Optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">swiftzip.co/</span>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="alias"
                    className="w-full pl-[100px] pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#0070F3] focus:ring-1 focus:ring-[#0070F3] text-black placeholder-gray-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="w-full md:w-48">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiration</label>
                <select
                  value={expiresIn || ''}
                  onChange={(e) => setExpiresIn(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0070F3] focus:ring-1 focus:ring-[#0070F3] text-black bg-white outline-none transition-all"
                >
                  <option value="">Never</option>
                  <option value="1">1 Hour</option>
                  <option value="24">1 Day</option>
                  <option value="168">7 Days</option>
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-4 rounded-lg bg-black text-white font-semibold text-lg hover:bg-gray-800 active:scale-[0.99] transition-all disabled:opacity-70 disabled:active:scale-100"
            >
              {isLoading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>

          {error && (
            <div className="mt-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-100 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {shortUrl && (
            <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Your Shortened URL</label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-grow w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg flex items-center justify-between">
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-[#0070F3] font-medium hover:underline truncate">
                    {shortUrl}
                  </a>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopy}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => navigate('/dashboard', { state: { shortCode: shortUrl.split('/').pop() } })}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-[#0070F3] text-white font-medium hover:bg-[#0060df] transition-colors"
                  >
                    Analytics
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 text-center text-gray-400 text-sm max-w-md">
        <p>A portfolio project by Ujjwal Jagtap showcasing Distributed Systems, FastAPI, React, and Redis Caching.</p>
      </div>
    </div>
  );
};

export default Home;
