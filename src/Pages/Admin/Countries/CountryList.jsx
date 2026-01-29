import React, { useState, useEffect } from "react";
import { countryAPI } from "../../../api/countryAPI";
import { Link, useLocation } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const CountryList = () => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        fetchCountries();
    }, [location]);

    const fetchCountries = async () => {
        try {
            setLoading(true);
            const response = await countryAPI.getAdminCountries();
            setCountries(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch countries", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this country?")) {
            try {
                await countryAPI.deleteCountry(id);
                fetchCountries();
            } catch (error) {
                alert("Failed to delete country");
            }
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex items-end justify-between pb-6 border-b border-neutral-200">
                    <div>
                        <h1 className="text-3xl font-light tracking-tight text-neutral-900">Countries</h1>
                        <p className="text-neutral-500 mt-1 text-sm font-mono">Manage country list</p>
                    </div>
                    <Link
                        to="/admin/countries/add"
                        className="h-9 px-4 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-2"
                    >
                        <FaPlus size={12} />
                        Add Country
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white border border-neutral-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : countries.length === 0 ? (
                        <div className="py-12 px-6 text-center text-sm text-neutral-500">
                            No countries found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-200">
                                        <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">ID</th>
                                        <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Name</th>
                                        <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Code</th>
                                        <th className="text-left py-3 px-6 text-xs font-mono uppercase tracking-wider text-neutral-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {countries.map((country) => (
                                        <tr key={country.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                            <td className="py-4 px-6 text-neutral-600 font-mono">#{country.id}</td>
                                            <td className="py-4 px-6 font-light text-neutral-900">{country.name}</td>
                                            <td className="py-4 px-6 text-neutral-600 font-mono text-xs uppercase tracking-wider">{country.code2}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/admin/countries/edit/${country.id}`}
                                                        className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit size={14} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(country.id)}
                                                        className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CountryList;