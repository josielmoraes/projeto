import OfertaMateria from "../imports/collections/ofertaMateria";
import Tabular from 'meteor/aldeed:tabular';
import Prefix from '../imports/prefix.js';
Router.route(Prefix+'/alocarSala', {
  template: 'alocarSala',
  name: 'alocarSala'
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
        Router.go('home')
        return false
      }
    },
  })
  Template.criarAlocarSala.onCreated(function() {
    Session.set('cursoSelecionado', "");
    Session.set('periodoSelecionado', "")
    Session.set('aux',false);
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
      Meteor.call('mudarEtapa', Session.get('processoSelecionado'), 7, function(e, r) {
        if (e) {

        } else {
          Session.set('aux', false);
          Session.set('processoSelecionado', "");
          Bert.alert("Alocação de sala  realizada com sucesso", 'default', 'growl-top-right', 'fa-bell')
        }
      })
    },
    "click #alocarDinamico":function(event){
      event.preventDefault();
      console.log("event")
      Meteor.call("alocarSalaDinamicamente",Session.get("processoSelecionado"),function(e,r){
        if(e){
           console.log(e)
        }else{
          console.log(r);
          //  Bert.alert(r, 'danger', 'growl-top-right');
            Bert.alert({
            message: r,
            type: 'danger',
            style: 'growl-top-right',
             hideDelay: 10000,
          });
        }

      })
    }
  })
}
if(Meteor.isServer){
  Meteor.methods({
    'limparSala':function(id,dia,aula){
      OfertaMateria.update({
        _id:id,
        horario: {
          $elemMatch: {
            dia: dia,
            aula: aula
          }
        }
      },
      {$set:{'horario.$.sala':""}})
    },
    "alocarSalaDinamicamente":function(pro){
      console.log("inicio alocar");
      let todasOfertas=OfertaMateria.find(
        {Processo:  pro},
        { sort : { alunos: -1 } }
      ).fetch();
      let todaSala=Sala.find({},{sort:{ocupacao:-1}}).fetch();
      var string="Verificar as disciplinas: ";
      var ofertasSem=[];
      let semSala=true;
      for(var x in todasOfertas){
        let horario=todasOfertas[x].horario;
        semSala=true;
        if(horario.length>0){
          for(var y in horario){
            let dia=horario[y].dia;
            let aula=horario[y].aula;
            let sair=true;
            let index=0;

            Meteor.call("limparSala",todasOfertas[x]._id,dia,aula);
            while(sair && index<todaSala.length){
              let sala=todaSala[index];
              //if(sala==""){
                var tmp = OfertaMateria.findOne({
                  Processo: pro,
                  horario: {
                    $elemMatch: {
                      dia: dia,
                      aula: aula,
                      'sala._id': sala._id
                    }
                  }
                })
                if(typeof tmp=== "undefined"){
                  if(sala.ocupacao>=todasOfertas[x].alunos){
                    Meteor.call('alocarSala', todasOfertas[x]._id, dia, aula, sala._id);
                  }else{
                  sair=false;
                  }
                }
              //}
              index++;
            }
            if(!sair){
              semSala=false;
            }
          }
        }
        console.log(semSala);
        if(!semSala){
          //console.log("aqui");
          string+=todasOfertas[x].Materia.nomeMateria+' ('+todasOfertas[x].Curso.nome+'), ';
        }
      }
      return string;
    }
  })
}
