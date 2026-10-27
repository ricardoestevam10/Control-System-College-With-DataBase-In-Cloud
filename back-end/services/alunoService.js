import Aluno from "../model/Alunos.js";

class alunoService {
    // Método para cadastrar um aluno
// Altere apenas o método Create dentro da classe alunoService:
async Create(nome, RA, sala, ano, temAcesso) {
    try {
        // Se o que chegar for uma lista (Array), ele salva todos juntos de uma vez só
        if (Array.isArray(nome)) {
            await Aluno.insertMany(nome);
            return;
        }

        // Caso contrário, continua salvando um aluno individual normalmente
        const newAluno = new Aluno({
            nome,
            RA,
            sala,
            ano,
            temAcesso
        });
        await newAluno.save();
    } catch (error) {
        console.log(error);
        throw error;
    }
}


    // Método para listar todos os alunos
    async getAll() {
        try {
            const alunos = await Aluno.find();
            return alunos;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // Método para atualizar um aluno
    async update(id, nome, RA, sala, ano, atividadeEntregue, temAcesso) {
        try {
            await Aluno.findByIdAndUpdate(id, {
                nome,
                RA,
                sala,
                ano,
                atividadeEntregue,
                temAcesso // Mantendo o status de acesso atualizado
            }, { new: true }); // O `{ new: true }` retorna o documento já atualizado, caso queira usar
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // Método para deletar um aluno
    async delete(id) {
        try {
            await Aluno.findByIdAndDelete(id);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export default new alunoService();
