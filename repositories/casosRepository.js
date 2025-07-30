const { v4: uuidv4 } = require('uuid');

let casos = [
    {
        id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
        titulo: "homicidio na avenida principal",
        descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: "aberto",
        agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1"
    },
    {
        id: "c1a2b3d4-e5f6-7890-1234-567890abcdef",
        titulo: "roubo a banco",
        descricao: "Assalto a mão armada na agência bancária central. Os suspeitos fugiram em um carro preto.",
        status: "solucionado",
        agente_id: "a2a165dc-39f3-4bd8-8a4e-19e8675a8a4a"
    }
];

function findAll() {
    return casos;
}

function findById(id) {
    return casos.find(caso => caso.id === id);
}

function create(caso) {
    const newCaso = { id: uuidv4(), ...caso };
    casos.push(newCaso);
    return newCaso;
}

function update(id, data) {
    const index = casos.findIndex(caso => caso.id === id);
    if (index === -1) {
        return null;
    }
    casos[index] = { ...casos[index], ...data };
    return casos[index];
}

function remove(id) {
    const index = casos.findIndex(caso => caso.id === id);
    if (index === -1) {
        return false;
    }
    casos.splice(index, 1);
    return true; 
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};
