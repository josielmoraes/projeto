import Tabular from 'meteor/aldeed:tabular';
import Prefix from '../imports/prefix.js';
Router.route(Prefix+'/Usuario', {
  template: 'cadastroUsuario',
  name:'cadastroUsuario'
})



new Tabular.Table({
  name: "Usuario",
  collection: Meteor.users,
  columns: [{
      data: "profile.name",
      title: "Usuário"
    },
    {
      data: "emails[0].address",
      title: "Email"
    },
    {
      data: "profile.siape",
      title: "Siape"
    },
    {
      data: "funcao()",
      title: "Função"
    },
    {
      data: "subFuncao()",
      title: "SubFunção"
    },
  ],
  extraFields: [
    'emails[0]',
  ],

  responsive: true,
  autoWidth: false,
  language: {
    "decimal": "",
    "emptyTable": "Nao há dados disponível",
    "info": "Mostrando de _START_ a _END_ de _TOTAL_ registros",
    "infoEmpty": "Mostrando 0 a 0 de 0 registros",
    "infoFiltered": "(filtrado um total de  _MAX_  registros)",
    "infoPostFix": "",
    "thousands": ",",
    "lengthMenu": "Exibindo _MENU_ registros por página",
    "loadingRecords": "Carregando...",
    "processing": "Processando...",
    "search": "Procurar:",
    "zeroRecords": "Não encontrado nenhum registro",
    "paginate": {
      "first": "Primeira",
      "last": "Última",
      "next": "Próxima",
      "previous": "Anterior"
    },
  }
})
Meteor.users.helpers({
  'funcao': function() {
    var a = Meteor.users.findOne({
      _id: this._id
    })
    a = a.profile.permission;

    if (a == 0) {
      return "Super Usuário(a)";
    } else if (a == 1) {
      return "Professor(a)";
    } else if (a == 2) {
      return "Técnico(a)";
    }
  },
  'subFuncao': function() {
    var a = Meteor.users.findOne({
      _id: this._id
    })
    a = a.profile.subFuncao;
    if (a == 0) {
      return "Diretor(a)";
    } else if (a == 1) {
      return "Coordenador(a) de Curso";
    } else if (a == 2) {
      return "PCDE"
    } else if (a == 4) {
      return "";
    }
  }

})


