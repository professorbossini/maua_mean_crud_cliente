const jwt = require ('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    //req.headers.authorizations = Bearer fkjelwjaçlkfjewaçfewlj
    const token = req.headers.authorization.split(" ")[1];
    const tokenDecodificado = jwt.verify(token, "minhasenha");
    req.dadosUsuario = {
      email: tokenDecodificado.email,
      id: tokenDecodificado.id
    }
    next()
  }
  catch (err){
    res.status(401).json({
      mensagem: "Autenticação não autorizada."
    })
  }
}

