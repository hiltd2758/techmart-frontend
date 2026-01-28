import React, { useState, useEffect } from "react";
import { countryAPI } from "../../../api/countryAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const EditCountry = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        code2: "",
        code3: "",
        isBillingEnabled: true,
        isShippingEnabled: true,
        isCityEnabled: true,
        isZipCodeEnabled: true,
        isDistrictEnabled: true
    });

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const response = await countryAPI.getCountryById(id);
                const data = response.data.data || response.data;
                setFormData({
                    name: data.name || "",
                    code2: data.code2 || "",
                    code3: data.code3 || "",
                    isBillingEnabled: data.isBillingEnabled ?? true,  // Dùng ?? thay vì ||
                    isShippingEnabled: data.isShippingEnabled ?? true,
                    isCityEnabled: data.isCityEnabled ?? true,
                    isZipCodeEnabled: data.isZipCodeEnabled ?? true,
                    isDistrictEnabled: data.isDistrictEnabled ?? true
                });
            } catch (error) {
                console.error("Failed to fetch country details", error);
                alert("Failed to load country details.");
                navigate("/admin/countries");
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchCountry();
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await countryAPI.updateCountry(id, formData);
            alert("Country updated successfully!");
            navigate("/admin/countries");
        } catch (error) {
            console.error("Failed to update country", error);
            alert("Failed to update country. Please check the inputs.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center text-gray-500">Loading country details...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/admin/countries" className="text-gray-500 hover:text-gray-700">
                        <FaArrowLeft />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Country</h1>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                placeholder="e.g. Vietnam"
                            />
                        </div>

                        {/* Codes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ISO Code (2 chars)</label>
                            <input
                                type="text"
                                name="code2"
                                required
                                maxLength={2}
                                value={formData.code2}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                placeholder="e.g. VN"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ISO Code (3 chars)</label>
                            <input
                                type="text"
                                name="code3"
                                required
                                maxLength={3}
                                value={formData.code3}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                placeholder="e.g. VNM"
                            />
                        </div>
                    </div>

                    {/* Settings Toggles */}
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { key: "isBillingEnabled", label: "Billing Enabled" },
                                { key: "isShippingEnabled", label: "Shipping Enabled" },
                                { key: "isCityEnabled", label: "City Required" },
                                { key: "isZipCodeEnabled", label: "Zip Code Required" },
                                { key: "isDistrictEnabled", label: "District Required" },
                            ].map((setting) => (
                                <label key={setting.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        name={setting.key}
                                        checked={formData[setting.key]}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 border-gray-300"
                                    />
                                    <span className="text-gray-700 font-medium">{setting.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <Link
                            to="/admin/countries"
                            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                        >
                            <FaSave />
                            {loading ? "Saving..." : "Update Country"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCountry;
