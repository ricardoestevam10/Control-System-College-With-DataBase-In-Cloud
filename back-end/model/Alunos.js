import mongoose from "mongoose";



const alunoSchema = new mongoose.Schema({
nome:
{
    type: String,
     required: true
},

RA:   
{
    type: Number,
    required: false
},

sala:
{
    type: String,
    required: true
},

ano: 
{
    type: String,
    required: true}
});

const Aluno = mongoose.model('Aluno', alunoSchema);

export default Aluno;

