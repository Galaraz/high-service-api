const Mongoose = require("mongoose");
const Usuario = Mongoose.model("Usuario");
const bcrypt = require('bcryptjs');

class UsuarioController {


  static async buscarTodos(req, res) {
    console.log("[USUARIO CONTROLLER] :CHAMOU O MÉTODO BUSCAR TODOS");
    try {
    res.json(await Usuario.find({},{"password":0}));
    } catch (error) {
    console.log("[USUARIO CONTROLLER] : buscarTodos => " + error);
    res.status(500).send("Erro ao buscar Usuarios!");
    }
}

static async buscarTudo(req, res) {
  console.log("[USUARIO CONTROLLER] :CHAMOU O MÉTODO BUSCAR TUDO");
  try {
  res.json(await Usuario.find({}));
  } catch (error) {
  console.log("[USUARIO CONTROLLER] : buscarTodos => " + error);
  res.status(500).send("Erro ao buscar Usuarios!");
  }
}


  static async adicionar(req, res) {
    let UsuarioNovo = req.body;
    try {
      if(UsuarioNovo.username && UsuarioNovo.password) {
        console.log("[USUARIO CONTROLLER] : ENTROU NO MÉTODO ADICIONAR" + "\n PARÂMETRO: " +
              JSON.stringify(UsuarioNovo));
            
        let existeUsuario = await Usuario.findOne({ 'username': UsuarioNovo.username});
        console.log("Usuario: " + UsuarioNovo.username + " Existe?? ==>  " + existeUsuario)
        if(existeUsuario != null) {     
          return res.status(200).send("Usuario já existe");
        }
        else{
          let hash = bcrypt.hashSync(UsuarioNovo.password, 10);
          UsuarioNovo.password = hash
          res.status(201).json(await Usuario.create(UsuarioNovo));
        }
      }
      else{ 
        res.status(200).send("Preencha Username e password");
      }
    }catch (error) {
      res.status(500).send("Erro ao inserir novo usuario: " + error);
    }
  }

  static async editar(req, res) {
    try {
      let usuarioEditar = req.body;

      console.log(
        "[USUARIO CONTROLLER] : CHAMOU O MÉTODO EDITAR" +
          "\n PARÂMETRO: " +
          JSON.stringify(usuarioEditar)
      );

      const { _id, username, password, tipo } = req.body;

      const existeUsuario = await Usuario.findOne({ _id });

      if (!existeUsuario) {
        return res.status(400).json({ error: 'Usuario não existe' });
      }
      
      await existeUsuario.updateOne({
        username,
        password,
        tipo
      });
      
      return res.json(existeUsuario);
      
    } catch (error) {
      console.log("[USUARIO CONTROLLER] : EDITAR => " + error);

      res.status(500).send("Erro ao editar usuario!");
    }
  }
  

  static async inativos(req, res) {

   
    console.log("[USUARIO CONTROLLER] : MÉTODO TODOS OS INATIVOS ");
    try {
      res.json(await Usuario.find({},{"password":0}));
      
    } catch (error) {
      console.log("[USUARIO CONTROLLER] : buscarTodos => " + error);
      res.status(500).send("Erro ao buscar usuarios!");
    }
  }



  static async inativar(req, res) {
    try {
      const { _id } = req.params;
      const usuarioInativo = req.body;

      console.log(
        "[USUARIO CONTROLLER] : CHAMOU O MÉTODO INATIVAR QUERY PARAM" +
          "\n PARÂMETRO: " +
          JSON.stringify(usuarioInativo)
      );

      const existeUsuario = await Usuario.findOne({ _id });

      if (!existeUsuario) {
        return res.status(200).json({ error: 'Usuario não existe' });
      }

      await existeUsuario.updateOne({
        
       
          ativo: false,
       
   
      });

      return res.json(existeUsuario);
      
    } catch (error) {
      console.log("[USUARIO CONTROLLER] : INATIVAR => " + error);

      res.status(500).send("Erro ao inativar usuario!");
    }
  }

  static async ativarInativar(req, res) {
    try {
      let IdAtivarInativar = req.body;
      console.log(
        "[USUARIO CONTROLLER] : CHAMOU O MÉTODO ATIVAR/DESATIVAR" +
          "\n PARÂMETRO: " +
          JSON.stringify(IdAtivarInativar)
      );
      if (IdAtivarInativar._id == undefined) {
        res.send("Atributos insuficientes para a ação!");
      } else {
        let ativarInativar = await Usuario.findById(IdAtivarInativar._id);
        ativarInativar.ativo = !ativarInativar.ativo;
        await Usuario.findByIdAndUpdate(IdAtivarInativar._id,ativarInativar);
        res.status(200).json(ativarInativar);
      }
    } catch (error) {
      console.log("[USUARIO CONTROLLER] : ATIVAR/DESATIVAR => " + error);

      res.status(500).send("Erro ao ativar ou inativar!");
    }
  }

  static async login(req, res){
    //esse teste abaixo deve ser feito no seu banco de dados
    try {
      let user = req.body
      console.log("[USUARIO CONTROLLER] : CHAMOU O MÉTODO LOGAR " + "\n PARÂMETRO: " +
          JSON.stringify(user));
          let foundUser = await Usuario.findOne({ 'username': user.username});
          console.log(JSON.stringify(foundUser))

          console.log("Até aqui OK!!")

          if(foundUser) {     
            console.log(JSON.stringify(foundUser))       
            const result = bcrypt.compareSync(user.password, foundUser.password)
            if(result){
              //res.status(200).json({message: 'Usuário Logado!', statusCode: '200'})
              res.status(200).send("logado")
            }else{
              res.status(200).send("inválido")
              //res.json({message: "Login e Senha inválidos!!"});
            }
            }
          else{
            console.log("ENTROU NO ELSE")
            res.status(200).send("erro")
            //res.json({ message: "Usuario nao encontrado com esses parametros", statusCode: '500' });
          }  
        }catch (error) {
      console.log("[USUARIO CONTROLLER] : LOGAR => " + error);

      //res.status(500).json({message: 'Login inválido!'});
    }
  }


static async deletarTudo(req, res) {
  try {
    console.log("[CONVIDADO CONTROLLER] : CHAMOU O MÉTODO DELETAR");

    res.status(200).json(await Usuario.deleteMany());
    console.log('All Data successfully deleted');

  } catch (error) {
    console.log("[CONVIDADO CONTROLLER] : DELETAR => " + error);

    res.status(500).send("Erro ao deletar convidado!");
  }

}




}

module.exports = UsuarioController;
