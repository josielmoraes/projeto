import {
  Meteor
} from 'meteor/meteor'
import {
  Accounts
} from 'meteor/accounts-base'



Meteor.startup(() => {
  if (Meteor.isClient) {
    $('input').attr('autocomplete', 'off');

    Meteor.loginWithPassword('root', '12', function(e, r) {
      if (e) {
        //console.log(e);
      } else {
        //console.log(r);
        //	console.log('teste')
      }
    })
  }

  if (Meteor.isServer) {

    //Meteor.users.remove({})
    //Processo.remove({})
    //Processo.update({_id:"cxNpkmdtj5JHrTK5z"},{etapas:4})
    //OfertaMateria.remove({});
    //Meteor.users.remove({})
    //ROOT_URL="http://192.168.0.108:3000" meteor run
    smtp = {
      username: 'sistemasieng@ufmt.br', // eg: server@gentlenode.com
      password: 'teste123', // eg: 3eeP1gtizk5eziohfervU
      server: '200.17.60.216', // 200.17.60.216
      port: 465 //465 SSL
    }
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    process.env.MAIL_URL = 'smtps://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
    let templateEmailrecovery = {
      from: function() {
        return smtp.username;
      },
      subject: function(user) {
        return 'Recuperação de Senha';
      },
      text: function(user, url) {
        var newUrl = url.replace('#/reset-password', 'reset');
        return 'Olá,\nPara recuperar sua senha, clique no link...\n' + newUrl;;
      }
    }
    let templateEmailEnroll = {
      from: function() {
        return smtp.username;
      },
      subject: function(user) {
        return 'Cadastro ';
      },
      text: function(user, url) {
        var newUrl = url.replace('#/reset-password', 'reset');
        return 'Olá,\n Você foi cadastro no sistema. Para recuperar sua senha, clique no link...\n' + newUrl;;
      }
    }
    //Accounts.emailTemplates.resetPassword = templateEmailrecovery;
    //Accounts.emailTemplates.enrollAccount=templateEmailEnroll;

    //console.log(us);
    var us = Meteor.users.find({
      username: 'root'
    }).fetch();
    //console.log(us);
    var r = {
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
      //password:'root1234',
      profile: {
        permission: 1,
        name: 'Josiel'
      }
    };
    if (Meteor.users.findOne({
        username: r.username
      }) == null) {
      Accounts.createUser({
        username: r.username,
        email: r.email,
        password: r.password,
        profile: r.profile

      });
    }
    if (Meteor.users.findOne({
        username: a.username
      }) == null) {
      Accounts.createUser({
        username: a.username,
        email: a.email,
        //password:a.password,
        profile: a.profile

      });
    }




  }

})
