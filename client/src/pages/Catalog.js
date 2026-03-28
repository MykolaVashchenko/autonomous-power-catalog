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
                    const response = await axios.get(`/api/resources?role=${userRole}`);
                    fetchedData = response.data;
                } else {
                    const graphqlQuery = {
                        query: `{
                            getResources {
                                _id title category brand model price imageUrl isActive
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
                setLoading(false);
            } catch (err) {
                console.error(`Помилка завантаження через ${apiType.toUpperCase()}:`, err);
                setError(`Не вдалося завантажити товари через ${apiType.toUpperCase()}.`);
                setLoading(false);
            }
        };
        fetchResources();
    }, [apiType, userRole]);

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Ви впевнені, що хочете видалити "${title}"?`)) return;
        try {
            await axios.delete(`/api/resources/${id}`, { headers: { Authorization: `Bearer ${token}` }});
            setResources(resources.filter(item => item._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Помилка при видаленні товару');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await axios.patch(`/api/resources/${id}/toggle-status`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Оновлюємо стан React, щоб миттєво перемалювати картку
            setResources(resources.map(item =>
                item._id === id ? { ...item, isActive: !item.isActive } : item
            ));
        } catch (err) {
            console.error("Помилка зміни статусу:", err);
            alert('Не вдалося змінити статус товару');
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

            {/* Кнопка "Додати товар" */}
            {userRole === 'admin' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <button onClick={() => navigate('/admin')} style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
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
                            // ВІЗУАЛ: Якщо неактивний, робимо фон сірим і трохи прозорим
                            backgroundColor: item.isActive ? '#fff' : '#f8f9fa',
                            opacity: item.isActive ? 1 : 0.6,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                        }}>

                            {userRole === 'admin' && !item.isActive && (
                                <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#dc3545', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', zIndex: 10 }}>
                                    Чернетка
                                </div>
                            )}

                            {userRole === 'admin' && (
                                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '5px', zIndex: 10 }}>

                                    <button
                                        onClick={() => handleToggleStatus(item._id)}
                                        title={item.isActive ? "Приховати (Зробити чернеткою)" : "Опублікувати"}
                                        style={{ width: '30px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}
                                    >
                                        {item.isActive ? '🙈' : '👁️'}
                                    </button>

                                    <button onClick={() => handleEdit(item._id)} title="Редагувати" style={{ width: '30px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>✏️</button>
                                    <button onClick={() => handleDelete(item._id, item.title)} title="Видалити" style={{ width: '30px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px' }}>❌</button>
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
                                <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>{categoryNames[item.category] || item.category}</div>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#333' }}>{item.title}</h3>
                                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                    <strong>Бренд:</strong> {item.brand} <br/>
                                    <strong>Модель:</strong> {item.model}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>{item.price} ₴</span>
                                    <button disabled={!item.isActive} style={{ padding: '8px 15px', backgroundColor: item.isActive ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', cursor: item.isActive ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}>
                                        Детальніше
                                    </button>
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