import Prefix from '../imports/prefix.js';
Router.route(Prefix+'/visualizarHorario', {
  template: 'visualizarHorario',
  name: 'visualizarHorario'
})

if (Meteor.isClient) {
  Template.visualizarHorario.onCreated(function() {
    $('body').addClass('bg-blue');
    Session.set('validarTemplate', 'tableHorario')
    var self = this;
    self.autorun(function() {
      self.subscribe("acharSemetre");
      self.subscribe("buscaProcesso");
      self.subscribe('curso');
      self.subscribe("buscaTodasOferta");
    })
    //Meteor.subscribe()
  })
  Template.visualizarHorario.onDestroyed(function() {
    $('body').removeClass('bg-dark')
    Session.set("aux", false)
    console.log(this);
  })
  Template.tableHorario.onCreated(function() {
    Session.set('validarTemplate', 'tableHorario')
    Session.set("aux", false)
  })
  Template.tableHorario.helpers({
    mostrar() {
      var s = Session.get('aux');
      return Session.get('aux');
    },
    mostrarTabela() {
      var curso = Session.get("cursoSelecionado");
      var sem = Session.get('periodoSelecionado');
      //console.log(curso)
      if (curso == "") {
        Session.set('sairOption', false)
        return false;
      } else {
        if (sem == "") {
          Session.set('sairOption', false)
          return false;
        } else {
          Session.set('sairOption', true)
          return true;
        }
      }
    },
  })
  Template.tableHorario.events({
    'change #semestre': function(event) {
      var tmp = $('#semestre').val();
      Session.set('periodoSelecionado', tmp)

    }
  })
  Template.barra.onCreated(function() {
    var self = this;
    self.autorun(function() {
      self.subscribe("acharSemetre");
      self.subscribe("buscaProcesso");
    })
    //Meteor.subscribe()
  })
  Template.barra.onDestroyed(function() {
    Session.set('aux', false);
  })

  Template.barra.helpers({
    mostrar() {
      var s = Session.get('aux');
      return Session.get('aux');
    },
    colorir() {
      setTimeout(function() {
        var processo = Session.get("processoSelecionado");
        console.log(processo)
        var tmp = Processo.findOne({
          _id: processo
        });
        var etapa = tmp.etapas;
        console.log(etapa)
        if (etapa == 0) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_amarelo");
          $('#alocarProfessor').addClass("center_vermelho");
          $('#confirmarProcesso').addClass("center_vermelho");
          $('#restricaoDisciplina').addClass("center_vermelho");
          $('#criarHorario').addClass("center_vermelho");
          $('#alocarSala').addClass("center_vermelho");
        } else if (etapa == 1) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_amarelo");
          $('#confirmarProcesso').addClass("center_vermelho");
          $('#restricaoDisciplina').addClass("center_vermelho");
          $('#criarHorario').addClass("center_vermelho");
          $('#alocarSala').addClass("center_vermelho");
        } else if (etapa == 2) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_verde");
          $('#confirmarProcesso').addClass("center_amarelo");
          $('#restricaoDisciplina').addClass("center_vermelho");
          $('#criarHorario').addClass("center_vermelho");
          $('#alocarSala').addClass("center_vermelho");
        } else if (etapa == 3) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_verde");
          $('#confirmarProcesso').addClass("center_verde");
          $('#restricaoDisciplina').addClass("center_amarelo");
          $('#criarHorario').addClass("center_vermelho");
          $('#alocarSala').addClass("center_vermelho");
        } else if (etapa == 4) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_verde");
          $('#confirmarProcesso').addClass("center_verde");
          $('#restricaoDisciplina').addClass("center_verde");
          $('#criarHorario').addClass("center_amarelo");
          $('#alocarSala').addClass("center_vermelho");
        } else if (etapa == 5) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_verde");
          $('#confirmarProcesso').addClass("center_verde");
          $('#restricaoDisciplina').addClass("center_verde");
          $('#criarHorario').addClass("center_verde");
          $('#alocarSala').addClass("center_amarelo");
        } else if (etapa == 6) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_verde");
          $('#confirmarProcesso').addClass("center_verde");
          $('#restricaoDisciplina').addClass("center_verde");
          $('#criarHorario').addClass("center_verde");
          $('#alocarSala').addClass("center_verde");
        }
      }, 10)
    }
  })
  Template.buscaTodosProcesso.helpers({
    'buscaProcessos': function() {
      return Processo.find();
    },
    'buscaAnoSemestres': function(proc) {
      var a = Semestre.findOne({
        _id: proc.semestreSelecionado
      });
      return a.anoLetivo + "/" + a.periodoLetivo
    },
  })
  Template.buscaTodosProcesso.events({
    'click #processoSelecionado': function(event) {
      var sem = $('#processoSelecionado').val();
      if (sem == "") {
        Session.set('aux', false);
      } else {
        Session.set('aux', true);
        Session.set('processoSelecionado', sem);
      }
    }
  })
}
