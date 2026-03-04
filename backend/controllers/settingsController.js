const Settings = require('../models/Settings'); 
exports.getSettings = async (req, res) => {
    const config = await Settings.findOne();
    res.json(config);
};

exports.updateSettings = async (req, res) => {
    const updated = await Settings.findOneAndUpdate({}, req.body, { new: true });
    res.json({ message: "Bot actualizado en tiempo real", data: updated });
};
const db = require('../models/db');

exports.getSettings = async (req, res) => {
    const [rows] = await db.query('SELECT * FROM bot_settings WHERE id = 1');
    res.json(rows[0]);
};

exports.updateSettings = async (req, res) => {
    const { mantenimiento, mensaje_bienvenida } = req.body;
    await db.query(
        'UPDATE bot_settings SET mantenimiento = ?, mensaje_bienvenida = ? WHERE id = 1',
        [mantenimiento, mensaje_bienvenida]
    );
    res.json({ status: "ok", message: "Ajustes actualizados" });
};