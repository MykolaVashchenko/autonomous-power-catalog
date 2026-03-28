import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditResource() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('battery');
    const [specs, setSpecs] = useState({});
    const [image, setImage] = useState(null);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const response = await axios.get(`/api/resources/${id}`);
                const data = response.data;

                setTitle(data.title);
                setDescription(data.description);
                setBrand(data.brand);
                setModel(data.model);
                setPrice(data.price);
                setCategory(data.category);
                setSpecs(data.specifications || {});
            } catch (err) {
                setError('Не вдалося завантажити дані товару');
            }
        };
        fetchResource();
    }, [id]);

    const handleSpecChange = (e) => {
        setSpecs({ ...specs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('brand', brand);
        formData.append('model', model);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('specifications', JSON.stringify(specs));
        if (image) formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/resources/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage('Товар успішно відредаговано!');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Помилка при редагуванні');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#007bff' }}>Редагування товару</h2>

            {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px' }}>{error}</div>}
            {message && <div style={{ color: 'green', marginBottom: '15px', textAlign: 'center', backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px' }}>{message}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" placeholder="Назва" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} required />

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Бренд" value={brand} onChange={(e) => setBrand(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                    <input type="text" placeholder="Модель" value={model} onChange={(e) => setModel(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                    <input type="number" placeholder="Ціна" value={price} onChange={(e) => setPrice(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                </div>

                <textarea placeholder="Опис" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} required />

                <div>
                    <label style={{ fontWeight: 'bold' }}>Категорія:</label>
                    <select value={category} onChange={(e) => { setCategory(e.target.value); setSpecs({}); }} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px' }}>
                        <option value="battery">Акумулятори</option>
                        <option value="inverter">Інвертори</option>
                        <option value="solar_panel">Сонячні панелі</option>
                        <option value="bms">BMS Плати</option>
                        <option value="accessories">Інше</option>
                    </select>
                </div>

                <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
                    <h4 style={{ marginTop: 0 }}>Технічні характеристики:</h4>
                    {category === 'battery' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input type="text" name="formFactor" value={specs.formFactor || ''} placeholder="Форм-фактор" onChange={handleSpecChange} style={{ padding: '8px' }} />
                            <input type="number" name="capacity" value={specs.capacity || ''} placeholder="Ємність" onChange={handleSpecChange} style={{ padding: '8px' }} />
                            <input type="number" step="0.1" name="voltage" value={specs.voltage || ''} placeholder="Напруга" onChange={handleSpecChange} style={{ padding: '8px' }} />
                        </div>
                    )}
                    {category === 'inverter' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input type="number" name="power" value={specs.power || ''} placeholder="Потужність (W)" onChange={handleSpecChange} style={{ padding: '8px' }} />
                            <input type="text" name="waveType" value={specs.waveType || ''} placeholder="Тип синусоїди" onChange={handleSpecChange} style={{ padding: '8px' }} />
                            <input type="text" name="inputVoltage" value={specs.inputVoltage || ''} placeholder="Вхідна напруга" onChange={handleSpecChange} style={{ padding: '8px' }} />
                        </div>
                    )}
                    {category === 'solar_panel' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input type="number" name="power" value={specs.power || ''} placeholder="Потужність (W)" onChange={handleSpecChange} style={{ padding: '8px' }} />
                            <input type="number" step="0.1" name="voltage" value={specs.voltage || ''} placeholder="Робоча напруга (V)" onChange={handleSpecChange} style={{ padding: '8px' }} />
                        </div>
                    )}
                </div>

                <div style={{ border: '1px dashed #ccc', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Нове зображення (необов'язково):</label>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </div>

                <button type="submit" style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                    Відредагувати ресурс
                </button>
            </form>
        </div>
    );
}

export default EditResource;