import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Catalog() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [apiType, setApiType] = useState('rest');

    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            setError('');
            try {
                let fetchedData = [];
                if (apiType === 'rest') {
                    const response = await axios.get('/api/resources');
                    fetchedData = response.data;
                } else {
                    const graphqlQuery = {
                        query: `{
                            getResources {
                                _id title category brand model price imageUrl
                            }
                        }`
                    };
                    const response = await axios.post('/graphql', graphqlQuery);

                    if (response.data.errors) {
                        console.error("GraphQL помилки:", response.data.errors);
                        throw new Error("GraphQL повернув помилку. Відкрийте консоль (F12) для деталей.");
                    }
                    fetchedData = response.data.data.getResources || [];
                }
                setResources(fetchedData);
                setLoading(false);
            } catch (err) {
                console.error(`Помилка завантаження через ${apiType.toUpperCase()}:`, err);
                setError(`Не вдалося завантажити товари через ${apiType.toUpperCase()}.`);
                setLoading(false);
            }
        };
        fetchResources();
    }, [apiType]);

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Ви впевнені, що хочете видалити "${title}"?`)) {
            return;
        }

        try {
            await axios.delete(`/api/resources/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setResources(resources.filter(item => item._id !== id));
            console.log(`Товар "${title}" видалено`);

        } catch (err) {
            console.error("Помилка видалення:", err);
            alert(err.response?.data?.message || 'Помилка при видаленні товару');
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/edit/${id}`);
    };

    const categoryNames = {
        battery: 'Акумулятор',
        inverter: 'Інвертор',
        solar_panel: 'Сонячна панель',
        bms: 'BMS Плата',
        accessories: 'Комплектуючі'
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Каталог Ресурсів</h1>

            {userRole === 'admin' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <button
                        onClick={() => navigate('/admin')} // Перекидає на твою існуючу форму
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            transition: '0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                    >
                        <span>➕</span> Додати новий товар
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '10px' }}>
                <button onClick={() => setApiType('rest')} style={{ padding: '10px 20px', border: '2px solid #007bff', backgroundColor: apiType === 'rest' ? '#007bff' : 'white', color: apiType === 'rest' ? 'white' : '#007bff', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>REST API</button>
                <button onClick={() => setApiType('graphql')} style={{ padding: '10px 20px', border: '2px solid #e535ab', backgroundColor: apiType === 'graphql' ? '#e535ab' : 'white', color: apiType === 'graphql' ? 'white' : '#e535ab', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>GraphQL</button>
            </div>

            {loading ? (
                <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Завантаження вітрини... ⏳</h2>
            ) : error ? (
                <h2 style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>{error}</h2>
            ) : resources.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Товарів поки немає.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {resources.map((item) => (
                        <div key={item._id} style={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                        }}>

                            {userRole === 'admin' && (
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    display: 'flex',
                                    gap: '5px',
                                    zIndex: 10
                                }}>
                                    <button
                                        onClick={() => handleEdit(item._id)}
                                        title="Редагувати товар"
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            border: '1px solid #ccc',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: '14px',
                                            transition: '0.2s',
                                            color: '#555'
                                        }}
                                        onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#e0f7fa'; e.currentTarget.style.color = '#007bff';}}
                                        onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; e.currentTarget.style.color = '#555';}}
                                    >
                                        ✏️
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item._id, item.title)}
                                        title="Видалити товар"
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                            border: '1px solid #ccc',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: '14px',
                                            transition: '0.2s',
                                            color: '#555'
                                        }}
                                        onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#ffebee'; e.currentTarget.style.color = 'red';}}
                                        onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; e.currentTarget.style.color = '#555';}}
                                    >
                                        ❌
                                    </button>
                                </div>
                            )}

                            <div style={{ height: '200px', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {item.imageUrl ? (
                                    <img src={`http://localhost:5000${item.imageUrl}`} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <span style={{ color: '#aaa' }}>Немає фото</span>
                                )}
                            </div>

                            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>
                                    {categoryNames[item.category] || item.category}
                                </div>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#333' }}>{item.title}</h3>
                                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                    <strong>Бренд:</strong> {item.brand} <br/>
                                    <strong>Модель:</strong> {item.model}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>{item.price} ₴</span>
                                    <button style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Детальніше</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Catalog;