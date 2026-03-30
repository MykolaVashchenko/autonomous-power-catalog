import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function Activate() {
    const { link } = useParams();
    const [message, setMessage] = useState('Please wait, confirming');
    const [isSuccess, setIsSuccess] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const activateAccount = async () => {
            try {
                const response = await axios.get(`/api/auth/activate/${link}`);
                setMessage(response.data.message);
                if (response.data.email) {
                    setUserEmail(response.data.email);
                }
                setIsSuccess(true);
            } catch (error) {
                setMessage(error.response?.data?.message || 'Confirmation error or link expired');
                setIsSuccess(false);
            }
        };

        activateAccount();
    }, [link]);

    return (
        <div className="max-w-md mx-auto mt-24 text-center p-8 border border-gray-300 rounded-xl bg-white shadow-md">
            <h2 className={`mb-5 text-xl font-semibold ${isSuccess ? 'text-gray-700' : 'text-red-600'}`}>
                {message}
            </h2>

            <Link
                to="/authorization"
                state={{ prefilledEmail: userEmail }}
                className="inline-block px-5 py-2.5 bg-black text-white rounded-lg font-bold transition-colors hover:bg-gray-800"
            >
                Go to login page
            </Link>
        </div>
    );
}

export default Activate;