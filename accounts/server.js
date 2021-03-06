import {
  Meteor
} from 'meteor/meteor'
import {
  Accounts
} from 'meteor/accounts-base'
import Processo from '/imports/collections/processo'
import Curso from "../imports/collections/curso";
import OfertaMateria from "/imports/collections/ofertaMateria";
import Prefix from '../imports/prefix.js';
Meteor.startup(() => {

  if (Meteor.isClient) {
   
    $('input').attr('autocomplete', 'off')
    /*Meteor.call('csv',function(e,r){
      if(e){

      }else{
        for(user of r ){
          console.log(user)
        /*  Meteor.call('cadastrarUsuario', user, function(e, r) {
            if (e) {
              console.log(e+" ")
            } else {
              Meteor.call("emailCadastro");
             Accounts.forgotPassword({
                email: user.email
              })
            }
          })
        }
      }
    })*/
  }

  if (Meteor.isServer) {

    process.env.MONGO_URL="mongodb://horario:xJuECxR8@localhost:27017/horario";
    process.env.ROOT_URL="https://faeng.ufmt.br/horario";
    console.log(process.env.HTTP_FORWARDED_COUNT)
    Meteor.methods({
      "csv":function(){
    var fs = require('fs');
    // Assume that the csv file is in yourApp/public/data folder
    var data = fs.readFileSync(process.env.PWD+'/public/usuarios.csv', 'utf8');
    var array=new Array();
    var tmp=new Array();
    var string="";
    var cont=0;
    var total="";
    for(i=0;i<data.length;i++){

      if(data[i]=='\n'){
        tmp[cont]=string;
        string="";
        array.push(tmp);
        cont=0
        tmp=new Array();
      }else{
        if(data[i]==';' ){
          tmp[cont]=string;
          cont++;
          string="";
        }else{
          string+=data[i];
          total+=data[i];
        }
      }
    }
    var json=new Array()
    var users=[]
    for(x=1;x<array.length;x++){
      name=array[x][1]
      r=name.replace(/\s+/g, ' ');
      name=name.toLowerCase();
      user={
        email:array[x][2],
        password: 'tmp1234',
        profile:{
          name:array[x][0],
          siape:array[x][1],
          permission:1,
          subFuncao:2
        }
      }
      users.push(user)
    }
    return users
  }
  })




  smtp = {
    username: 'sistemasieng@ufmt.br', // eg: server@gentlenode.com
    password: 'teste123', // eg: 3eeP1gtizk5eziohfervU
    server: '200.17.60.216', // 200.17.60.216
    port: 465 //465 SSL
  }
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  process.env.MAIL_URL = 'smtps://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;



  /*  var r = {
  username: 'root',
  email: 'josielloureirodemoraes@gmail.com',
  password: 'root1234',
  profile: {
  permission: 0,
  name: 'Root'
}
};
var a = {
username: 'josiel',
email: 'josiel@gmail.com',
password: 'root1234',
profile: {
permission: 0,
name: 'Josiel'
}
};
if (Meteor.users.findOne({
username: r.username
}) == null) {
var out = ""
out = Accounts.createUser({
username: r.username,
email: r.email,
password: r.password,
profile: r.profile

});
if (out != '') {
Email.send({
from: smtp.username,
to: r.email,
subject: 'Cadastro no sistema de horario',
text: 'Voce foi cadastrado no site de horário da Faculdade de Engenharias do Campus de Várzea Grande.\n\nLogin:' + r.email + '\nSenha:' + r.password + '\nNo endereço: '
})
}

if (Meteor.users.findOne({
username: a.username
})!==undefined) {
Accounts.createUser({
username: a.username,
email: a.email,
//password:a.password,
profile: a.profile

});
}*/
var Api = new Restivus({
  version: 'v2',
  useDefaultAuth: false,
  prettyJson: true
});
Api.addRoute('processo', {
  get: function() {
    let tmp = Processo.find().fetch();
    for( x in tmp){
      let id=tmp[x].semestreSelecionado;
      let semestre=Semestre.find({_id:id}).fetch();
      tmp[x].semestre=semestre;
    }
    return {
      status: 'success',
      data: tmp
    };
  }
})
Api.addRoute('curso', {
  get: function() {
    let tmp = Curso.find().fetch();
    return {
      status: 'success',
      data: tmp
    };
  }
})
Api.addRoute('ofertas/:processo/:curso/:semestre', {
  get: function() {
    console.log(this.urlParams)
    let pro=this.urlParams.processo;
    let sem=this.urlParams.semestre;
    let curso=this.urlParams.curso;
    let tmp = OfertaMateria.find({
      Processo: pro,
      Semestre: sem,
      'Curso._id': curso,
    }).fetch();
    let tmp2 = OfertaMateria.find({
      Processo: pro,
      'Ofertantes.semestre': sem,
      'Ofertantes.curso._id': curso
    }).fetch();
    Array.prototype.push.apply(tmp,tmp2);
    return {
      status: 'success',
      data: tmp
    };
  }
})
Api.addRoute('ofertas/:processo', {
  get: function() {
    console.log(this.urlParams)
    let pro=this.urlParams.processo;
    let tmp = OfertaMateria.find({
      Processo: pro
    }).fetch();
    return {
      status: 'success',
      data: tmp
    };
  }
})
Api.addRoute('ofertas/ofertantes/:processo/:curso/:semestre', {
  get: function() {
    console.log(this.urlParams)
    let pro=this.urlParams.processo;
    let sem=this.urlParams.semestre;
    let curso=this.urlParams.curso;
    let tmp = OfertaMateria.find({
      Processo: pro,
      'Ofertantes.semestre': sem,
      'Ofertantes.curso._id': curso
    }).fetch();
    return {
      status: 'success',
      data: tmp
    };
  }
})




}

})
