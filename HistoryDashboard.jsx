import React, { useState } from 'react';
import {
    Droplets, Leaf, CircleDollarSign, ShieldCheck,
    TrendingUp, AlertTriangle, Clock, Wallet, Menu, X
} from 'lucide-react';
// Import the raw CSS file provided by the user
import '../history.css';

export default function HistoryDashboard() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden font-['Outfit']">
            {/* Background decorative elements (if defined in dashboard.css) */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>

            {/* Navbar */}
            <nav className="navbar flex justify-between items-center p-4 bg-white shadow-sm z-50 relative">
                <div className="logo text-xl font-bold text-green-700">Logo</div>

                <div className="nav-links hidden md:flex items-center gap-6">
                    <a href="#" className="hover:text-green-600 transition">Home</a>
                    <a href="#" className="hover:text-green-600 transition">About Us</a>
                    <a href="#" className="hover:text-green-600 transition">Language</a>
                    <a href="#" className="hover:text-green-600 transition">Services</a>
                    <a href="#" className="contact-btn px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Contact</a>
                </div>

                <div className="md:hidden cursor-pointer p-2" onClick={toggleMenu}>
                    <Menu className="w-6 h-6 text-gray-700" />
                </div>
            </nav>

            {/* Overlay Menu for Mobile */}
            <div className={`overlay-menu fixed inset-0 bg-green-900 bg-opacity-95 z-50 flex flex-col justify-center items-center transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <span className="close-btn absolute top-6 right-6 text-white cursor-pointer" onClick={toggleMenu}>
                    <X className="w-8 h-8" />
                </span>
                <div className="menu-items flex flex-col items-center gap-6 text-xl text-white">
                    <a href="#" className="hover:text-green-300 transition">Home</a>
                    <a href="#" className="hover:text-green-300 transition">New Releases</a>
                    <a href="#" className="hover:text-green-300 transition">Alerts</a>
                    <a href="#" className="active font-bold text-green-400">History</a>
                    <a href="#" className="hover:text-green-300 transition">My Credits</a>
                    <a href="#" className="hover:text-green-300 transition">Government Schemes</a>
                    <a href="#" className="hover:text-green-300 transition">Profile Editing</a>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl history-container py-8 relative z-10">
                <h1 className="page-title text-3xl font-bold text-gray-800 mb-8">Farming History & Analytics</h1>

                {/* Stats Overview */}
                <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="stat-card bg-white rounded-2xl p-6 flex items-center gap-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                        <div className="stat-icon-bg w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                            <Droplets className="w-7 h-7" />
                        </div>
                        <div className="stat-info">
                            <h3 className="text-sm text-gray-500 font-medium mb-1">Avg. Water Availability</h3>
                            <p className="value text-2xl font-bold text-gray-800">450 <small className="text-sm text-gray-400 font-normal">mm/acre</small></p>
                            <div className="trend positive text-xs text-green-500 flex items-center gap-1 mt-1 font-medium">
                                <TrendingUp className="w-3 h-3" /> 12% vs last year
                            </div>
                        </div>
                    </div>

                    <div className="stat-card bg-white rounded-2xl p-6 flex items-center gap-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                        <div className="stat-icon-bg w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                            <Leaf className="w-7 h-7" />
                        </div>
                        <div className="stat-info">
                            <h3 className="text-sm text-gray-500 font-medium mb-1">Total Water Saved</h3>
                            <p className="value text-2xl font-bold text-gray-800">12,500 <small className="text-sm text-gray-400 font-normal">Liters</small></p>
                            <div className="trend positive text-xs text-green-500 flex items-center gap-1 mt-1 font-medium">
                                <TrendingUp className="w-3 h-3" /> 8% vs last season
                            </div>
                        </div>
                    </div>

                    <div className="stat-card bg-white rounded-2xl p-6 flex items-center gap-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                        <div className="stat-icon-bg w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                            <CircleDollarSign className="w-7 h-7" />
                        </div>
                        <div className="stat-info">
                            <h3 className="text-sm text-gray-500 font-medium mb-1">Cost Efficiency</h3>
                            <p className="value text-2xl font-bold text-gray-800">₹15,000 <small className="text-sm text-gray-400 font-normal">Saved</small></p>
                            <div className="trend positive text-xs text-green-500 mt-1 font-medium">Through Drip/Sprinkler</div>
                        </div>
                    </div>

                    <div className="stat-card bg-white rounded-2xl p-6 flex items-center gap-5 shadow-sm border border-rose-100 hover:-translate-y-1 transition-transform">
                        <div className="stat-icon-bg w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div className="stat-info">
                            <h3 className="text-sm text-gray-500 font-medium mb-1">Buffer Stock Utilized</h3>
                            <p className="value text-2xl font-bold text-gray-800">5,000 <small className="text-sm text-gray-400 font-normal">Liters</small></p>
                            <div className="trend positive text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                                <AlertTriangle className="w-3 h-3" /> During May '24 Heatwave
                            </div>
                        </div>
                    </div>
                </div>

                {/* Layout Split: History List & Comparison */}
                <div className="history-layout grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* Left: Comparison Table */}
                    <section className="comparison-section card col-span-1 lg:col-span-3 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="section-header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Performance Comparison</h2>
                            <select className="compare-select px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition">
                                <option>Current vs Last Season</option>
                                <option>Wheat 2024 vs Wheat 2023</option>
                            </select>
                        </div>

                        <div className="table-responsive overflow-x-auto">
                            <table className="comparison-table w-full min-w-[500px]">
                                <thead>
                                    <tr className="border-b-2 border-gray-100">
                                        <th className="text-left py-4 px-2 text-sm font-semibold text-gray-500">Metric</th>
                                        <th className="text-left py-4 px-2 text-sm font-semibold text-gray-500">Old Plan (2023)</th>
                                        <th className="text-left py-4 px-2 text-sm font-semibold text-gray-500">New Plan (2024)</th>
                                        <th className="text-left py-4 px-2 text-sm font-semibold text-gray-500">Impact</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="py-4 px-2">
                                            <div className="metric-name flex items-center gap-2 text-gray-700 font-medium">
                                                <Droplets className="w-4 h-4 text-blue-500 text-sm" /> Water Consumption
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-gray-700 font-medium">4,500 L/acre</td>
                                        <td className="py-4 px-2 text-gray-700 font-medium">3,200 L/acre</td>
                                        <td className="py-4 px-2">
                                            <span className="status-good bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">-28% (Saved)</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="py-4 px-2">
                                            <div className="metric-name flex items-center gap-2 text-gray-700 font-medium">
                                                <Wallet className="w-4 h-4 text-slate-500 text-sm" /> Cost of Irrigation
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-gray-700 font-medium">₹12,000</td>
                                        <td className="py-4 px-2 text-gray-700 font-medium">₹8,500</td>
                                        <td className="py-4 px-2">
                                            <span className="status-good bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">Save ₹3,500</span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 transition">
                                        <td className="py-4 px-2">
                                            <div className="metric-name flex items-center gap-2 text-gray-700 font-medium">
                                                <Timer className="w-4 h-4 text-orange-500 text-sm" /> Pump Usage
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-gray-700 font-medium">150 Hours</td>
                                        <td className="py-4 px-2 text-gray-700 font-medium">110 Hours</td>
                                        <td className="py-4 px-2">
                                            <span className="status-good bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">-40 Hours</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Right: History List */}
                    <section className="history-list-section col-span-1 lg:col-span-2 flex flex-col">
                        <div className="section-header flex flex-col xl:flex-row justify-between xl:items-center mb-6 gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Previous Plans</h2>
                            <div className="filter-controls flex gap-2 flex-wrap">
                                {['All', 'Kharif', 'Rabi'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeFilter === filter
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="history-items flex flex-col gap-4">
                            {/* Item 1 */}
                            <div className="history-card-item bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100 hover:border-green-500 hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <div className="card-left flex items-center gap-4">
                                    <div className="crop-icon w-12 h-12 bg-blue-50 text-2xl flex items-center justify-center rounded-xl">🌾</div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800">Wheat (Rabi)</h3>
                                        <span className="date text-xs text-gray-400">12 Jan 2024</span>
                                    </div>
                                </div>
                                <div className="card-right flex flex-col items-end gap-2">
                                    <span className="tag bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-semibold">Completed</span>
                                    <button className="btn-open-plan text-xs font-semibold text-green-600 border border-green-600 px-3 py-1.5 rounded-lg hover:bg-green-600 hover:text-white transition-colors">Open Plan</button>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="history-card-item bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100 hover:border-green-500 hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <div className="card-left flex items-center gap-4">
                                    <div className="crop-icon w-12 h-12 bg-yellow-50 text-2xl flex items-center justify-center rounded-xl">🌽</div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800">Maize (Kharif)</h3>
                                        <span className="date text-xs text-gray-400">15 June 2023</span>
                                    </div>
                                </div>
                                <div className="card-right flex flex-col items-end gap-2">
                                    <span className="tag bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-semibold">Archived</span>
                                    <button className="btn-open-plan text-xs font-semibold text-green-600 border border-green-600 px-3 py-1.5 rounded-lg hover:bg-green-600 hover:text-white transition-colors">Open Plan</button>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="history-card-item bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100 hover:border-green-500 hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <div className="card-left flex items-center gap-4">
                                    <div className="crop-icon w-12 h-12 bg-red-50 text-2xl flex items-center justify-center rounded-xl">🍅</div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800">Tomato (Zaid)</h3>
                                        <span className="date text-xs text-gray-400">10 March 2023</span>
                                    </div>
                                </div>
                                <div className="card-right flex flex-col items-end gap-2">
                                    <span className="tag bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-semibold">Archived</span>
                                    <button className="btn-open-plan text-xs font-semibold text-green-600 border border-green-600 px-3 py-1.5 rounded-lg hover:bg-green-600 hover:text-white transition-colors">Open Plan</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
