// Declarando variaveis ambiente
import "dotenv/config"
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import alunoRoutes from "./routes/alunosRoutes.js";
import notebookRoutes from "./routes/notebookRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use('/', alunoRoutes);
app.use('/', notebookRoutes);
// Puxando Variáveis de usuario do .env
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
// Criando a primeira Rota
app.get("/",(req,res)=>{
   res.send('Olá Mundo');
});


async function conexaoBanco(){
 try{
   await mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@cluster0.idh4eyi.mongodb.net/controle-escola?appName=Cluster0`)
   console.log("Banco Conectado com Sucesso!")
}catch(error){
   console.log("Não foi possível conectar no banco: " + error)
 }
}
conexaoBanco()

// Instanciando Servidor Express
app.listen(8080, (error)=>{
   if(error){
       console.log("Ocorreu um Error:" + error)
   }else{
       console.log("Servidor iniciado com sucesso!")
   }
})