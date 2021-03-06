import Tabular from 'meteor/aldeed:tabular';
import Processo from '/imports/collections/processo'
import Prefix from '../imports/prefix.js';
import Semestre from "/imports/collections/semestre";
import OfertaMateria from "/imports/collections/ofertaMateria";
Router.route(Prefix+'/Processo', {
  template: 'processo',
  name:'Processo'
})
new Tabular.Table({
  name: "Processo",
  collection: Processo,
  columns: [{
      data: "semestreLetivo()",
      title: "Semestre Letivo"
    },
    {
      data: "dataLimite",
      title: "Dt para oferta"
    },
    {
      data: "alocarProfessor",
      title: "Dt para alocar prof"
    },
    {
      data: "aprovarProcesso",
      title: "Dt para aprovar"
    },
    {
      data: "restricao",
      title: "Dt para restricao"
    },
    {
      data: "criarHorario",
      title: "Dt criar Horario"
    },
    {
      data: "alocarSala",
      title: "Dt para alocar sala"
    },
  ],
  extraFields: [
    'semestreSelecionado'
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
Processo.helpers({
  'semestreLetivo': function() {
    if(this.semestreSelecionado==""){
      return "";
    }else{
      return this.semestreSelecionado.anoLetivo + "/" + this.semestreSelecionado.periodoLetivo
    }
  }
})

if (Meteor.isClient) {
  Template.processo.onCreated(function(){
     $( document ).ready(function() {
      $(".nav-link").removeClass("active")
      $("#menu_horario").addClass("active");
      });
  })
  Template.processo.onDestroyed(function() {
    Session.set('aux', false);
    var tmp = Session.get("subSemestre");
    //Meteor.unsubscribe("acharSemetre");
  })
  Template.processo.onCreated(function() {
  var self = this;
    var tmp = Meteor.subscribe("acharSemetre")
    self.autorun(function() {
      self.subscribe("acharOfertas")
      self.subscribe("processo")
      self.subscribe("acharSemetre")
    })
  })
  Template.processo.helpers({
    'permissao': function(valor) {
      if (valor == 0) {
        return true;
      } else {
        Router.go('home')
        return false
      }
    },
  })
  Template.buscaSemestre.helpers({
    'buscaTodosSemestres': function() {
      //var x=Meteor.subscribe("acharSemetre")
      var x = Semestre.find({}).fetch()
      //console.log(x)
      return x;
      //const semestre= Meteor.subscribe('semestre')
      //return Meteor.call('semestre');
    },
  })

  Template.cadastroProcesso.helpers({
    campos: function() {
      $('#dataLimite').val("");
      $('#alocarProfessor').val("");
      $('#aprovarProcesso').val("");
      $('#criarHorario').val("");
      $('#semestreSelecionado').prop('selectedIndex', 0);
      $('#cadastrar').val("Cadastrar");
      $('#deletar').val("Voltar");
      $('#restricao').val(""),
        $('#alocarSala').val("");
        $('#deletar').addClass("btn-success");
        $('#deletar').removeClass("btn-danger");
      $('#formCadastroProcesso').validate().resetForm();
    },
    validarProcesso: function() {
      var sair = false;
      //validar pro mesmo numero de processo

      //obrigar selecionar semestre
      var drop = $('#semestreSelecionado').prop('value');
      if (drop == "") {
        var StringSem = "Campo obrigatório";
        //console.log(StringSem)
        sair = false;
      } else {
        sair = true;
      }
      arrayAux = Processo.find().fetch();
      for (x = 0; x < arrayAux; x++) {
        if (OfertaMateria.findOne({
            Processo: arrayAux[x]._id
          })) {
          var StringErro = "Processo iniciado"
          sair = false
        } else {
          sair = true;
        }
      }

      $('#formCadastroProcesso').validate().showErrors({
        semestreSelecionado: StringSem,
        erro: StringErro
      })
      return sair

    },
    validarDeletar: function() {
      var id = Session.get('processoTable')
      var sair;
      var ofertas=OfertaMateria.findOne({
          Processo: id._id
        })
      console.log(ofertas)
      if (ofertas!==undefined) {
        //console.log("entrou");
        var StringErro = "Processo iniciado"
        sair = false
      } else {
        sair = true;
      }
      //console.log(StringErro)
      $('#formCadastroProcesso').validate().showErrors({
        erro: StringErro
      })
      return sair;
    },

  })
  Template.cadastroProcesso.events({
    'click .input': function(event) {
      event.preventDefault();
      var id = $(event.target).prop('id');
      if (id == "cadastrar") {
        Session.set('num', '');
        var evento = $("#cadastrar").val();
        var semestre=Semestre.findOne({_id:$('#semestreSelecionado').val()});
        var dados = {
          dataLimite: $('#dataLimite').val(),
          alocarProfessor: $('#alocarProfessor').val(),
          aprovarProcesso: $('#aprovarProcesso').val(),
          criarHorario: $('#criarHorario').val(),
          semestreSelecionado: semestre,
          etapas: 0,
          restricao: $('#restricao').val(),
          alocarSala: $('#alocarSala').val()
        }
        var validar = $('#formCadastroProcesso').valid();
        Session.set('num', dados.numeroProcesso);
        validar = Template.cadastroProcesso.__helpers.get('validarProcesso').call();
        if (evento == "Cadastrar" && validar) {
          Meteor.call('cadastrarProcesso', dados);
          Template.cadastroProcesso.__helpers.get('campos').call();
        } else if (evento == "Atualizar" && validar) {
          var id = Session.get('processoTable');

          Meteor.call('atualizarProcesso', id._id, dados)
          Template.cadastroProcesso.__helpers.get('campos').call();
        }
      } else if (id == "deletar") {
        var evento = $('#deletar').val();
        if (evento == "Voltar") {
          Router.go('home');
        } else if (evento == "Deletar") {
          var id = Session.get('processoTable');
          var v = Template.cadastroProcesso.__helpers.get('validarDeletar').call();
          if (v) {
            Meteor.call('deletarProcesso', id._id);
            Template.cadastroProcesso.__helpers.get('campos').call();
          }
        }
      } else if (id == "limpar") {
        Template.cadastroProcesso.__helpers.get('campos').call();
      }
    },
    'click tbody > tr': function(event, template) {
      var dataTable = $(event.target).closest('table').DataTable();
      var rowData = dataTable.row(event.currentTarget).data();
      $('#dataLimite').val(rowData.dataLimite);
      $('#alocarProfessor').val(rowData.alocarProfessor);
      $('#aprovarProcesso').val(rowData.aprovarProcesso);
      $('#criarHorario').val(rowData.alocarProfessor);
      $('#semestreSelecionado').val(rowData.semestreSelecionado._id);
      $('#restricao').val(rowData.restricao);
      $('#alocarSala').val(rowData.alocarSala);
      $('#cadastrar').val("Atualizar");
      $('#deletar').val("Deletar");
      $('#deletar').addClass("btn-danger");
      $('#deletar').removeClass("btn-success");
      Session.set('processoTable', rowData);
    }
  });
  Template.cadastroProcesso.onRendered(function() {
    $('#formCadastroProcesso').validate({
      rules: {
        dataLimite: {
          required: true
        },
        alocarProfessor: {
          required: true
        },
        numeroProcesso: {
          required: true
        },
        aprovarProcesso: {
          required: true
        },
        criarHorario: {
          required: true
        },
      },
      messages: {
        dataLimite: {
          required: "Campo obrigatório"
        },
        alocarProfessor: {
          required: "Campo obrigatório"
        },
        numeroProcesso: {
          required: "Campo obrigatório"
        },
        aprovarProcesso: {
          required: "Campo obrigatório"
        },
        criarHorario: {
          required: "Campo obrigatório"
        },
      },

    })
  });

}

if (Meteor.isServer) {
  Meteor.methods({
    'cadastrarProcesso': function(dadoProcesso) {
      Processo.insert({
        dataLimite: dadoProcesso.dataLimite,
        alocarProfessor: dadoProcesso.alocarProfessor,
        aprovarProcesso: dadoProcesso.aprovarProcesso,
        criarHorario: dadoProcesso.criarHorario,
        semestreSelecionado: dadoProcesso.semestreSelecionado,
        etapas: 0,
        restricao: dadoProcesso.restricao,
        alocarSala: dadoProcesso.alocarSala,
      })
    },
    'atualizarProcesso': function(id, dadoProcesso) {
      Processo.update({
        _id: id
      }, {
        $set: {
          numeroProcesso: dadoProcesso.numeroProcesso,
          dataLimite: dadoProcesso.dataLimite,
          alocarProfessor: dadoProcesso.alocarProfessor,
          aprovarProcesso: dadoProcesso.aprovarProcesso,
          criarHorario: dadoProcesso.criarHorario,
          semestreSelecionado: dadoProcesso.semestreSelecionado,
          restricao: dadoProcesso.restricao,
          alocarSala: dadoProcesso.alocarSala,
        }
      })
    },
    'deletarProcesso': function(id) {
      Processo.remove({
        _id: id
      })
    },

  })
  Meteor.publish("acharSemetre", function() {
    return Semestre.find();
  })
  Meteor.publish("acharOfertas", function() {
    return OfertaMateria.find();
  })

}
