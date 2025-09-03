const express = require('express');
const router = express.Router();
const db = require('../../models/erp/init');

router.get('/', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if(err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post('/', (req, res) => {
    const { name, sku, qty, batch, expiry } = req.body;
    db.run(`INSERT INTO products(name, sku, qty, batch, expiry) VALUES(?,?,?,?,?)`,
        [name, sku, qty, batch, expiry],
        function(err){
            if(err) return res.status(500).json({error: err.message});
            res.json({id: this.lastID, name, sku});
        });
});

module.exports = router;