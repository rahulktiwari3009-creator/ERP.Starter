import React, { useState } from 'react';

export default function Login({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleLogin = async () => {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        const data = await res.json();
        if(data.token){
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            setToken(data.token);
            setRole(data.role);
            alert('Login successful');
        } else { alert(data.error); }
    };

    return (
        <div>
            <h1>Login</h1>
            <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}