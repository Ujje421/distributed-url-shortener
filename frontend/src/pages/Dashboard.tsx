import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, Search, Link as LinkIcon, Globe, Monitor } from 'lucide-react';
import { getAnalytics } from '../api';
import type { AnalyticsResponse } from '../api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [shortCode, setShortCode] = useState(location.state?.shortCode || '');
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalytics = async (code: string) => {
    if (!code) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getAnalytics(code);
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics.');
      setAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shortCode) {
      fetchAnalytics(shortCode);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalytics(shortCode);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-10 w-full max-w-2xl px-6">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <Search className="absolute left-6 text-gray-400 w-6 h-6" />
          <input
            type="text"
            placeholder="Enter short code (e.g. 1, 2) to view analytics..."
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            className="w-full pl-16 pr-[140px] py-5 rounded-full border-2 border-mint-500/20 shadow-xl bg-white text-charcoal-900 text-lg outline-none focus:border-mint-500 focus:ring-4 focus:ring-mint-500/20 transition-all font-medium"
          />
          <button type="submit" className="absolute right-3 bg-charcoal-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-colors">
            Analyze
          </button>
        </form>
      </div>

      {isLoading && <div className="text-center text-gray-500 font-bold animate-pulse mt-12">Loading real-time analytics...</div>}
      
      {error && <div className="text-center text-red-500 font-bold bg-red-50 p-4 rounded-xl max-w-xl mx-auto border border-red-100">{error}</div>}

      {analytics && !isLoading && (
        <div className="w-full max-w-6xl px-6 mb-16">
          <div className="bg-white rounded-[3rem] shadow-[0_20px_40px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col relative border-4 border-cream-100">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-10 border-b-2 border-cream-100 gap-4 bg-white z-10 relative">
              <h1 className="text-3xl font-bold font-serif text-charcoal-900 flex items-center gap-4">
                <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg shadow-orange-500/30">
                  <LinkIcon className="w-6 h-6" />
                </div>
                /{shortCode}
              </h1>
              <div className="flex items-center gap-3 bg-mint-500/20 px-6 py-3 rounded-full text-sm font-bold tracking-wide uppercase text-charcoal-900">
                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></div>
                Live Data Sync
              </div>
            </div>

            <div className="p-10 bg-cream-100/50">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-500 text-sm font-bold mb-8 hover:text-charcoal-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" /> Back to Shortener
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="bg-white rounded-[2rem] p-8 lg:col-span-2 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Total Clicks</h3>
                      <div className="text-5xl font-extrabold font-serif text-charcoal-900">{analytics.total_clicks}</div>
                    </div>
                  </div>
                  
                  <div className="h-72 mt-4">
                    {analytics.clicks_over_time.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.clicks_over_time} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={40}>
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#888', fontWeight: 600 }} dy={10} />
                          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#888', fontWeight: 600 }} dx={-10} />
                          <Tooltip 
                            cursor={{fill: '#F9F9F9'}} 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', fontWeight: 700, color: '#1A1A1A' }} 
                          />
                          <Bar dataKey="clicks" radius={[8, 8, 0, 0]}>
                            {analytics.clicks_over_time.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={index === analytics.clicks_over_time.length - 1 ? '#ef6c4f' : '#a5d6c8'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">No click data available yet.</div>
                    )}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-mint-500" /> Top Locations
                    </h3>
                    <div className="space-y-5">
                      {analytics.top_countries.length > 0 ? analytics.top_countries.map((country, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="font-bold text-charcoal-900 text-lg">{country.country}</span>
                          <span className="bg-cream-100 text-charcoal-900 font-bold px-3 py-1 rounded-lg">{country.clicks}</span>
                        </div>
                      )) : <div className="text-sm text-gray-400 font-medium">No data</div>}
                    </div>
                  </div>

                  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-orange-500" /> Top Devices
                    </h3>
                    <div className="space-y-5">
                      {analytics.top_devices.length > 0 ? analytics.top_devices.map((dev, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="font-bold text-charcoal-900 text-lg">{dev.device}</span>
                          <span className="bg-cream-100 text-charcoal-900 font-bold px-3 py-1 rounded-lg">{dev.clicks}</span>
                        </div>
                      )) : <div className="text-sm text-gray-400 font-medium">No data</div>}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
      
      {!analytics && !isLoading && !error && (
        <div className="text-center text-gray-400 font-bold mt-16 max-w-md mx-auto">
          Enter a short code above to view real-time analytics.
        </div>
      )}
    </div>
  );
}

export default Dashboard;
