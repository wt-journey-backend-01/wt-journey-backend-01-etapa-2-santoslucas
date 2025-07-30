const agentesRepository = require('../repositories/agentesRepository');
const { formatError } = require('../utils/errorHandler');

function getAllAgentes(req, res) {
    let agentes = agentesRepository.findAll();

    if (req.query.cargo) {
        agentes = agentes.filter(agente => agente.cargo.toLowerCase() === req.query.cargo.toLowerCase());
    }

    if (req.query.sort) {
        const sortField = req.query.sort.replace('-', '');
        if (sortField === 'dataDeIncorporacao') {
            agentes.sort((a, b) => {
                const dateA = new Date(a.dataDeIncorporacao);
                const dateB = new Date(b.dataDeIncorporacao);
                return req.query.sort.startsWith('-') ? dateB - dateA : dateA - dateB;
            });
        }
    }

    res.json(agentes);
}

function getAgenteById(req, res) {
    const agente = agentesRepository.findById(req.params.id);
    if (!agente) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.json(agente);
}

function createAgente(req, res) {
    const { nome, dataDeIncorporacao, cargo } = req.body;
    const errors = [];

    if (!nome) errors.push({ nome: "O campo 'nome' é obrigatório" });
    if (!dataDeIncorporacao) errors.push({ dataDeIncorporacao: "O campo 'dataDeIncorporacao' é obrigatório" });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataDeIncorporacao)) {
        errors.push({ dataDeIncorporacao: "Campo 'dataDeIncorporacao' deve seguir a formatação 'YYYY-MM-DD'" });
    }
    if (!cargo) errors.push({ cargo: "O campo 'cargo' é obrigatório" });

    if (errors.length > 0) {
        return res.status(400).json(formatError("Parâmetros inválidos", errors));
    }

    const newAgente = agentesRepository.create({ nome, dataDeIncorporacao, cargo });
    res.status(201).json(newAgente);
}

function updateAgente(req, res) {
    const { id } = req.params;
    const { nome, dataDeIncorporacao, cargo } = req.body;
    const errors = [];

    if (!nome) errors.push({ nome: "O campo 'nome' é obrigatório" });
    if (!dataDeIncorporacao) errors.push({ dataDeIncorporacao: "O campo 'dataDeIncorporacao' é obrigatório" });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataDeIncorporacao)) {
        errors.push({ dataDeIncorporacao: "Campo 'dataDeIncorporacao' deve seguir a formatação 'YYYY-MM-DD'" });
    }
    if (!cargo) errors.push({ cargo: "O campo 'cargo' é obrigatório" });

    if (errors.length > 0) {
        return res.status(400).json(formatError("Parâmetros inválidos", errors));
    }

    const updatedAgente = agentesRepository.update(id, { nome, dataDeIncorporacao, cargo });
    if (!updatedAgente) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.json(updatedAgente);
}

function patchAgente(req, res) {
    const { id } = req.params;
    const updates = req.body;
    const errors = [];

    if (updates.dataDeIncorporacao && !/^\d{4}-\d{2}-\d{2}$/.test(updates.dataDeIncorporacao)) {
        errors.push({ dataDeIncorporacao: "Campo 'dataDeIncorporacao' deve seguir a formatação 'YYYY-MM-DD'" });
    }
    
    if (Object.keys(updates).length === 0) {
        errors.push({ body: "O corpo da requisição não pode estar vazio para um PATCH." });
    }

    if (errors.length > 0) {
        return res.status(400).json(formatError("Parâmetros inválidos", errors));
    }

    const updatedAgente = agentesRepository.update(id, updates);
    if (!updatedAgente) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.json(updatedAgente);
}

function deleteAgente(req, res) {
    const success = agentesRepository.remove(req.params.id);
    if (!success) {
        return res.status(404).json({ message: 'Agente não encontrado' });
    }
    res.status(204).send();
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    patchAgente,
    deleteAgente
};
