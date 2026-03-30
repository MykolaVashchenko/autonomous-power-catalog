import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditResource() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        target: '',
        bodyPart: 'back',
        equipment: 'barbell',
        difficulty: 'beginner',
        secondaryMuscles: '',
        exerciseTypes: 'strength',
        overview: '',
        instructions: '',
        gifUrl: '',
        cardImageUrl: '',
        youtubeLink: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const response = await axios.get(`/api/resources/${id}`);
                const data = response.data;

                const instructionsText = data.instructions ? data.instructions.join('\n') : '';
                const secondaryMusclesText = data.secondaryMuscles ? data.secondaryMuscles.join(', ') : '';
                const exerciseTypeText = data.exerciseTypes && data.exerciseTypes.length > 0 ? data.exerciseTypes[0] : 'strength';

                setFormData({
                    name: data.name || '',
                    target: data.target || '',
                    bodyPart: data.bodyPart || 'back',
                    equipment: data.equipment || 'barbell',
                    difficulty: data.difficulty || 'beginner',
                    secondaryMuscles: secondaryMusclesText,
                    exerciseTypes: exerciseTypeText,
                    overview: data.overview || '',
                    instructions: instructionsText,
                    gifUrl: data.gifUrl || '',
                    cardImageUrl: data.cardImageUrl || '',
                    youtubeLink: data.youtubeLink || ''
                });

                setLoading(false);
            } catch (err) {
                console.error('Error fetching resource:', err);
                setError('Failed to load exercise details.');
                setLoading(false);
            }
        };

        fetchResource();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem('token');

            const instructionsArray = formData.instructions.split('\n').filter(line => line.trim() !== '');
            const secondaryMusclesArray = formData.secondaryMuscles.split(',').map(item => item.trim()).filter(item => item !== '');
            const exerciseTypesArray = [formData.exerciseTypes];

            const dataToSend = {
                ...formData,
                instructions: instructionsArray,
                secondaryMuscles: secondaryMusclesArray,
                exerciseTypes: exerciseTypesArray
            };

            await axios.put(`/api/resources/${id}`, dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage('Exercise successfully updated!');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating exercise');
        }
    };

    const inputClasses = "w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-black focus:border-black outline-none transition-all text-sm";
    const labelClasses = "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-xl font-bold text-gray-700 animate-pulse">Loading exercise data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-white border-b border-gray-100 px-8 py-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Exercise</h2>
                </div>

                <div className="px-8 py-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-700 text-sm font-medium">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 text-green-700 text-sm font-medium">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Exercise Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Target Muscle</label>
                                <input type="text" name="target" value={formData.target} onChange={handleChange} required className={inputClasses} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClasses}>Body Part</label>
                                <select name="bodyPart" value={formData.bodyPart} onChange={handleChange} className={inputClasses}>
                                    <option value="back">Back</option>
                                    <option value="cardio">Cardio</option>
                                    <option value="chest">Chest</option>
                                    <option value="lower arms">Lower Arms</option>
                                    <option value="lower legs">Lower Legs</option>
                                    <option value="shoulders">Shoulders</option>
                                    <option value="upper arms">Upper Arms</option>
                                    <option value="upper legs">Upper Legs</option>
                                    <option value="waist">Waist (Core)</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Equipment</label>
                                <select name="equipment" value={formData.equipment} onChange={handleChange} className={inputClasses}>
                                    <option value="barbell">Barbell</option>
                                    <option value="dumbbell">Dumbbell</option>
                                    <option value="cable">Cable</option>
                                    <option value="machine">Machine</option>
                                    <option value="smith machine">Smith Machine</option>
                                    <option value="body weight">Body Weight</option>
                                    <option value="band">Band</option>
                                    <option value="weighted">Weighted</option>
                                    <option value="kettlebell">Kettlebell</option>
                                    <option value="assisted">Assisted</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Difficulty</label>
                                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className={inputClasses}>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Static Image URL</label>
                                <input type="text" name="cardImageUrl" value={formData.cardImageUrl} onChange={handleChange} required className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>GIF URL</label>
                                <input type="text" name="gifUrl" value={formData.gifUrl} onChange={handleChange} required className={inputClasses} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className={labelClasses}>Overview</label>
                                <textarea name="overview" value={formData.overview} onChange={handleChange} required rows="3" className={`${inputClasses} resize-none`}></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClasses}>Secondary Muscles</label>
                                    <input type="text" name="secondaryMuscles" value={formData.secondaryMuscles} onChange={handleChange} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Exercise Type</label>
                                    <select name="exerciseTypes" value={formData.exerciseTypes} onChange={handleChange} className={inputClasses}>
                                        <option value="strength">Strength</option>
                                        <option value="mobility">Mobility</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Instructions</label>
                            <textarea name="instructions" value={formData.instructions} onChange={handleChange} required rows="5" className={`${inputClasses} resize-none`}></textarea>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-center gap-4">
                            <button type="button" onClick={() => navigate('/')} className="px-8 py-3 bg-white text-black border border-gray-300 font-bold rounded-md hover:bg-gray-50 transition-all shadow-sm hover:shadow active:scale-95 text-sm uppercase tracking-widest">
                                Cancel
                            </button>
                            <button type="submit" className="px-8 py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm uppercase tracking-widest">
                                Update Exercise
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditResource;