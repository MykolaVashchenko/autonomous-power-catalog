import React from 'react';

function Profile() {
    const email = localStorage.getItem('userEmail');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        window.location.href = '/';
    };

    return (
        <div className="max-w-xl my-12 mx-auto p-5 text-center border border-gray-300 rounded-xl bg-white shadow-md">
            <h2 className="text-[22px] font-bold text-gray-900">Personal account</h2>

            <div className="my-8 text-lg text-gray-700">
                You are logged in as: <strong className="text-black">{email}</strong>
            </div>

            <button
                onClick={handleLogout}
                className="px-5 py-2.5 bg-[#dc3545] text-white rounded-lg font-bold cursor-pointer hover:bg-red-700 transition-colors"
            >
                Log out of your account
            </button>
        </div>
    );
}

export default Profile;