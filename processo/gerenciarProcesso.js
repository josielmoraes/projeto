import Prefix from '../imports/prefix.js';
Router.route(Prefix+'/gerenciarProcesso', {
  template: 'gerenciarProcesso',
  name: 'gerenciarProcesso'
})


if (Meteor.isClient) {
  Template.gerenciarProcesso.onCreated(function() {
    Session.set("aux", false)
      Session.set('processoSelecionado', "");
    $( document ).ready(function() {
     $(".nav-link").removeClass("active")
     $("#menu_gerenciar").addClass("active");
     });
   var self = this;
   self.autorun(function() {
     //self.subscribe("buscaOferta");
     self.subscribe("acharSemetre");
    self.subscribe("processo");
     self.subscribe("materia");
     self.subscribe("area");
   })
  })
    Template.gerenciarProcesso.onDestroyed(function() {
      Session.set("aux", false)
        Session.set('processoSelecionado', "");
    })
  Template.gerenciarProcesso.helpers({
    'permissao': function(valor) {
      console.log(valor)
      if (valor.permission == 0) {
        return true;
      }else{
        Router.go('home')
        return false
      }
    },
    mostrar() {
      //var s = Session.get('aux');
      return Session.get('aux');
    },
  })
  Template.barraGerenciar.helpers({

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
          $('#alocarAluno').addClass("center_vermelho");
          $('#alocarSala').addClass("center_vermelho");
        } else if (etapa == 1) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_amarelo");
          $('#confirmarProcesso').addClass("center_vermelho");
          $('#restricaoDisciplina').addClass("center_vermelho");
          $('#criarHorario').addClass("center_vermelho");
          $('#alocarAluno').addClass("center_vermelho");
          $('#alocarSala').addClass("center_vermelho");
        } else if (etapa == 2) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_verde");
          $('#confirmarProcesso').addClass("center_amarelo");
          $('#restricaoDisciplina').addClass("center_vermelho");
          $('#criarHorario').addClass("center_vermelho");
          $('#alocarAluno').addClass("center_vermelho");
          $('#alocarSala').addClass("center_vermelho");
        } else if (etapa == 3) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_verde");
          $('#confirmarProcesso').addClass("center_verde");
          $('#restricaoDisciplina').addClass("center_amarelo");
          $('#criarHorario').addClass("center_vermelho");
          $('#alocarAluno').addClass("center_vermelho");
          $('#alocarSala').addClass("center_vermelho");
        } else if (etapa == 4) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_verde");
          $('#confirmarProcesso').addClass("center_verde");
          $('#restricaoDisciplina').addClass("center_verde");
          $('#criarHorario').addClass("center_amarelo");
          $('#alocarAluno').addClass("center_vermelho");
          $('#alocarSala').addClass("center_vermelho");
        } else if (etapa == 5) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_verde");
          $('#confirmarProcesso').addClass("center_verde");
          $('#restricaoDisciplina').addClass("center_verde");
          $('#criarHorario').addClass("center_verde");
          $('#alocarAluno').addClass("center_amarelo");
          $('#alocarSala').addClass("center_vermelho");
        } else if (etapa == 6) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_verde");
          $('#confirmarProcesso').addClass("center_verde");
          $('#restricaoDisciplina').addClass("center_verde");
          $('#criarHorario').addClass("center_verde");
          $('#alocarAluno').addClass("center_verde");
          $('#alocarSala').addClass("center_amarelo");
        }else if (etapa == 7) {
          $('#definirDatas').addClass("center_verde");
          $('#solicitarDisciplina').addClass("center_verde");
          $('#alocarProfessor').addClass("center_verde");
          $('#confirmarProcesso').addClass("center_verde");
          $('#restricaoDisciplina').addClass("center_verde");
          $('#criarHorario').addClass("center_verde");
          $('#alocarAluno').addClass("center_verde");
          $('#alocarSala').addClass("center_verde");
        }

      }, 10)
    }
  })
    Template.barraGerenciar.events({
      'click .actionClick':async function(event){
        event.preventDefault();
        let id=event.currentTarget.id;
        let etapa=0
        let etapaTexto=""
        if(id=="solicitarDisciplina"){
          etapa=0
          etapaTexto="Solicitar Disciplina"
        }else if(id=="alocarProfessor"){
          etapa=1
          etapaTexto="Alocar Professor"
        }else if(id=="confirmarProcesso"){
          etapa=2
          etapaTexto="Confirma Processo"
        }else if(id=="restricaoDisciplina"){
          etapa=3
          etapaTexto="Restrição disciplina"
        }else if(id=="criarHorario"){
          etapa=4
          etapaTexto="Criar horário"
        }else if(id=="alocarAluno"){
          etapa=5
          etapaTexto="Alocar aluno"
        }else if(id=="alocarSala"){
          etapa=6
          etapaTexto="Alocar sala"
        }
        if(etapaTexto!=""){
          Meteor.call('mudarEtapa', Session.get("processoSelecionado"), etapa, function(e, r) {
            if (e) {

            } else {
              Session.set('aux', false);
              $("#processoSelecionado").val("");
              Session.set("processoSelecionado","");
              Bert.alert("Mudança para "+etapaTexto, 'default', 'growl-top-right', 'fa-bell')
            }
          })
        }

      }
    })
}
