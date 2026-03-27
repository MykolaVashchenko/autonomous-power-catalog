import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [resources, setResources] = useState([]);
    const [mode, setMode] = useState('REST');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData(mode);
    }, [mode]);

    const fetchData = async (currentMode) => {
        setLoading(true);
        try {
            if (currentMode === 'REST') {
                const response = await axios.get('/api/resources');
                setResources(response.data);
            } else {
                const response = await axios.post('/graphql', {
                    query: `
            query { 
              getResources { 
                title 
                price 
                brand 
                description 
              } 
            }
          `
                });
                setResources(response.data.data.getResources);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="title">Каталог автономного живлення</h1>

            <div className="toggle-container">
                <button
                    onClick={() => setMode('REST')}
                    className={`btn ${mode === 'REST' ? 'active-rest' : ''}`}
                >
                    REST API
                </button>
                <button
                    onClick={() => setMode('GraphQL')}
                    className={`btn ${mode === 'GraphQL' ? 'active-graphql' : ''}`}
                >
                    GraphQL API
                </button>
            </div>

            <p className="status-text">
                Поточний режим: <strong>{mode}</strong>
                <br/>
                <small>{mode === 'REST' ? '(Отримуємо всі поля з бази)' : '(Отримуємо тільки вибрані поля)'}</small>
            </p>

            {loading ? (
                <h3 className="loading">Завантаження...</h3>
            ) : (
                <div className="grid">
                    {resources.map((item, index) => (
                        <div key={index} className="card">
                            <h3>{item.title}</h3>
                            <p><strong>Бренд:</strong> {item.brand}</p>
                            <p><strong>Ціна:</strong> {item.price} грн</p>
                            {item.description && <p className="description">{item.description}</p>}

                            {item._id && (
                                <div className="system-info">
                                    <p>Системний ID: {item._id}</p>
                                    <p>В наявності: {item.inStock ? 'Так' : 'Ні'}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;