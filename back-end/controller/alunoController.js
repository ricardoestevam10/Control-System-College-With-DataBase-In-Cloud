import alunoService from "../services/alunoService.js";

const createAluno = async (req, res) => {
    try { 
        // Verifica se o corpo da requisição é um Array (Lista do Insomnia)
        if (Array.isArray(req.body)) {
            // Envia a lista inteira direto para o Service tratar com insertMany
            await alunoService.Create(req.body);
            console.log("Lote de novos alunos criados via carga!");
        } else {
            // Se for um único aluno (vindo do formulário da tela)
            const { nome, RA, sala, ano, temAcesso } = req.body;
            await alunoService.Create(nome, RA, sala, ano, temAcesso);
            console.log("Novo aluno individual criado!");
        }
        
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

const getAllAlunos = async (req, res) => {
    try {
        const alunos = await alunoService.getAll();
         
        res.status(200).json({ alunos: alunos });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

const updateAluno = async (req, res) => {
    try {
        const { id } = req.params; 
        const { nome, RA, sala, ano, atividadeEntregue, temAcesso } = req.body;

        await alunoService.update(id, nome, RA, sala, ano, atividadeEntregue, temAcesso); 

        console.log(`Aluno com ID ${id} atualizado`);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

const deleteAluno = async (req, res) => {
    try {
        const { id } = req.params; 

        await alunoService.delete(id); 

        console.log(`Aluno com ID ${id} apagado`);
        res.sendStatus(204); 
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

export default { createAluno, getAllAlunos, updateAluno, deleteAluno };
