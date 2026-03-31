import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Catalog({ apiType }) {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedEquipment, setSelectedEquipment] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');

    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResources = async (isBackground = false) => {
            if (!isBackground) setLoading(true);
            setError('');

            try {
                let fetchedData = [];
                if (apiType === 'rest') {
                    const response = await axios.get(`/api/resources?role=${userRole}&t=${Date.now()}`);
                    fetchedData = response.data;
                } else {
                    const graphqlQuery = {
                        query: `{
                            getResources {
                                _id name target bodyPart equipment difficulty gifUrl cardImageUrl isActive overview secondaryMuscles exerciseTypes instructions youtubeLink
                            }
                        }`
                    };
                    const response = await axios.post('/graphql', graphqlQuery);

                    if (response.data.errors) {
                        throw new Error("GraphQL Error");
                    }

                    fetchedData = response.data.data.getResources || [];

                    if (userRole !== 'admin') {
                        fetchedData = fetchedData.filter(item => item.isActive);
                    }
                }
                setResources(fetchedData);
            } catch (err) {
                if (!isBackground) setError(`Failed to load exercises via ${apiType.toUpperCase()}.`);
            } finally {
                if (!isBackground) setLoading(false);
            }
        };

        fetchResources();


        const intervalId = setInterval(() => {
            fetchResources(true);
        }, 3000);

        return () => clearInterval(intervalId);

    }, [apiType, userRole]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await axios.delete(`/api/resources/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setResources(resources.filter(item => item._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting exercise');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await axios.patch(`/api/resources/${id}/toggle-status`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setResources(resources.map(item =>
                item._id === id ? { ...item, isActive: !item.isActive } : item
            ));
        } catch (err) {
            alert('Failed to change status');
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/edit/${id}`);
    };

    const getDifficultyColor = (difficulty) => {
        if (difficulty === 'beginner') return 'text-green-600';
        if (difficulty === 'intermediate') return 'text-yellow-500';
        if (difficulty === 'advanced') return 'text-red-600';
        return 'text-gray-600';
    };

    const uniqueCategories = ['All', ...new Set(resources.map(item => item.bodyPart))];
    const uniqueEquipments = ['All', ...new Set(resources.map(item => item.equipment))];
    const uniqueDifficulties = ['All', ...new Set(resources.map(item => item.difficulty))];

    const filteredResources = resources.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.bodyPart === selectedCategory;
        const matchesEquipment = selectedEquipment === 'All' || item.equipment === selectedEquipment;
        const matchesDifficulty = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;

        return matchesSearch && matchesCategory && matchesEquipment && matchesDifficulty;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-10 flex flex-col items-center gap-6">
                <input
                    type="text"
                    placeholder="Search exercises (e.g. Squat)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-2xl px-6 py-4 rounded-full border-2 border-gray-100 shadow-sm focus:outline-none focus:border-black transition-all text-lg"
                />

                <div className="w-full flex flex-col gap-6 items-center">
                    <div className="w-full">
                        <p className="text-center text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Body Part</p>
                        <div className="flex gap-2 flex-wrap justify-center">
                            {uniqueCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${selectedCategory === category ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full">
                        <p className="text-center text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Equipment</p>
                        <div className="flex gap-2 flex-wrap justify-center">
                            {uniqueEquipments.map(eq => (
                                <button
                                    key={eq}
                                    onClick={() => setSelectedEquipment(eq)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${selectedEquipment === eq ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    {eq}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full">
                        <p className="text-center text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Difficulty</p>
                        <div className="flex gap-2 flex-wrap justify-center">
                            {uniqueDifficulties.map(diff => (
                                <button
                                    key={diff}
                                    onClick={() => setSelectedDifficulty(diff)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${selectedDifficulty === diff ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center mt-20">
                    <h2 className="text-2xl font-bold text-gray-700">Loading exercises... ⏳</h2>
                </div>
            ) : error ? (
                <div className="text-center mt-20">
                    <h2 className="text-xl font-bold text-red-600">{error}</h2>
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-xl text-gray-400 font-medium">No exercises found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredResources.map((item) => (
                        <div key={item._id} className={`group relative flex flex-col rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-xl hover:-translate-y-1 ${!item.isActive && 'opacity-60'}`}>

                            {userRole === 'admin' && !item.isActive && (
                                <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-[10px] font-black uppercase z-10">
                                    Draft
                                </div>
                            )}

                            {userRole === 'admin' && (
                                <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleToggleStatus(item._id)} className="p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-black hover:text-white transition-colors">
                                        {item.isActive ? '🕶️' : '👁️'}
                                    </button>
                                    <button onClick={() => handleEdit(item._id)} className="p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-black hover:text-white transition-colors">
                                        ✏️
                                    </button>
                                    <button onClick={() => handleDelete(item._id, item.name)} className="p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-red-600 hover:text-white transition-colors">
                                        ❌
                                    </button>
                                </div>
                            )}

                            <div className="aspect-square p-6 flex items-center justify-center bg-white rounded-t-2xl overflow-hidden">
                                {item.cardImageUrl ? (
                                    <img
                                        src={item.cardImageUrl}
                                        alt={item.name}
                                        onClick={() => setSelectedItem(item)}
                                        className="max-h-full max-w-full object-contain cursor-pointer transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <span className="text-gray-300">No image</span>
                                )}
                            </div>

                            <div className="p-6 pt-0 flex flex-col flex-grow">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                    {item.bodyPart}
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 capitalize mb-4 leading-tight">
                                    {item.name}
                                </h3>

                                <div className="space-y-1 mb-6 text-sm text-gray-500">
                                    <p><strong>Target:</strong> <span className="capitalize">{item.target}</span></p>
                                    <p><strong>Equipment:</strong> <span className="capitalize">{item.equipment}</span></p>
                                </div>

                                <div className="mt-auto flex items-center justify-between">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(item.difficulty)}`}>
                                        {item.difficulty}
                                    </span>
                                    <button
                                        disabled={!item.isActive && userRole !== 'admin'}
                                        onClick={() => setSelectedItem(item)}
                                        className="px-5 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-widest disabled:bg-gray-200 disabled:cursor-not-allowed"
                                    >
                                        Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedItem && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md" onClick={() => setSelectedItem(null)}>
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>

                        <button onClick={() => setSelectedItem(null)} className="absolute top-6 right-6 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold z-50 hover:scale-110 transition-transform">
                            ✕
                        </button>

                        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
                            <img src={selectedItem.gifUrl} alt={selectedItem.name} className="max-h-full max-w-full rounded-xl mix-blend-multiply" />
                        </div>

                        <div className="md:w-1/2 p-8 sm:p-12 overflow-y-auto">
                            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-6">
                                {selectedItem.name}
                            </h2>

                            <div className="flex flex-wrap gap-2 mb-8">
                                <span className="px-3 py-1.5 bg-gray-100 rounded-md text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                    🎯 {selectedItem.target}
                                </span>
                                {selectedItem.exerciseTypes?.map(type => (
                                    <span key={type} className="px-3 py-1.5 bg-black text-white rounded-md text-[10px] font-bold uppercase tracking-widest">
                                        ⚡ {type}
                                    </span>
                                ))}
                                {selectedItem.secondaryMuscles?.map(muscle => (
                                    <span key={muscle} className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-md text-[10px] font-bold uppercase tracking-widest">
                                        🔄 {muscle}
                                    </span>
                                ))}
                            </div>

                            {selectedItem.overview && (
                                <div className="mb-8 p-6 bg-gray-50 rounded-2xl border-l-4 border-black">
                                    <p className="text-gray-600 text-sm leading-relaxed italic">
                                        "{selectedItem.overview}"
                                    </p>
                                </div>
                            )}

                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4 pb-2 border-b-2 border-gray-100">
                                Execution Steps
                            </h3>
                            <ul className="space-y-4 mb-10 text-sm text-gray-600 leading-relaxed">
                                {selectedItem.instructions?.map((step, index) => (
                                    <li key={index} className="flex gap-4">
                                        <span className="font-black text-black">{index + 1}.</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>

                            {selectedItem.youtubeLink && (
                                <a href={selectedItem.youtubeLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-[#FF0000] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#CC0000] transition-colors shadow-lg shadow-red-200">
                                    Watch Video Tutorial
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Catalog;