function validarUsuario() {
  ////console.log("email 1",$('#emailUsuario').val());
  var c = $('#emailUsuario').val()
  var sair = Meteor.users.findOne({
    "emails.address": c.toString()
  });
  ////console.log(sair)
  if (sair != null) {
    $('#formCadastroUsuario').validate().showErrors({
      emailUsuario: 'Email cadastrado'
    })
    return false;
  } else {
    return true;
  }
};
if (Meteor.isClient) {
  Template.cadastroUsuario.onCreated(function() {
    Session.set('mostrarSubFuncao', false);
     $( document ).ready(function() {
        $(".nav-link").removeClass("active")
        $("#menu_usuario").addClass("active");
      });
  })
  Template.cadastroUsuario.helpers({
    'logado': function(l) {
      Session.set('user', l)
    },
    validarUsuario() {
      ////console.log("email 1",$('#emailUsuario').val());
      var c = $('#emailUsuario').val()
      var sair = Meteor.users.findOne({
        "emails.address": c.toString()
      });
      ////console.log(sair)
      if (sair != null) {
        $('#formCadastroUsuario').validate().showErrors({
          emailUsuario: 'Email cadastrado'
        })
        return false;
      } else {
        return true;
      }
    },
    campos() {
      $('#nomeUsuario').focus();
      $('#nomeUsuario').val("");
      $('#emailUsuario').val("");
      $('#funcao').val(0);
      $('#siape').val("");
      $('#cadastrar').val("Cadastrar");
      $('#deletar').val("Voltar");
      $('#deletar').addClass("btn-success");
      $('#deletar').removeClass("btn-danger");
      Session.set('mostrarSubFuncao', false);
    },
    'permissao': function(valor) {
      if (valor == 0) {
        return true;
      } else {
        Router.go('home')
        return false
      }
    },
    mostrarSubFuncao() {
      return Session.get('mostrarSubFuncao');
    },
    homeGo() {
      Router.go('home')
    }
  })
  Template.cadastroUsuario.onRendered(function() {
    ////console.log("render");
    $('#formCadastroUsuario').validate({
      rules: {
        nomeUsuario: {
          required: true
        },
        emailUsuario: {
          required: true,
          email: true,
        }
      },
      messages: {
        nomeUsuario: {
          required: "Campo obrigatório"
        },
        emailUsuario: {
          required: "Campo obrigatório",
          email: "Entre com email valido"
        }
      }
    })
  })
  Template.cadastroUsuario.events({
    'click .input': function(event) {
      event.preventDefault();
      var id = $(event.target).prop('id');
      if (id == "cadastrar") {
        var validar = $('#formCadastroUsuario').valid()

        ////console.log(sair,validar);
        var dados = {
          email: $('#emailUsuario').val(),
          profile: {
            name: $('#nomeUsuario').val(),
            permission: $('#funcao').val(),
            siape: $("#siape").val(),
            subFuncao: $("#subFuncao").val()
          }
        }
        var evento = $('#cadastrar').val();
        ////console.log(evento)
        if (evento == "Cadastrar" && validar) {
          var sair = validarUsuario();
          if (sair) {
            Meteor.call('cadastrarUsuario', dados, function(e, r) {
              if (e) {} else {
                Meteor.call("emailCadastro");
                Accounts.forgotPassword({
                  email: dados.email
                })
              }
            })
          }
          Template.cadastroUsuario.__helpers.get("campos").call()
        } else if (evento == "Atualizar" && validar) {
          ////console.log('atualizar')
          var user = Session.get('user');
          Meteor.call('atualizarUsuario', user._id, dados);
          Template.cadastroUsuario.__helpers.get("campos").call()
        }

      } else if (id == "deletar") {
        var evento = $('#deletar').val();
        if (evento == "Voltar") {
          Router.go('home');
        } else if (evento == "Deletar") {
          var user = Session.get('user');
          Meteor.call('removerUsuario', user);
          Template.cadastroUsuario.__helpers.get("campos").call()
        }
      } else if (id = "limparCampos") {
        Template.cadastroUsuario.__helpers.get("campos").call()
      }
    },
    'click tbody > tr': function(event, template) {
      var dataTable = $(event.target).closest('table').DataTable();
      var rowData = dataTable.row(event.currentTarget).data();
      ////console.log(rowData)
      $('#nomeUsuario').val(rowData.profile.name);
      $('#emailUsuario').val(rowData.emails[0].address);
      $('#funcao').val(rowData.profile.permission);
      $('#siape').val(rowData.profile.siape);
      if (rowData.profile.subFuncao != null) {
        Session.set('mostrarSubFuncao', true);
        console.log(rowData.profile.subFuncao)
        setTimeout(function() {
          $('#subFuncao').val(rowData.profile.subFuncao)
        }, 10)
      } else {
        Session.set('mostrarSubFuncao', false);
      }
      $('#cadastrar').val("Atualizar");
      $('#deletar').val("Deletar");
      $('#deletar').addClass("btn-danger");
      $('#deletar').removeClass("btn-success");
      Session.set("user", rowData);
    },
    'change #funcao': function(event) {
      var tmp = $('#funcao').val();
      if (tmp == 1) {
        Session.set('mostrarSubFuncao', true);
      } else {
        Session.set('mostrarSubFuncao', false);
      }
    }

  })

}

if (Meteor.isServer) {

  Meteor.methods({

    'sendConfirmation': function(user) {
      Accounts.sendEnrollmentEmail(user)
      //Accounts.sendResetPasswordEmail(user);
    },
    cadastrarUsuario: function(user) {
      var id = Accounts.createUser({
        email: user.email,
        profile: user.profile
      })
      //console.log(id)
    },
    atualizarUsuario: function(id, user) {
      Meteor.users.update({
        _id: id
      }, {
        $set: {
          email: user.email,
          profile: user.profile
        }
      })
    },
    removerUsuario: function(user) {
      Meteor.users.remove({
        _id: user._id
      })
    },
    'emailCadastro': function() {
      let templateEmailEnroll = {
        from: function() {
          return smtp.username;
        },
        subject: function(user) {
          return 'Cadastro ';
        },
        text: function(user, url) {
          var newUrl = url.replace('#/reset-password', '/horario/reset');
          return 'Olá,\nVocê foi cadastro no sistema para criar horario do campus. Para gerar sua senha, clique no link...\n' + newUrl;;
        }
      }
      Accounts.emailTemplates.resetPassword = templateEmailEnroll;
    }
  })
  Meteor.publish("usuarioProfessor", function() {
    var tmp = Meteor.users.find({
      'profile.permission': "1"
    })
    for (x = 0; x < tmp.length; x++) {
      console.log('novo ', tmp[x].profile)
    }
    return tmp //Meteor.users.find({'profile.permission':0});
  })

}
