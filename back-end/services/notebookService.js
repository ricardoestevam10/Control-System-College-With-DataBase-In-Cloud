import Notebook from "../model/Notebook.js";
import Aluno from "../model/Alunos.js";

import mongoose from "mongoose";

class notebookService{

    async getAll(){
        try{
            const notebooks = await Notebook.find().populate('aluno')
            return notebooks;
        }catch(error){
            console.log(error);
        throw error;
    }
    }

    async Create(numero, aluno){
        try{
            const newNobook = new Notebook({
                numero,
                aluno
            })
            await newNobook.save()
        }catch(error){
            console.log(error);
        throw error;
    }
    }

    async Update(id, numero, aluno){
        try{
            const updateNotebook = await Notebook.findByIdAndUpdate(
                id,
                {
                    numero,
                    aluno
                },
                {new:true}
            );
            console.log(`Dados do notebook com id ${id} alterados com sucesso`)
            return updateNotebook;
        }catch(error){
            console.log(error);
        throw error;
    }
    }

    async Delete(id){
        try{
            await Notebook.findByIdAndDelete(id);
            console.log(`Noebook com a id: ${id} foi deletado`);
          }catch(error){
            console.log(error);
        throw error;
    }
    }
}

export default new notebookService();