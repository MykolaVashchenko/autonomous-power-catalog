import React, { useState } from 'react';
import axios from 'axios';

function Admin() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [brand, setBrand] = useState(''); // Окремий стан для бренду
    const [model, setModel] = useState(''); // ДОДАЛИ СТАН
    const [price, setPrice] = useState(''); // Окремий стан для ціни
    const [image, setImage] = useState(null);

    const [category, setCategory] = useState('battery');
    const [specs, setSpecs] = useState({});

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSpecChange = (e) => {
        setSpecs({
            ...specs,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!title || !description || !brand || !model || !price) {
            return setError('Заповніть усі обов\'язкові поля (Назва, Опис, Бренд, Модель, Ціна)');
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('brand', brand);
        formData.append('model', model);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('specifications', JSON.stringify(specs));

        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/resources', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            setMessage('Товар успішно додано!');
            setTitle('');
            setDescription('');
            setBrand('');
            setModel('');
            setPrice('');
            setImage(null);
            setSpecs({});
            document.getElementById('imageInput').value = '';
        } catch (err) {
            setError(err.response?.data?.message || 'Помилка при додаванні товару');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Панель Адміністратора</h2>

            {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px' }}>{error}</div>}
            {message && <div style={{ color: 'green', marginBottom: '15px', textAlign: 'center', backgroundColor: '#d4edda', padding: '10px', borderRadius: '4px' }}>{message}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                <input type="text" placeholder="Назва ресурсу" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Бренд" value={brand} onChange={(e) => setBrand(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <input type="text" placeholder="Модель" value={model} onChange={(e) => setModel(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <input type="number" placeholder="Ціна (₴)" value={price} onChange={(e) => setPrice(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>

                <textarea placeholder="Опис ресурсу..." value={description} onChange={(e) => setDescription(e.target.value)} rows="3" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }} />


                <div>
                    <label style={{ fontWeight: 'bold' }}>Категорія:</label>
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setSpecs({});
                        }}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px' }}
                    >
                        <option value="battery">Акумулятори (18650, LiFePO4 тощо)</option>
                        <option value="inverter">Інвертори</option>
                        <option value="solar_panel">Сонячні панелі</option>
                        <option value="bms">BMS Плати</option>
                        <option value="accessories">Інше (Комплектуючі)</option>
                    </select>
                </div>

                <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
                    <h4 style={{ marginTop: 0 }}>Технічні характеристики:</h4>

                    {category === 'battery' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input type="text" name="formFactor" value={specs.formFactor || ''} placeholder="Форм-фактор (напр. 18650)" onChange={handleSpecChange} style={{ padding: '8px' }} />
                            <input type="number" name="capacity" value={specs.capacity || ''} placeholder="Ємність (mAh)" onChange={handleSpecChange} style={{ padding: '8px' }} />
                            <input type="number" step="0.1" name="voltage" value={specs.voltage || ''} placeholder="Номінальна напруга (V)" onChange={handleSpecChange} style={{ padding: '8px' }} />
                        </div>
                    )}

                    {category === 'inverter' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input type="number" name="power" value={specs.power || ''} placeholder="Потужність (W)" onChange={handleSpecChange} style={{ padding: '8px' }} />
                            <input type="text" name="waveType" value={specs.waveType || ''} placeholder="Тип синусоїди (чиста/модифікована)" onChange={handleSpecChange} style={{ padding: '8px' }} />
                            <input type="text" name="inputVoltage" value={specs.inputVoltage || ''} placeholder="Вхідна напруга (напр. 12V, 24V)" onChange={handleSpecChange} style={{ padding: '8px' }} />
                        </div>
                    )}

                    {category === 'solar_panel' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input type="number" name="power" value={specs.power || ''} placeholder="Потужність (W)" onChange={handleSpecChange} style={{ padding: '8px' }} />
                            <input type="number" step="0.1" name="voltage" value={specs.voltage || ''} placeholder="Робоча напруга (V)" onChange={handleSpecChange} style={{ padding: '8px' }} />
                        </div>
                    )}

                    {(category === 'accessories' || category === 'bms') && (
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Специфічні параметри можна вказати в описі.</p>
                    )}
                </div>

                <div style={{ border: '1px dashed #ccc', padding: '15px', borderRadius: '4px', textAlign: 'center' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Зображення товару:</label>
                    <input id="imageInput" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                </div>

                <button type="submit" style={{ padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                    Додати ресурс
                </button>
            </form>
        </div>
    );
}

export default Admin;