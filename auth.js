const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../models/auth/user');
const SECRET = 'supersecretkey';

router.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users(username, password, role) VALUES(?,?,?)`, [username, hashed, role || 'User'], function(err){
        if(err) return res.status(500).json({error: err.message});
        res.json({id: this.lastID, username, role: role || 'User'});
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username=?`, [username], async (err, row) => {
        if(err) return res.status(500).json({error: err.message});
        if(!row) return res.status(400).json({error: 'User not found'});
        const match = await bcrypt.compare(password, row.password);
        if(!match) return res.status(400).json({error: 'Invalid password'});
        const token = jwt.sign({id: row.id, role: row.role}, SECRET, {expiresIn:'8h'});
        res.json({token, role: row.role});
    });
});

module.exports = router;