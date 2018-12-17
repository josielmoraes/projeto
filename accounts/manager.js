import Prefix from '../imports/prefix.js';
Router.route(Prefix+'/esqueciSenha', {
  template: 'ForgotPassword',
  name:"esqueciSenha"
})
Router.route(Prefix+'/reset/:token', {
  template: 'ResetPassword',
  name: 'resetPassword',
  onBeforeAction() {
    $('body').addClass('bg-blue')
    if (!Meteor.userId()) {
      Meteor.call('checkResetToken', this.params.token, (err) => {
        if (err) {
          console.log(err.message);
          Bert.alert('Link de recuperação expirado.', 'danger', 'growl-top-right');
          Router.go("home");
        }
      });
      Accounts._resetPasswordToken = this.params.token;
      this.next();
    } else {
      Accounts._resetPasswordToken = null;
      Router.go("home");
    }
  }
});
if (Meteor.isClient) {
  Template.ForgotPassword.onCreated(function() {
    $('body').addClass('bg-blue')
  })
  Template.login.onCreated(function() {
    Session.set('showModal', false);
    var self = this;
    self.autorun(function() {
      self.subscribe("buscaProcesso");
      self.subscribe("acharSemetre");
      self.subscribe("area");
      self.subscribe("curso");
      self.subscribe("buscaProfessores");
    })
  })
  Template.login.helpers({
    'showModal': function() {
      return Session.get('showModal')
    },
    logado(current) {
      if (current != null) {
        return false;
      } else {
        console.log(false)
        return true;
      }
    }
  })
  Template.login.events({
    'click #esqueciSenha': function(event, template) {
      console.log("esquicisenha");
      //Modal.show('ForgotPassword');
      //Router.go('/esqueciSenha')
    },
    'submit form': function(event) {
      event.preventDefault();
      var email = $('#emailLogin').val();
      var senha = $("#pwdLogin").val();
      Meteor.loginWithPassword(email, senha, function(e, r) {
        if (e) {
          //console.log(e);
          $('#validarLogin').validate().showErrors({
            erroLogin: "Email ou senha não confere",
          })
        } else {
          console.log(Meteor.userId);
          //if (Meteor.userId != null) {
            //data current
            var td = new Date();
            var dia = td.getDate();
            var mes = td.getMonth() + 1;
            var ano = td.getFullYear();
            if (mes < 10) {
              mes = '0' + mes;
            }
            td = ano + '-' + mes + "-" + mes;
            var processos = Processo.find().fetch();
            for (x = 0; x < processos.length; x++) {
              //console.log(processos[x].etapas);
              etapas = processos[x].etapas;
              //comparar data limite pra oferta
              if (etapas == 0) {
                strData = processos[x].dataLimite;
                parse = strData.split("-");
                data = new Date(parse[0], parse[1] - 1, parse[2]);
                resu = data - new Date()
                console.log(data, new Date())
                console.log(data >= new Date())
                if (data >= new Date()) {
                  Bert.alert('Tem até ' + parse[2] + '/' + (parse[1]) + '/' + parse[0] + ' para realizar pré-oferta', 'default', 'growl-top-right', 'fa-bell')
                } else {
                  Meteor.call("mudarEtapa", processos[x]._id, 1);
                  Bert.alert('Pré-oferta finalizada', 'default', 'growl-top-right', 'fa-bell')
                }
                //final de data limite
              } else if (etapas == 1) {
                //comparar alocar professor
                strData = processos[x].alocarProfessor;
                parse = strData.split("-");
                data = new Date(parse[0], parse[1] - 1, parse[2]);
                if (data >= new Date) {
                  Bert.alert('Tem até ' + parse[2] + '/' + (parse[1]) + '/' + parse[0] + ' para alocar professor', 'default', 'growl-top-right', 'fa-bell')
                } else {
                  Meteor.call("mudarEtapa", processos[x]._id, 2);
                  Bert.alert('Alocacão de professores finalizada', 'default', 'growl-top-right', 'fa-bell')
                }
                //final alocar professor
              } else if (etapas == 2) {
                //confirmar oferta
                strData = processos[x].aprovarProcesso;
                parse = strData.split("-");
                data = new Date(parse[0], parse[1] - 1, parse[2]);
                if (data >= new Date) {
                  Bert.alert('Tem até ' + parse[2] + '/' + (parse[1]) + '/' + parse[0] + ' para aprovar', 'default', 'growl-top-right', 'fa-bell')
                } else {
                  Meteor.call("mudarEtapa", processos[x]._id, 3);
                  Bert.alert('Aprovação finalizada', 'default', 'growl-top-right', 'fa-bell')
                }
                //fim confirmar
              } else if (etapas == 3) {
                //restricao
                strData = processos[x].restricao;
                parse = strData.split("-");
                data = new Date(parse[0], parse[1] - 1, parse[2]);
                console.log(data);
                if (data >= new Date) {
                  Bert.alert('Tem até ' + parse[2] + '/' + (parse[1]) + '/' + parse[0] + ' para realizar restricão de disciplinas', 'default', 'growl-top-right', 'fa-bell')
                } else {
                  Meteor.call("mudarEtapa", processos[x]._id, 4);
                  Bert.alert('Restrição entre disciplinas finalizadas', 'default', 'growl-top-right', 'fa-bell')
                }
                //fim restricao
              } else if (etapas == 4) {
                //criar Horario
                strData = processos[x].criarHorario;
                parse = strData.split("-");
                data = new Date(parse[0], parse[1] - 1, parse[2]);
                if (data >= new Date) {
                  Bert.alert('Tem até ' + parse[2] + '/' + (parse[1]) + '/' + parse[0] + ' para criar horário', 'default', 'growl-top-right', 'fa-bell')
                } else {
                  Meteor.call("mudarEtapa", processos[x]._id, 5);
                  Bert.alert('Criação de horário finalizada', 'default', 'growl-top-right', 'fa-bell')
                }
                //fim criar Horario
              } else if (etapas == 5) {
                //alocar sala
                strData = processos[x].alocarSala;
                parse = strData.split("-");
                data = new Date(parse[0], parse[1] - 1, parse[2]);
                console.log(data);
                if (data >= new Date) {
                  Bert.alert('Tem até ' + parse[2] + '/' + (parse[1]) + '/' + parse[0] + ' para alocar sala', 'default', 'growl-top-right', 'fa-bell')
                } else {
                  Meteor.call("mudarEtapa", processos[x]._id, 6);
                  Bert.alert('Alocação de sala finalizada', 'default', 'growl-top-right', 'fa-bell')
                }
              }
              //fim alocar
            }
          //}
          Router.go('home')
        }
      })
    },
    'click #sair': function(event) {
      event.preventDefault();
      console.log('sair')
      Meteor.logout()
    }
  })

  Template.ForgotPassword.events({
    'submit #forgotPasswordForm': function(event, t) {
      event.preventDefault();
      let myEmail = event.target.email.value;
      console.log(myEmail)
      Meteor.call("resetEmail");
      Accounts.forgotPassword({
        email: myEmail
      }, function(error) {
        if (error) {
          if (error.message === 'User not found [403]') {
            //alert(BertMsg.login.errorEmailNotFound, 'danger', 'growl-top-right');
          } else {
            //  Bert.alert(BertMsg.errorUnknown, 'danger', 'growl-top-right');
          }
        } else {
          //Bert.alert(BertMsg.login.successRecover, 'success', 'growl-top-right');
          //Router.go("home");
        }
      });
      //Modal.hide('ForgotPassword');
      Router.go('home')
    },
  });

  Template.ResetPassword.events({
    'submit #resetForm': function(event, t) {
      event.preventDefault();
      const newpassword = event.target.novaSenha.value;
      const newpasswordconfirm = event.target.confirmarSenha.value;
      /*
      const passcondition =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/;

            if (!passcondition.test(newpassword)){
            Bert.alert(BertMsg.password.errorIncorrectPassword, 'danger', 'growl-top-right');
          } else if (newpassword != newpasswordconfirm) {
          Bert.alert(BertMsg.password.errorMatchPasswords, 'danger', 'growl-top-right');
        } else {
        Accounts.resetPassword(Accounts._resetPasswordToken, newpassword, function(error) {
        if (error) {
        Bert.alert(BertMsg.errorUnknown, 'danger', 'growl-top-right');
      } else {
      Bert.alert(BertMsg.password.success, 'success', 'growl-top-right');
      Meteor.call('changeFirstLogin');
      }
      });
      }
      */
      if (newpassword == newpasswordconfirm) {
        console.log(Accounts._resetPasswordToken, newpassword)
        Accounts.resetPassword(Accounts._resetPasswordToken, newpassword)
        Meteor.logout();
      } else {
        alert("Senhas diferentes")
      }
      Meteor.logout();
      Router.go('home')
    },
    'click #cancelar': function(event) {
      event.preventDefault;
      Router.go('home')
    }
  });


}
if (Meteor.isServer) {

  Meteor.methods({
    checkResetToken(token) {
      const user = Meteor.users.findOne({
        "services.password.reset.token": token
      });
      if (!user) {
        throw new Meteor.Error(403, "Token expired");
      }

      const when = user.services.password.reset.when;
      const reason = user.services.password.reset.reason;
      let tokenLifetimeMs = Accounts._getPasswordResetTokenLifetimeMs();
      if (reason === "enroll") {
        tokenLifetimeMs = Accounts._getPasswordEnrollTokenLifetimeMs();
      }
      const currentTimeMs = Date.now();
      if ((currentTimeMs - when) > tokenLifetimeMs) { // timeout
        throw new Meteor.Error(403, "Token expired");
      }
    },
    'resetEmail': function() {
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
      Accounts.emailTemplates.resetPassword = templateEmailrecovery;
      console.log(templateEmailrecovery)
    }
  });

}
