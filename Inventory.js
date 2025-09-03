import React, { useEffect, useState } from 'react';

export default function Inventory() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');

    const fetchProducts = async () => {
        const res = await fetch('http://localhost:5000/api/erp/products');
        const data = await res.json();
        setProducts(data);
    };

    const addProduct = async () => {
        await fetch('http://localhost:5000/api/erp/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, sku, qty:0, batch:'', expiry:'' })
        });
        setName(''); setSku('');
        fetchProducts();
    };

    useEffect(() => { fetchProducts(); }, []);

    return (
        <div>
            <h1>ERP Inventory</h1>
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="SKU" value={sku} onChange={e => setSku(e.target.value)} />
            <button onClick={addProduct}>Add Product</button>
            <ul>
                {products.map(p => <li key={p.id}>{p.name} - {p.sku} - {p.qty}</li>)}
            </ul>
        </div>
    );
}