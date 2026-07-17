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
    <div className="w-full">
      <div className="mb-10 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <Search className="absolute left-4 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Enter short code (e.g. 1, 2) to view analytics..."
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            className="w-full pl-12 pr-[120px] py-4 rounded-xl border border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] bg-white text-black text-lg outline-none focus:border-[#0070F3] focus:ring-1 focus:ring-[#0070F3] transition-all"
          />
          <button type="submit" className="absolute right-2 bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Analyze
          </button>
        </form>
      </div>

      {isLoading && <div className="text-center text-gray-500 font-medium animate-pulse mt-12">Loading analytics...</div>}
      
      {error && <div className="text-center text-red-500 font-medium bg-red-50 p-4 rounded-xl max-w-xl mx-auto border border-red-100">{error}</div>}

      {analytics && !isLoading && (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 overflow-hidden flex flex-col relative mb-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 border-b border-gray-100 gap-4">
            <h1 className="text-2xl font-bold text-black flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg text-black">
                <LinkIcon className="w-5 h-5" />
              </div>
              /{shortCode}
            </h1>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-xs font-semibold border border-gray-200 tracking-wide uppercase text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live Data
            </div>
          </div>

          <div className="p-8">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-8 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Shortener
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 lg:col-span-2 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Clicks</h3>
                    <div className="text-4xl font-extrabold text-black">{analytics.total_clicks}</div>
                  </div>
                </div>
                
                <div className="h-64 mt-4">
                  {analytics.clicks_over_time.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.clicks_over_time} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={32}>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dx={-10} />
                        <Tooltip 
                          cursor={{fill: '#FAFAFA'}} 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #EAEAEA', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontWeight: 500 }} 
                        />
                        <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                          {analytics.clicks_over_time.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index === analytics.clicks_over_time.length - 1 ? '#0070F3' : '#EAEAEA'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No click data available yet.</div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Top Locations
                  </h3>
                  <div className="space-y-4">
                    {analytics.top_countries.length > 0 ? analytics.top_countries.map((country, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-black">{country.country}</span>
                        <span className="text-gray-500 font-semibold">{country.clicks}</span>
                      </div>
                    )) : <div className="text-sm text-gray-400">No data</div>}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Monitor className="w-4 h-4" /> Top Devices
                  </h3>
                  <div className="space-y-4">
                    {analytics.top_devices.length > 0 ? analytics.top_devices.map((dev, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-black">{dev.device}</span>
                        <span className="text-gray-500 font-semibold">{dev.clicks}</span>
                      </div>
                    )) : <div className="text-sm text-gray-400">No data</div>}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      
      {!analytics && !isLoading && !error && (
        <div className="text-center text-gray-400 font-medium mt-16 max-w-md mx-auto">
          Enter a short code above to view real-time analytics.
        </div>
      )}
    </div>
  );
}

export default Dashboard;
