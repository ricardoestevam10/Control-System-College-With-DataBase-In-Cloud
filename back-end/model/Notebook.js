import mongoose from "mongoose";


const notebookSchema = new mongoose.Schema({
   numero:
    {
        type: Number,
        required: true
    },

    aluno:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aluno',
        required: true
    }
});
    const Notebook = mongoose.model('Notebook', notebookSchema);

    export default Notebook;