const chatModel = require('../models/chatModel');

exports.getMessageResponse = async (req, res) => {
    const { message, history } = req.body;
    const response = await chatModel.findResponse(message, history || []);
    res.json({ reply: response });
};

exports.getAllFaqs = async (req, res) => {
    const faqs = await chatModel.getAll();
    res.json(faqs);
};

exports.getFaqById = async (req, res) => {
    const faq = await chatModel.getById(req.params.id);
    res.json(faq);
};

exports.addFaq = async (req, res) => {
    try {
        const id = await chatModel.create(req.body);
        res.status(201).json({ id, message: "FAQ guardada" });
    } catch (e) { res.status(500).json({ error: "Error" }); }
};

exports.updateFaq = async (req, res) => {
    await chatModel.update(req.params.id, req.body);
    res.json({ message: "Actualizado" });
};

exports.deleteFaq = async (req, res) => {
    await chatModel.delete(req.params.id);
    res.json({ message: "Eliminado" });
};