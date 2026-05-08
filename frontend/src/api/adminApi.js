const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') : 'http://localhost:5000';
const API_URL = `${base}/api/admin`;

export const adminSignup = async (adminData) => {
    const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    if (data.token) {
        localStorage.setItem('admin', JSON.stringify(data));
    }
    return data;
};

export const adminLogin = async (adminData) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    if (data.token) {
        localStorage.setItem('admin', JSON.stringify(data));
    }
    return data;
};

export const adminLogout = () => {
    localStorage.removeItem('admin');
};

export const getCurrentAdmin = () => {
    return JSON.parse(localStorage.getItem('admin'));
};

export const getAllUsersResults = async (token) => {
    const response = await fetch(`${API_URL}/results`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch results');
    }

    return data;
};
