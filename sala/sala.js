import Sala from "../imports/collections/sala";
import Tabular from 'meteor/aldeed:tabular';
Router.route('/Sala', {
  template: 'sala',
})
new Tabular.Table({
  name: "Sala",
  collection: Sala,
  columns: [{
      data: "local",
      title: "Local"
    },
    {
      data: "numero",
      title: "Número"
    },
    {
      data: "apelido",
      title: "Apelido"
    },
    {
      data: "ocupacao",
      title: "Ocupação"
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
  Template.sala.onCreated(function(){
     $( document ).ready(function() {
        $(".nav-link").removeClass("active")
      $("#menu_sala").addClass("active");
      });
  })
  Template.sala.helpers({
    'permissao': function(valor) {
      if (valor == 0) {
        return true;
      } else {
        Router.go('/')
        return false
      }
    },
  })
  Template.cadastrarSala.helpers({
    campos() {
      $('#localSala').val("");
      $('#numeroSala').val("");
      $('#apelidoSala').val("")
      $('#ocupacao').val(0)
      $('#Cadastrar').val("Cadastrar");
      $('#Deletar').val("Voltar");
      $('#Deletar').addClass("btn-success");
      $('#Deletar').removeClass("btn-danger");
      $('#localSala').focus()
      //$("#formCadastrosala").validate().resetForm();
    },

  })
  Template.cadastrarSala.onCreated(function() {
    Session.set('salaSelcionada', "");
    $('#localSala').focus()
  })
  Template.cadastrarSala.onRendered(function() {
    $('#formCadastrosala').validate({
      rules: {
        localSala: {
          required: true,
          minlength: 4
        },
        numeroSala: {
          required: true,
        },
        ocupacao: {
          required: true,
        },

      },
      messages: {
        localSala: {
          required: " Campo obrigatório",
          minlength: "Mínimo de 4 letras"
        },
        numeroSala: {
          required: " Campo obrigatório",
        },
        ocupacao: {
          required: " Campo obrigatório",
        },


      }
    })


  })
  Template.cadastrarSala.events({
    'click .input': function(event) {
      event.preventDefault()
      var id = $(event.target).prop('id');
      //console.log(id);
      if (id == "Cadastrar") {
        var local = $('#localSala').val();
        var num = $('#numeroSala').val();
        var apelido = $('#apelidoSala').val()
        var ocupacao = $('#ocupacao').val()
        var evento = $('#Cadastrar').val();
        var sair = $('#formCadastrosala').valid();
        if (evento == "Cadastrar" && sair) {
          Meteor.call('cadastrarSala', local, num, apelido,parseInt(ocupacao));
        } else if (evento == "Atualizar" && sair) {
          var sala = Session.get('salaSelcionada');
          Meteor.call('atualizarSala', sala._id.toString(), local, num, apelido,parseInt(ocupacao));
        }
        Template.cadastrarSala.__helpers.get('campos').call()
        Session.set('salaSelcionada', '')
      } else if (id == "Deletar") {
        var evento = $('#Deletar').val();
        if (evento == "Voltar") {
          Router.go('/')
        } else if (evento == "Deletar") {
          var sala = Session.get('salaSelcionada');
          Meteor.call('deletarSala', sala._id.toString())
          Template.cadastrarSala.__helpers.get('campos').call()
          Session.set('salaSelcionada', '')
        }
      } else if (id == "Limpar") {
        Template.cadastrarSala.__helpers.get('campos').call()
      }
    },
    'click tbody > tr': function(event, template) {
      var dataTable = $(event.target).closest('table').DataTable();
      var rowData = dataTable.row(event.currentTarget).data();
      //console.log(rowData)
      $('#localSala').val(rowData.local);
      $('#numeroSala').val(rowData.numero);
      $('#apelidoSala').val(rowData.apelido)
      $('#ocupacao').val(rowData.ocupacao)
      $('#Cadastrar').val("Atualizar");
      $('#Deletar').val("Deletar");
      $('#deletar').addClass("btn-danger");
      $('#deletar').removeClass("btn-success");
      Session.set('salaSelcionada', rowData)
    }
  })
}
if (Meteor.isServer) {
  Meteor.methods({
    'cadastrarSala': function(local, num, ape,ocupacao) {
      Sala.insert({
        local: local,
        numero: num,
        apelido: ape,
        ocupacao:ocupacao
      })
    },
    'deletarSala': function(id) {
      var a = Sala.remove({
        _id: id
      })
    },
    'atualizarSala': function(id, local, num, ape,ocupacao) {
      Sala.update({
        _id: id
      }, {
        $set: {
          local: local,
          numero: num,
          apelido: ape,
          ocupacao:ocupacao
        }
      })
    }
  })
  Meteor.publish("sala", function() {
    return Sala.find();
  })
}
