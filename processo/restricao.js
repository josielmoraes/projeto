import OfertaMateria from "../imports/collections/ofertaMateria";
import Tabular from 'meteor/aldeed:tabular';
import Prefix from '../imports/prefix.js';
Router.route(Prefix+'/restricaoDisciplina', {
  template: 'restricao',
  name:"restricaoDisciplina"
})

new Tabular.Table({
  name: "OfertaRestricao",
  collection: OfertaMateria,
  columns: [{
      data: "Turma",
      title: "Turma"
    },
    {
      data: "Materia.nomeMateria",
      title: "Disciplina"
    },
  ],
  responsive: true,
  autoWidth: false,
  createdRow(row, data, dataIndex) {
    $(row).attr('class', 'restricaoTurma')
  },
  extraFields: [
    'restricao'
  ],
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
  },
})

new Tabular.Table({
  name: "OfertaRestricao2",
  collection: OfertaMateria,
  columns: [{
      data: "",
      title: " ",
      defaultContent: '<input class="checkBox" type="checkbox">'
    },
    {
      data: "Turma",
      title: "Turma"
    },
    {
      data: "Materia.nomeMateria",
      title: "Disciplina"
    },
  ],
  extraFields: [
    'restricao'
  ],
  searching: false,
  paging: false,
  responsive: true,
  autoWidth: false,
  createdRow(row, data, dataIndex, cells) {
    var tmp = Session.get('turmaSelecionada');
    if (tmp.restricao != null) {
      for (x = 0; x < tmp.restricao.length; x++) {
        if (data._id == tmp.restricao[x]) {
          var t = row.firstChild.firstChild
          //console.log(t);
          $(t).prop('checked', true);
          $(row).css('color', 'red');
        }
      }
    }

  },
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
  },
})


if (Meteor.isClient) {
  Template.restricao.onCreated(function() {
     $( document ).ready(function() {
      $(".nav-link").removeClass("active")
      $("#menu_horario").addClass("active");
      });
    var self = this;
    self.autorun(function() {
      self.subscribe("buscaProcesso");
      self.subscribe("acharSemetre");
      self.subscribe("area");
      self.subscribe("curso");
      self.subscribe("usuarioProfessor");
    })
  })
  Template.restricao.onDestroyed(function() {
    Session.set('aux', false);
  })
  Template.restricao.helpers({
    'permissao': function(valor) {
      if (valor == 0) {
        return true;
      } else {
        Router.go('home')
        return false
      }
    },
  })
  Template.restricaoTurma.onCreated(function() {
    Session.set('mostrarRestricao', false);
    Session.set('turmaSelecionada', "");
    Session.set('rgba', "a")
  })
  Template.restricaoTurma.onDestroyed(function() {
    //console.log("entrou")
    Session.set('aux', false);
  })
  Template.restricaoTurma.helpers({
    settingsTurma: function() {
      return {
        position: Session.get("position"),
        limit: 10,
        rules: [{
          token: '',
          collection: OfertaMateria,
          field: 'nome',
          template: Template.turmaAuto,
          noMatchTemplate: Template.vazio
        }, ],
      }
    },
    selectTurmaEscolha: function() {
      var processo = Session.get('processoSelecionado');
      return {
        Processo: processo
      }
    },
    selectTurmaEscolha2: function() {
      var processo = Session.get('processoSelecionado');
      var id = Session.get('turmaSelecionada');
      return {
        Processo: processo,
        _id: {
          $ne: id._id
        }
      }
    },
    mostrar() {
      var s = Session.get('aux');
      return Session.get('aux');
    },
    turma() {
      if (Session.get('mostrarRestricao')) {
        return true;
      } else {
        return false;
      }
    }
  })
  Template.restricaoTurma.events({
    'click #finalizarRestricao':function(event){
      event.preventDefault();
      Meteor.call('mudarEtapa', Session.get('processoSelecionado'), 4, function(e, r) {
        if (e) {

        } else {
          Session.set('aux', false);
          Session.set('processoSelecionado', "");
          Bert.alert("Restrição realizada com sucesso", 'default', 'growl-top-right', 'fa-bell')
        }
      })
    },
    'click .restricaoTurma': function(event, template) {
      event.preventDefault();
      var r = Session.get('rgba');
      if (r != "a") {
        var st = document.getElementById('temp');
        $(st).css('background-color', r);
        Session.set('rgba', "a")
        $(st).attr('id', '')
      }
      var t = event.currentTarget
      var dataTable = $(t).closest('table').DataTable();
      var style = window.getComputedStyle(t, null).getPropertyValue("background-color")
      Session.set('rgba', style)
      $(t).css('background-color', 'gray')
      $(t).attr('id', 'temp')
      var rowData = dataTable.row(t).data();
      //console.log(rowData	)
      Session.set('mostrarRestricao', true);
      Session.set('turmaSelecionada', rowData)
    },
    'change .checkBox': function(event) {
      event.preventDefault();
      var temp = $(event.target).is(":checked")
      var element = event.target.parentElement.parentElement
      if (temp) {
        $(event.target).attr('checked', true)
        $(element).css('color', 'red');
      } else {
        $(event.target).attr('checked', false)
        $(element).css('color', 'rgb(51, 51, 51)');
      }
    },
    'click #restringir': function(event) {
      event.preventDefault();
      //console.log("teste")
      var array = new Array;
      var cont = 0;
      var table = $("#OfertaRestricaoSelect2").DataTable();
      table.rows().nodes().each(function(val, i) {
        var tmp = val.cells[0].firstChild;
        if ($(tmp).is(":checked")) {
          array[cont] = table.row(i).data();
          cont++
        }
      })
      var id = Session.get('turmaSelecionada');
      Meteor.call('retirar', id._id, id.restricao)
      Meteor.call('restrigir', id._id, array, function(e, r) {
        if (e) {
          //console.log(e)
        } else {
          var r = Session.get('rgba');
          var st = document.getElementById('temp');
          $(st).css('background-color', r);
          Session.set('rgba', "a")
          $(st).attr('id', '')
        }
      })
      for (x = 0; x < array.length; x++) {
        Meteor.call('resgtrigirUnico', array[x]._id, id._id)
      }
      Bert.alert("Restrição realizada", 'default', 'growl-top-right', 'fa-bell')

      Session.set('mostrarRestricao', false)
    },
  })
}
if (Meteor.isServer) {
  Meteor.methods({
    'retirar': function(id, array) {
      for (x = 0; x < array.length; x++) {
        OfertaMateria.update({
          _id: id
        }, {
          $pull: {
            restricao: array[x].toString()
          }
        })
        OfertaMateria.update({
          _id: array[x].toString()
        }, {
          $pull: {
            restricao: id
          }
        })
      }
    },
    'restrigir': function(id, array) {
      var idArray = new Array();
      for (x = 0; x < array.length; x++) {
        idArray[x] = array[x]._id;
      }

      OfertaMateria.update({
        _id: id
      }, {
        $set: {
          restricao: idArray
        }
      })
    },
    'resgtrigirUnico': function(id, res, array) {
      //console.log(array);
      OfertaMateria.update({
        _id: id
      }, {
        $addToSet: {
          restricao: res
        }
      })
    }
  })
}
