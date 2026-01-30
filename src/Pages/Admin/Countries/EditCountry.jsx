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
        <div className="min-h-screen bg-neutral-50 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex items-end justify-between pb-6 border-b border-neutral-200">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <button
                                onClick={() => navigate('/admin/countries')}
                                className="p-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
                            >
                                <FaArrowLeft size={16} />
                            </button>
                            <h1 className="text-3xl font-light tracking-tight text-neutral-900">Edit Country</h1>
                        </div>
                        <p className="text-neutral-500 mt-1 text-sm font-mono">Update country region details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white border border-neutral-200 p-6">
                            <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-900 mb-6">Country Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                                        Country Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900"
                                        placeholder="e.g. Vietnam"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                                            ISO Code (2 chars) *
                                        </label>
                                        <input
                                            type="text"
                                            name="code2"
                                            required
                                            maxLength={2}
                                            value={formData.code2}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 uppercase"
                                            placeholder="e.g. VN"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
                                            ISO Code (3 chars) *
                                        </label>
                                        <input
                                            type="text"
                                            name="code3"
                                            required
                                            maxLength={3}
                                            value={formData.code3}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 uppercase"
                                            placeholder="e.g. VNM"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="bg-white border border-neutral-200 p-6">
                            <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-900 mb-6">Settings</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { key: "isBillingEnabled", label: "Billing Enabled" },
                                    { key: "isShippingEnabled", label: "Shipping Enabled" },
                                    { key: "isCityEnabled", label: "City Required" },
                                    { key: "isZipCodeEnabled", label: "Zip Code Required" },
                                    { key: "isDistrictEnabled", label: "District Required" },
                                ].map((setting) => (
                                    <label key={setting.key} className="flex items-center gap-3 p-3 border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name={setting.key}
                                            checked={formData[setting.key]}
                                            onChange={handleChange}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm text-neutral-700">{setting.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <div className="bg-white border border-neutral-200 p-6 space-y-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-9 flex items-center justify-center gap-2 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50"
                            >
                                <FaSave size={12} />
                                {loading ? "Saving..." : "Update Country"}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/countries')}
                                className="w-full h-9 px-4 border border-neutral-200 text-neutral-700 text-xs font-mono uppercase tracking-wider hover:bg-neutral-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCountry;
