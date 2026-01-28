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
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Country Management</h2>
                <Link
                    to="/admin/countries/add"
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                    <FaPlus size={12} /> Add Country
                </Link>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm">
                                <th className="p-4">ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Code</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {countries.map((country) => (
                                <tr key={country.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-gray-600">#{country.id}</td>
                                    <td className="p-4 font-medium text-gray-900">
                                        {country.name}
                                    </td>
                                    <td className="p-4 text-gray-600">{country.code2}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                to={`/admin/countries/edit/${country.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(country.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <FaTrash />
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
    );
};

export default CountryList;