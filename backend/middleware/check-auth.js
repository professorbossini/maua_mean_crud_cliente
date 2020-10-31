const jwt = require ('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    //req.headers.authorizations = Bearer fkjelwjaçlkfjewaçfewlj
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "minhasenha");
    next()
  }
  catch (err){
    res.status(401).json({
      mensagem: "Autenticação falhou"
    })
  }
}

