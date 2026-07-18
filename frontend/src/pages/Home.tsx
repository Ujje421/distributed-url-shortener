import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shortenUrl } from '../api';
import { CheckCircle, ShieldCheck, Sliders, Zap } from 'lucide-react';

const Home: React.FC = () => {
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [expiresIn] = useState<number | undefined>(undefined);
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // NOTE: Custom domain shortening will be implemented in the backend soon.
      // For now, we pass it along if the API supports it, or it will be ignored.
      const response = await shortenUrl(url, expiresIn);
      
      // Temporary client-side mock for custom domain display until backend is updated
      if (domain && !error) {
        const path = response.short_url.split('/').pop();
        setShortUrl(`https://${domain}/${path}`);
      } else {
        setShortUrl(response.short_url);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* HERO SECTION */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-20 pb-24 text-center flex flex-col items-center relative">
        <h1 className="text-5xl md:text-7xl font-bold font-serif text-charcoal-900 leading-[1.1] mb-6 tracking-tight">
          Make Your URL <span className="text-white bg-orange-500 px-3 py-1 inline-block -rotate-2 transform">Short</span><br/>
          Branded And Practical
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-12 font-medium">
          Link Management Platform with all features you need in one place. Shorten, brand, manage and track your links the easy way.
        </p>

        {/* Shortener Widget */}
        <div className="w-full max-w-3xl relative z-10">
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 flex flex-col md:flex-row gap-3">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your long URL here..."
              className="flex-grow px-6 py-4 rounded-2xl bg-cream-100/50 border-none focus:ring-2 focus:ring-orange-500/30 text-charcoal-900 text-lg outline-none placeholder-gray-400"
            />
            
            {/* Domain Dropdown (Prep for Custom Domains feature) */}
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="px-4 py-4 rounded-2xl bg-cream-100/50 border-none focus:ring-2 focus:ring-orange-500/30 text-charcoal-900 font-semibold outline-none cursor-pointer"
            >
              <option value="">swiftzip.co</option>
              <option value="link.ujjwal.com">link.ujjwal.com</option>
            </select>

            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 rounded-2xl bg-charcoal-900 text-white font-bold text-lg hover:bg-black active:scale-[0.98] transition-all disabled:opacity-70 whitespace-nowrap"
            >
              {isLoading ? 'Shortening...' : 'Shorten'}
            </button>
          </form>

          {error && (
            <div className="mt-4 text-sm font-semibold text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100">
              {error}
            </div>
          )}

          {shortUrl && (
            <div className="mt-6 p-6 bg-white rounded-3xl shadow-xl border border-mint-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex-grow text-left">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Short Link</p>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-orange-500 hover:underline">
                  {shortUrl}
                </a>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => navigator.clipboard.writeText(shortUrl)}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-cream-100 text-charcoal-900 font-bold hover:bg-gray-200 transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={() => navigate('/dashboard', { state: { shortCode: shortUrl.split('/').pop() } })}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-mint-500 text-charcoal-900 font-bold hover:bg-[#75b0a3] transition-colors"
                >
                  Analytics
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full bg-white py-24 relative overflow-hidden">
        {/* Decorative background shape */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cream-100 rounded-bl-[150px] -z-0"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/3">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-charcoal-900 leading-tight mb-6">
              More than a URL Shortener
            </h2>
            <p className="text-gray-500 text-lg mb-8 font-medium">
              Explore our features and connect with your customers.
            </p>
            <button className="px-8 py-3 rounded-full border-2 border-charcoal-900 text-charcoal-900 font-bold hover:bg-charcoal-900 hover:text-white transition-all">
              View All Features
            </button>
          </div>
          
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-8 bg-cream-100 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
                <Zap className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-3">Functional</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">
                Use your short link on every platform and every social network without limitations.
              </p>
            </div>
            
            <div className="p-8 bg-cream-100 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-mint-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-mint-500/30">
                <Sliders className="text-charcoal-900 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-3">Customize</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">
                Rename your URL as you like and choose words related to your brand.
              </p>
            </div>

            <div className="p-8 bg-cream-100 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-charcoal-900 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-charcoal-900/30">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-3">Optimized & Safe</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">
                Search engines look favorably on short URLs. Safe redirection without risk of penalty.
              </p>
            </div>

            <div className="p-8 bg-cream-100 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="text-charcoal-900 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-3">Free</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">
                Create your short links for free with full access to our Redis-backed caching infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / STATS SECTION */}
      <section className="w-full bg-mint-500 py-24 px-6 rounded-t-[3rem] mt-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-charcoal-900 leading-tight mb-6">
              Make your URLs stand out with a free link shortener
            </h2>
            <p className="text-charcoal-900/80 text-lg mb-8 font-medium max-w-md">
              Used by thousands of developers to reliably redirect traffic across the globe with zero downtime.
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="px-10 py-4 rounded-full bg-charcoal-900 text-white font-bold text-lg hover:bg-black transition-colors shadow-xl"
            >
              Register Now
            </button>
          </div>
          
          <div className="md:w-1/2 w-full">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <h3 className="text-2xl font-bold text-charcoal-900 mb-2">SHORT IS BETTER 🚀</h3>
              <p className="text-gray-500 mb-6 font-medium text-sm leading-relaxed">
                Your URL is the first impression you give of yourself and your company. The shorter a link is, the more it will be considered reliable, easy to remember, and beautiful to show.
              </p>
              
              <div className="bg-cream-100 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Engagement</p>
                  <p className="text-4xl font-extrabold text-orange-500">86.5%</p>
                </div>
                <div className="w-16 h-16 rounded-full border-8 border-mint-500 border-t-orange-500 transform rotate-45"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
