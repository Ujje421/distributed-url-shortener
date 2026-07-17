import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, Search, Link as LinkIcon } from 'lucide-react';
import { getAnalytics } from '../api';
import type { AnalyticsResponse } from '../api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Try to grab short code from router state, otherwise leave blank
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
      {/* Search Bar for Analytics */}
      <div className="mb-8 max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Enter short code (e.g. 1, 2) to view analytics..."
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-full border-none shadow-sm bg-white text-[#2a2420] text-lg outline-none focus:ring-2 focus:ring-[#86C2B4] transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#86C2B4] text-white px-6 py-2 rounded-full font-bold hover:bg-[#6fa89a] transition-colors">
            Analyze
          </button>
        </form>
      </div>

      {isLoading && <div className="text-center text-[#8c7e73] font-bold text-lg animate-pulse mt-12">Loading real-time analytics...</div>}
      
      {error && <div className="text-center text-red-500 font-bold bg-red-50 p-4 rounded-xl max-w-xl mx-auto border border-red-200">{error}</div>}

      {analytics && !isLoading && (
        <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative mb-8 border border-gray-100">
          
          {/* Inner Header matching Pingalo aesthetic */}
          <div className="flex items-center justify-between p-8 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><LinkIcon className="text-[#E76F51]" /> {shortCode}</h1>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full text-sm font-medium border border-gray-200">
              <span className="text-gray-500">Analytics Live Sync</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Content Area with Mint Green Tint */}
          <div className="flex-1 bg-[#86C2B4]/10 p-8">
            
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-700 font-semibold mb-8 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Shortener
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Chart Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#E76F51] rounded-full"></div>
                    {analytics.total_clicks} <span className="text-sm font-semibold text-gray-500">Total Clicks</span>
                  </h3>
                </div>
                
                <div className="h-64">
                  {analytics.clicks_over_time.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.clicks_over_time} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={32}>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                        <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                          {analytics.clicks_over_time.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index === analytics.clicks_over_time.length - 1 ? '#E76F51' : '#F3F4F6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No click data available yet.</div>
                  )}
                </div>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-8">
                {/* Countries Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                    <div className="w-1 h-5 bg-[#E76F51] rounded-full"></div>
                    Top Countries
                  </h3>
                  <div className="space-y-4">
                    {analytics.top_countries.length > 0 ? analytics.top_countries.map((country, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm font-semibold text-gray-700">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">📍</span>
                          {country.country}
                        </div>
                        <span className="text-gray-900 bg-gray-50 px-2 py-1 rounded-md">{country.clicks}</span>
                      </div>
                    )) : <div className="text-sm text-gray-400">No data</div>}
                  </div>
                </div>

                {/* Devices Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
                    <div className="w-1 h-5 bg-[#E76F51] rounded-full"></div>
                    Top Devices
                  </h3>
                  <div className="space-y-4">
                    {analytics.top_devices.length > 0 ? analytics.top_devices.map((dev, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm font-semibold text-gray-700">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">💻</span>
                          {dev.device}
                        </div>
                        <span className="text-gray-900 bg-gray-50 px-2 py-1 rounded-md">{dev.clicks}</span>
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
        <div className="text-center text-[#8c7e73] font-medium mt-12 max-w-md mx-auto">
          Enter a short code above to view its real-time analytics. Data is aggregated directly from our PostgreSQL database.
        </div>
      )}
    </div>
  );
}

export default Dashboard;
