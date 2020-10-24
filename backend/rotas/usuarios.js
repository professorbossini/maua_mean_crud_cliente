const express = require ('express');
const router = express.Router();
const Usuario = require ('../models/usuario')
const bcrypt = require ('bcrypt');
router.post ('/signup', (req, res, next) => {

  bcrypt.hash (req.body.password, 10)
  .then(hash => {
    const usuario = new Usuario ({
      email: req.body.email,
      password: hash
    })
    usuario.save()
    .then(() => {
      res.status(200).json({ mensagem: "Tudo ok", hash: hash });
    })
    .catch ((err) => {
      res.status(500).json({mensagem: "Falhou", erro: JSON.stringify(err)})
    });
  })



});

module.exports = router;
