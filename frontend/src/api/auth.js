const API_URL = 'http://localhost:5000/api/auth';

export const signup = async (userData) => {
    const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    if (data.token) {
        localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
};

export const login = async (userData) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    if (data.token) {
        localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
};

export const logout = () => {
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};
