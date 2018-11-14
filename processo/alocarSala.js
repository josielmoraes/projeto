import OfertaMateria from "../imports/collections/ofertaMateria";
import Tabular from 'meteor/aldeed:tabular';

Router.route('/alocarSala', {
  template: 'alocarSala'
})



if (Meteor.isClient) {
  Template.alocarSala.onCreated(function() {
     $( document ).ready(function() {
      $(".nav-link").removeClass("active")
      $("#menu_horario").addClass("active");
      });
    var self = this;
    self.autorun(function() {
      self.subscribe("sala");
      self.subscribe("acharSemetre");
      self.subscribe("buscaProcesso");
      self.subscribe("area");
      self.subscribe("curso");
      self.subscribe("buscaTodasOferta");
      self.subscribe("usuarioProfessor");
    })
  })
  Template.alocarSala.onDestroyed(function() {
    Session.set('aux', false);
  })
  Template.alocarSala.helpers({
    'permissao': function(valor) {
      if (valor == 0) {
        return true;
      } else {
        Router.go('/')
        return false
      }
    },
  })
  Template.criarAlocarSala.onCreated(function() {
    Session.set('cursoSelecionado', "");
    Session.set('periodoSelecionado', "")
    Session.set('validarTemplate', 'criarAlocarSala')
  })
  Template.criarAlocarSala.helpers({
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
  Template.criarAlocarSala.events({
    'change #semestre': function(event) {
      var tmp = $('#semestre').val();
      Session.set('periodoSelecionado', tmp)

    },
    'click #finalizarSala':function(event){
      event.preventDefault();
      Meteor.call('mudarEtapa', Session.get('processoSelecionado'), 6, function(e, r) {
        if (e) {

        } else {
          Session.set('aux', false);
          Session.set('processoSelecionado', "");
          Bert.alert("Alocação de sala  realizada com sucesso", 'default', 'growl-top-right', 'fa-bell')
        }
      })
    },
  })
}
