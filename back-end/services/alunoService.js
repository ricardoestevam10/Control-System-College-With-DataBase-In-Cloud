import Aluno from "../model/Alunos.js";

class alunoService {
    // Método para cadastrar um aluno
    async Create(nome, RA, sala, ano, temAcesso) {
        try {
            const newAluno = new Aluno({
                nome,
                RA,
                sala,
                ano,
                temAcesso // Salvando o status de acesso no cadastro do aluno
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
