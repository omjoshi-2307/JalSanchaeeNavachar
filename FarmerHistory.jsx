import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, Calendar, Sprout, Droplets, AlertCircle } from "lucide-react";
import { getFarmerHistory } from "./historyService";

// Example mock UID. Replace with actual Authentication integration (e.g. from context)
const CURRENT_FARMER_UID = "mock_farmer_123";

export default function FarmerHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter and Search states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");

    useEffect(() => {
        // Replace CURRENT_FARMER_UID with the actual user's UID from Firebase Auth
        // e.g. auth.currentUser.uid
        fetchHistory(CURRENT_FARMER_UID);
    }, []);

    const fetchHistory = async (uid) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getFarmerHistory(uid);
            setHistory(data);
        } catch (err) {
            setError("Failed to load history. Make sure you have created the correct Firestore indexes.");
            console.error(err);

            // FOR DEMO PURPOSES: if index is missing or permissions fail, load mock data
            // You can remove this fallback once your Firestore rules and indexes are set up.
            setHistory([
                { id: "1", type: "Planting", crop: "Wheat", details: "Planted 5 acres", date: { seconds: Date.now() / 1000 - 86400 * 5 }, status: "Completed" },
                { id: "2", type: "Irrigation", crop: "Corn", details: "Applied 2 inches of water", date: { seconds: Date.now() / 1000 - 86400 * 2 }, status: "Completed" },
                { id: "3", type: "Harvesting", crop: "Soybeans", details: "Harvested 2 acres", date: { seconds: Date.now() / 1000 - 86400 * 10 }, status: "Pending" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Convert Firestore Timestamp to readable date
    const formatDate = (timestamp) => {
        if (!timestamp) return "Unknown Date";
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Derived state: Filtered History
    const filteredHistory = useMemo(() => {
        return history.filter(record => {
            // 1. Type Filter
            const matchesType = selectedType === "All" || record.type === selectedType;

            // 2. Search Filter (by crop or details)
            const matchesSearch =
                record.crop?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.type?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesType && matchesSearch;
        });
    }, [history, searchTerm, selectedType]);


    // Helper for dynamic icons
    const getTypeIcon = (type) => {
        switch (type) {
            case "Planting": return <Sprout className="w-5 h-5 text-green-500" />;
            case "Irrigation": return <Droplets className="w-5 h-5 text-blue-500" />;
            case "Harvesting": return <Calendar className="w-5 h-5 text-yellow-500" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden">

                {/* Header Section */}
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-6 text-white">
                    <h1 className="text-3xl font-bold">Farming History</h1>
                    <p className="text-green-100 mt-2 opacity-90">View past activities, irrigation, and crop logs.</p>
                </div>

                {/* Filters and Controls */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">

                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by crop, activity, or details..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="relative inline-block text-left w-full sm:w-48">
                        <div className="flex items-center relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-4 w-4 text-gray-400" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white appearance-none cursor-pointer transition-all"
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="All">All Activities</option>
                                <option value="Planting">Planting</option>
                                <option value="Irrigation">Irrigation</option>
                                <option value="Harvesting">Harvesting</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="p-4 bg-orange-50 border-l-4 border-orange-400 text-orange-700 m-6 rounded-r">
                        <p className="font-semibold">Notice:</p>
                        <p className="text-sm">{error}</p>
                        <p className="text-xs mt-1">Make sure you have an index on `farmerId` and `date` in Firestore.</p>
                    </div>
                )}

                {/* Content Section */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        </div>
                    ) : filteredHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <Calendar className="w-12 h-12 mb-3 text-gray-300" />
                            <p className="text-lg font-medium">No history found</p>
                            <p className="text-sm">Try adjusting your search or filter.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredHistory.map((record) => (
                                <div
                                    key={record.id}
                                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-white"
                                >

                                    {/* Left info */}
                                    <div className="flex items-start gap-4 mb-3 sm:mb-0">
                                        <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-green-50 transition-colors">
                                            {getTypeIcon(record.type)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{record.crop || "Unknown Crop"}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{record.details}</p>
                                        </div>
                                    </div>

                                    {/* Right Info */}
                                    <div className="flex flex-col sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-100 sm:border-0">
                                        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full w-fit mb-2 sm:mb-1">
                                            {record.type}
                                        </span>
                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(record.date)}
                                        </span>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
