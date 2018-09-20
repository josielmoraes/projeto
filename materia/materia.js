import Materia from "/imports/collections/materia";
import Tabular from 'meteor/aldeed:tabular';
import {
  Template
} from 'meteor/templating';
import {
  Meteor
} from 'meteor/meteor';
import {
  $
} from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs4';
import OfertaMateria from "/imports/collections/ofertaMateria";

Router.route('/Disciplina', {
  template: 'cadastroMateria',
 
})



new Tabular.Table({
  name: "Materia",
  collection: Materia,
  columns: [{
      data: "codMateria",
      title: "Código"
    },
    {
      data: "nomeMateria",
      title: "Disciplina"
    },
    {
      data: "cargaHoraria",
      title: "C. Horaria"
    },
    {
      data: "aulaSemanal",
      title: "Aulas Semanal"
    },
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

if (Meteor.isClient) {
  Template.cadastroMateria.onCreated(function(){
     $( document ).ready(function() {
        $(".nav-link").removeClass("active")
        $("#menu_disciplina").addClass("active");
      });
  })
  Template.cadastroMateria.helpers({
    'campos': function() {
      $('#codMateria').focus()
      $('#codMateria').val("");
      $('#nomeMateria').val("");
      $('#cargaHorariaMateria').val("");
      $('#aulaSemanal').val("");
      $('#Cadastrar').val("Cadastrar");
      $('#Deletar').val("Voltar");
      $('#formCadastroMateria').validate().resetForm();
      $('#erro').val("");
    },
    homeGo() {
      Router.go('/')
    },
    'permissao': function(valor) {
      if (valor == 0)
        return true;
    },
    validarDeletar: function() {
      var id = Session.get('materia');
      var a = OfertaMateria.find({
        Materia: id._id
      }).fetch();
      var sair;
      var v = "";
      $('#erro').val("");
      if (a.length > 0) {
        v = "Matéria em oferta ";
        sair = false;
      } else {
        sair = true;
      }
      $('#formCadastroMateria').validate().showErrors({
        erro: v
      })
      return (sair)
    },
    validarCodigoAtualizar: function() {
      var c;
      var a;
      var cod = Session.get('materia');
      //console.log('cod anti '+cod.codMateria);
      //console.log('cod novo '+$('#codMateria').val());
      if (cod.codMateria == $('#codMateria').val()) {
        //console.log("codAtualizar");
        return true;
      } else {
        cod = $('#codMateria').val();
        //console.log(cod);
        a = Materia.find({
          codMateria: cod
        }).fetch();
        if (a.length > 0) {
          $('#formCadastroMateria').validate().showErrors({
            erro: "Código cadastrado"
          })

          return false;
        } else {
          $('#formCadastroMateria').valid()
          return true;
        }
      }

    },
    validarCodigoCadastro: function() {
      var cod = $('#codMateria').val();
      //console.log(cod);
      //var a=Meteor.subscribe('MateriaBuscaCodigo',cod)
      var a = Materia.find({
        codMateria: cod
      }).fetch();
      if (a.length > 0) {
        $('#formCadastroMateria').validate().showErrors({
          erro: "Código cadastrado"
        })
        return false;
      } else {
        //console.log("true");
        return true;
      }

    }

  })

  Template.cadastroMateria.onCreated(function() {
    Template.instance().variavelReac = new ReactiveVar(false);
  })


  Template.cadastroMateria.events({
    'click .input': function(event) {
      event.preventDefault();
      var id = $(event.target).prop('id');
      if (id == "Cadastrar") {
        var carga = parseInt($('#cargaHorariaMateria').val());
        console.log(carga);
        var aula = parseInt(carga / 16);
        var dadosMateria = {
          codMateria: $('#codMateria').val(),
          nomeMateria: $('#nomeMateria').val(),
          cargaHoraria: $('#cargaHorariaMateria').val(),
          aulaSemanal: aula,
          dividirMateria: $('#divisao').val()
        }
        Session.set('codMateria', dadosMateria.codMateria);
        var validar = $('#formCadastroMateria').valid();

        var evento = $('#Cadastrar').val();
        if (evento == "Cadastrar" && validar == true) {
          if (Template.cadastroMateria.__helpers.get('validarCodigoCadastro').call()) {
            Meteor.call('cadastrarMateria', dadosMateria);
            Template.cadastroMateria.__helpers.get('campos').call();
          }
        } else if (evento == "Atualizar" && validar == true) {
          if (Template.cadastroMateria.__helpers.get('validarCodigoAtualizar').call()) {
            var id = Session.get('materia');
            Meteor.call('atualizarMateria', id._id, dadosMateria);
            Template.cadastroMateria.__helpers.get('campos').call();
          }
        }
      } else if (id == "Deletar") {
        var evento = $('#Deletar').val();
        //console.log(evento);
        if (evento == "Voltar") {
          $('#formCadastroMateria').validate().resetForm();
          Template.cadastroMateria.__helpers.get('campos').call();
          Router.go('/');
        } else if (evento == "Deletar") {
          var id = Session.get('materia');
          if (Template.cadastroMateria.__helpers.get('validarDeletar').call()) {
            Meteor.call('deletarMateria', id._id);
            Template.cadastroMateria.__helpers.get('campos').call();
          }
        }
      } else if (id == "limpar") {
        Template.cadastroMateria.__helpers.get('campos').call();
      }

    },

    'click tbody > tr': function(event, template) {
      var dataTable = $(event.target).closest('table').DataTable();
      var rowData = dataTable.row(event.currentTarget).data();
      $('#codMateria').val(rowData.codMateria);
      $('#nomeMateria').val(rowData.nomeMateria);
      $('#cargaHorariaMateria').val(rowData.cargaHoraria);
      $('#aulaSemanal').val(rowData.aulaSemanal);
      $('#divisao').val(rowData.dividirMateria);
      $('#Cadastrar').val("Atualizar");
      $('#Deletar').val("Deletar")
      Session.set('materia', rowData)
      //Template.instance().variavelReac.set(true);
    },

    'change #divisao': function(event) {
      var b = $(event.target).val();
      if (b == 0) {
        //trigger.set(false);
        Template.instance().variavelReac.set(false);
      } else {
        //trigger.set(true);
        Template.instance().variavelReac.set(true);
      }
    },


  });

  Template.cadastroMateria.onRendered(function() {
    //console.log("redn")
    $('#formCadastroMateria').validate({
      rules: {
        codMateria: {
          required: true
        },
        nomeMateria: {
          required: true
        },

        cargaHorariaMateria: {
          required: true,
          number: true
        },
        aulaSemanal: {
          required: true,
          number: true
        },
      },
      messages: {
        codMateria: {
          required: "Campo obrigatório"
        },
        nomeMateria: {
          required: "Campo obrigatório"
        },
        cargaHorariaMateria: {
          required: "Campo obrigatório",
          number: "Somente números"
        },
        aulaSemanal: {
          required: "Campo obrigatório",
          number: "Somente números"
        },
      }
    });

  });



};

if (Meteor.isServer) {
  Meteor.methods({
    'cadastrarMateria': function(dadosMateria) {
      Materia.insert({
        codMateria: dadosMateria.codMateria,
        nomeMateria: dadosMateria.nomeMateria,
        cargaHoraria: dadosMateria.cargaHoraria,
        aulaSemanal: dadosMateria.aulaSemanal,
        dividirMateria: dadosMateria.dividirMateria
      }, function(e, r) {
        if (e) {
          //console.log(e)
        } else {
          //console.log(r);
        }
      });

    },
    'main': async function(dados) {
      //console.log("entrou");
      let res = await criarMateria(dados);
      //console.log(res);
    },
    'atualizarMateria': function(id, dadosMateria) {
      Materia.update({
        _id: id
      }, {
        nomeMateria: dadosMateria.nomeMateria,
        cargaHoraria: dadosMateria.cargaHoraria,
        aulaSemanal: dadosMateria.aulaSemanal,
        codMateria: dadosMateria.codMateria,
      });
    },
    'deletarMateria': function(id) {
      Materia.remove({
        _id: id
      });
    },

  });
  Meteor.publish(
    'MateriaBuscaCodigo',
    function(cod) {
      var t = Materia.find({
        codMateria: cod
      }, {
        sort: {
          ordem: 1
        }
      });;
      //console.log(t);
      return t;
    }
  )
  Meteor.publish('materia', function() {
    return Materia.find();
  })

}
