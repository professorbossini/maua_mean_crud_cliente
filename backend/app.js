const express = require (`express`);
const app = express();
const bodyParser = require ('body-parser');
const Cliente = require ('./models/cliente');
const mongoose = require ('mongoose');
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://user_maua:senha_maua@cluster0.ssm0w.mongodb.net/maua-clientes?retryWrites=true&w=majority")
.then(() => console.log ("Conexão OK"))
.catch(() => console.log ("Conexão NOK"));

/*const clientes = [
  {
    id: '1',
    nome: 'José',
    fone: '11223344',
    email: 'jose@email.com'
  },
  {
    id: '2',
    nome: 'Maria',
    fone: '44556677',
    email: 'maria@email.com'
  },
  {
    id: '3',
    nome: 'Joao',
    fone: '44556677',
    email: 'joao@email.com'
  }
]*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
})

app.post ('/api/clientes', (req, res, next) => {
  const cliente = new Cliente({
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  });
  cliente.save();
  res.status(201).json({mensagem: 'Cliente inserido'})
});

app.get('/api/clientes', (req, res, next) => {
  Cliente.find().then((documents) => {
    res.status(200).json({
      mensagem: 'Tudo OK',
      clientes: documents
    });
  });
});

module.exports = app;
