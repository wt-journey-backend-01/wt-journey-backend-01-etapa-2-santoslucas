const { v4: uuidv4 } = require('uuid');

let agentes = [
    {
        id: "401bccf5-cf9e-489d-8412-446cd169a0f1",
        nome: "Rommel Carneiro",
        dataDeIncorporacao: "1992-10-04",
        cargo: "delegado"
    },
    {
        id: "a2a165dc-39f3-4bd8-8a4e-19e8675a8a4a",
        nome: "Ana Pereira",
        dataDeIncorporacao: "2015-03-12",
        cargo: "inspetor"
    }
];

function findAll() {
    return agentes;
}

function findById(id) {
    return agentes.find(agente => agente.id === id);
}

function create(agente) {
    const newAgente = { id: uuidv4(), ...agente };
    agentes.push(newAgente);
    return newAgente;
}

function update(id, data) {
    const index = agentes.findIndex(agente => agente.id === id);
    if (index === -1) {
        return null;
    }
    agentes[index] = { ...agentes[index], ...data };
    return agentes[index];
}

function remove(id) {
    const index = agentes.findIndex(agente => agente.id === id);
    if (index === -1) {
        return false; 
    }
    agentes.splice(index, 1);
    return true;
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};