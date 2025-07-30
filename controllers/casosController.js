const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { formatError } = require('../utils/errorHandler');

function getAllCasos(req, res) {
    let casos = casosRepository.findAll();

    if (req.query.status) {
        casos = casos.filter(caso => caso.status.toLowerCase() === req.query.status.toLowerCase());
    }

    if (req.query.agente_id) {
        casos = casos.filter(caso => caso.agente_id === req.query.agente_id);
    }
    
    if (req.query.q) {
        const query = req.query.q.toLowerCase();
        casos = casos.filter(caso => 
            caso.titulo.toLowerCase().includes(query) || 
            caso.descricao.toLowerCase().includes(query)
        );
    }

    res.json(casos);
}

function getCasoById(req, res) {
    const caso = casosRepository.findById(req.params.id);
    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.json(caso);
}

function createCaso(req, res) {
    const { titulo, descricao, status, agente_id } = req.body;
    const errors = [];

    if (!titulo) errors.push({ titulo: "O campo 'titulo' é obrigatório" });
    if (!descricao) errors.push({ descricao: "O campo 'descricao' é obrigatório" });
    if (!status || !['aberto', 'solucionado'].includes(status.toLowerCase())) {
        errors.push({ status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'" });
    }
    if (!agente_id) {
        errors.push({ agente_id: "O campo 'agente_id' é obrigatório" });
    } else if (!agentesRepository.findById(agente_id)) {
        errors.push({ agente_id: "O 'agente_id' fornecido não corresponde a um agente existente" });
    }

    if (errors.length > 0) {
        return res.status(400).json(formatError("Parâmetros inválidos", errors));
    }

    const newCaso = casosRepository.create({ titulo, descricao, status, agente_id });
    res.status(201).json(newCaso);
}

function updateCaso(req, res) {
    const { id } = req.params;
    const { titulo, descricao, status, agente_id } = req.body;
    const errors = [];

    if (!titulo) errors.push({ titulo: "O campo 'titulo' é obrigatório" });
    if (!descricao) errors.push({ descricao: "O campo 'descricao' é obrigatório" });
    if (!status || !['aberto', 'solucionado'].includes(status.toLowerCase())) {
        errors.push({ status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'" });
    }
    if (!agente_id) {
        errors.push({ agente_id: "O campo 'agente_id' é obrigatório" });
    } else if (!agentesRepository.findById(agente_id)) {
        errors.push({ agente_id: "O 'agente_id' fornecido não corresponde a um agente existente" });
    }

    if (errors.length > 0) {
        return res.status(400).json(formatError("Parâmetros inválidos", errors));
    }

    const updatedCaso = casosRepository.update(id, { titulo, descricao, status, agente_id });
    if (!updatedCaso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.json(updatedCaso);
}

function patchCaso(req, res) {
    const { id } = req.params;
    const updates = req.body;
    const errors = [];

    if (updates.status && !['aberto', 'solucionado'].includes(updates.status.toLowerCase())) {
        errors.push({ status: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'" });
    }
    if (updates.agente_id && !agentesRepository.findById(updates.agente_id)) {
        errors.push({ agente_id: "O 'agente_id' fornecido não corresponde a um agente existente" });
    }
    if (Object.keys(updates).length === 0) {
        errors.push({ body: "O corpo da requisição não pode estar vazio para um PATCH." });
    }

    if (errors.length > 0) {
        return res.status(400).json(formatError("Parâmetros inválidos", errors));
    }

    const updatedCaso = casosRepository.update(id, updates);
    if (!updatedCaso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.json(updatedCaso);
}

function deleteCaso(req, res) {
    const success = casosRepository.remove(req.params.id);
    if (!success) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }
    res.status(204).send();
}

function getAgenteByCasoId(req, res) {
    const caso = casosRepository.findById(req.params.caso_id);
    if (!caso) {
        return res.status(404).json({ message: 'Caso não encontrado' });
    }
    const agente = agentesRepository.findById(caso.agente_id);
    if (!agente) {
        return res.status(404).json({ message: 'Agente responsável pelo caso não encontrado' });
    }
    res.json(agente);
}

module.exports = {
    getAllCasos,
    getCasoById,
    createCaso,
    updateCaso,
    patchCaso,
    deleteCaso,
    getAgenteByCasoId
};
