const express = require ('express');
const multer = require('multer');
const router = express.Router();
const Cliente = require('../models/cliente');
const checkAuth = require ('../middleware/check-auth');

const MIME_TYPE_EXTENSAO_MAPA = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/bmp': 'bmp'
}


const armazenamento = multer.diskStorage({
  destination: (req, file, callback) => {
    let e = MIME_TYPE_EXTENSAO_MAPA[file.mimetype] ? null : new Error ('Mime Type Invalido');
    callback (e, "backend/imagens")
  },
  filename: (req, file, callback) => {
    const nome = file.originalname.toLowerCase().split(" ").join('-');
    const extensao = MIME_TYPE_EXTENSAO_MAPA[file.mimetype];
    callback (null, `${nome}-${Date.now()}.${extensao}`);
  }
})


router.post('', checkAuth, multer({storage: armazenamento}).single('imagem'), (req, res, next) => {
  //http://www.endereco.com.br/imagens/foto.png
  const imagemURL = `${req.protocol}://${req.get('host')}`;
  const cliente = new Cliente({
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email,
    imagemURL: `${imagemURL}/imagens/${req.file.filename}`,
    criador: req.dadosUsuario.id
  });
  //console.log (req.dadosUsuario);
  //res.status(200).json({});
  cliente.save().then((clienteInserido) => {
    res.status(201).json({
      mensagem: 'Cliente inserido',
      //id: clienteInserido._id,
      cliente: {
        id: clienteInserido._id,
        nome: clienteInserido.nome,
        fone: clienteInserido.fone,
        email: clienteInserido.email,
        imagemURL: clienteInserido.imagemURL
      }
    })
  })
  .catch( erro => {
    res.status(500).json({
      mensagem: "Inserção falhou. Tente novamente mais tarde."
    })
  })
});

router.get('', (req, res, next) => {
  //console.log (req.query);
  const pageSize = +req.query.pagesize;
  const page = +req.query.page;
  const consulta = Cliente.find();
  let clientesEncontrados;
  if (pageSize && page){
    consulta.
    skip(pageSize * (page - 1)).
    limit (pageSize)
  }
  consulta
  .then((documents) => {
    clientesEncontrados = documents;
    return Cliente.count();
  })
  .then((count) => {
    res.status(200).json({
      mensagem: "Tudo Ok",
      clientes: clientesEncontrados,
      maxClientes: count
    })
  })
  .catch(erro => {
    res.status(500).json({
      mensagem: "Busca por clientes falhou. Tente novamente mais tarde."
    })
  })
});

//DELETE /api/cliente/123456
router.delete('/:id', checkAuth, (req, res, next) => {
  Cliente.deleteOne({ _id: req.params.id, criador: req.dadosUsuario.id})
    .then((resultado) => {
      if (resultado.n > 0){
        res.status(200).json({ mensagem: "Cliente removido" })
      }
      else{
        res.status(401).json({mensagem: "Remoção não autorizada"})
      }
    })
    .catch(erro => {
      res.status(500).json({
        mensagem: "Remoção falhou. Tente novamente mais tarde."
      })
    })
})

router.put('/:id', checkAuth, multer({ storage: armazenamento }).single('imagem') , (req, res, next) => {
  //console.log (req.file);
  let imagemURL = req.body.imagemURL;
  if (req.file){
    const url = req.protocol + "://" + req.get('host');
    imagemURL = url + "/imagens/" + req.file.filename;
  }
  const cliente = new Cliente({
    _id: req.params.id,
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email,
    imagemURL: imagemURL,
    criador: req.dadosUsuario.id
  })
  Cliente.updateOne({ _id: req.params.id, criador: req.dadosUsuario.id }, cliente)
    .then((resultado) => {
      console.log(resultado)
      if (resultado.nModified > 0){
        res.status(200).json({ mensagem: "Atualização realizada com sucesso" });
      }
      else{
        res.status(401).json({mensagem: "Atualização não permitida"})
      }
    })
    .catch(erro => {
      res.status(500).json({
        mensagem: "Atualização falhou. Tente novamente mais tarde."
      })
    })

});

router.get('/:id', (req, res, next) => {
  Cliente.findById(req.params.id)
    .then(cli => {
      if (cli)
        res.status(200).json(cli)
      else
        res.status(404).json({ mensagem: "Cliente não encontrado!" })
    })
    .catch(erro => {
      res.status(500).json({
        mensagem: "Busca por cliente falhou. Tente novamente mais tarde."
      })
    })
});

module.exports = router;

