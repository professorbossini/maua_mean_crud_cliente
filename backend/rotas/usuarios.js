const express = require ('express');
const router = express.Router();
const Usuario = require ('../models/usuario')
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

router.post ('/login', (req, res, next) => {
  //SELECT * FROM usuario WHERE email = req.body.email
  let user;
  Usuario.findOne({email: req.body.email}).then( u => {
    if (!u){
      return res.status(401).json({
        mensagem: "Email inválido"
      })
    }
    user = u;
    return bcrypt.compare(req.body.password, u.password);
  })
  .then(result => {
    if(!result){
      return res.status(401).json({
        mensagem: "senha inválida"
      })
    }
    const token = jwt.sign(
      //{email: a@a.com, id: 3} => fkewjafçwlaekjewalçj2l1ooi23
      {email: user.email, id: user._id},
      'minhasenha',
      {expiresIn: '1h'}
    )
    res.status(200).json({token: token, expiresIn: 3600});
  })
  .catch (err => {
    return res.status(401).json({
      mensagem: "Login falhou: " + err
    })
  })
});


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
      console.log ("Chegou no catch")
      res.status(500).json({mensagem: "Falhou", erro: JSON.stringify(err)})
    });
  })



});

module.exports = router;
