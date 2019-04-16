import OfertaMateria from "../imports/collections/ofertaMateria";
import Processo from "../imports/collections/processo";
import Semestre from "../imports/collections/semestre";
import Prefix from '../imports/prefix.js';
import Tabular from 'meteor/aldeed:tabular';
Router.route(Prefix+'/alocarAluno', {
  template: 'alocarAluno',
  name: 'alocarAluno'
})
new Tabular.Table({
  name: "AlocarAluno",
  collection: OfertaMateria,
  columns: [{
      data: "Turma",
      title: "Turma"
    },
    {
      data: "Materia.nomeMateria",
      title: "Disciplina"
    },
    {
      data: "Curso.nome",
      title: "Curso"
    },
    {
      data: "Professor.profile.name",
      title: "Professor"
    },
    {
      data: "Tipo",
      title: "Tipo"
    },
    {
      data: "",
      defaultContent: '<input type="number" class="form-control numeroAluno" style="width:65px;" value="0" min="0" >'
    }
  ],
  extraFields: ["_id","alunos"],
  createdRow(row, data, dataIndex) {
    let list=$(row).children().toArray();
    let input=$(list[5]).children().toArray();
    $(input[0]).val(data.alunos);
  },
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
  },

})
if (Meteor.isClient) {
  Template.alocarAluno.onCreated(function(){
      var self = this;
      Session.set("processoSelecionadoMaior","")
    self.autorun(function() {
      self.subscribe("acharSemetre");
      self.subscribe("buscaProcesso");
      self.subscribe("materia");
      self.subscribe("area");
    })
  })
  Template.alocarAluno.onDestroyed(function(){
    Session.set("processoSelecionadoMaior","")
  })
Template.alocarAluno.helpers({
  permissao(valor){
    if (valor.permission == 0) {
      return true;
    } else if(valor.permission==1 && valor.subFuncao==1) {
      return true;
    }else{
      Router.go('home')
      return false
    }
  },
  mostrarTabela(){
    let pro=Session.get("processoSelecionadoMaior");
    console.log(pro);
    if(pro==""){
      return false;
    }else{
      return true;
    }
  },
  selector() {
    let pro=Session.get("processoSelecionadoMaior");
    return { Processo: pro };
  },
})
Template.alocarAluno.events({
  "change .numeroAluno":function(event){
    event.preventDefault();
    let num=event.target.value;//$(".numeroAluno").val();
    console.log(num);
    var dataTable = $(event.currentTarget.parentNode.parentNode).closest('table').DataTable();
    var rowData = dataTable.row(event.currentTarget.parentNode.parentNode).data();
    console.log(rowData)
    if(isNaN(num) || num===""){
        event.target.value=0
    }else if(num.includes("-")){
      event.target.value=0
    }else{

      Meteor.call("atualizarAlunos",rowData._id,parseInt(num))
    }
  },
  'click #finalizarAluno':function(event){
    event.preventDefault();
    Meteor.call('mudarEtapa', Session.get('processoSelecionadoMaior'), 6, function(e, r) {
      if (e) {

      } else {
        Session.set('aux', false);
        Session.set('processoSelecionadoMaior', "");
        Bert.alert("Alocação de aluno realizada com sucesso", 'default', 'growl-top-right', 'fa-bell')
      }
    })
  },
})
Template.buscaProcessoMaior.helpers({
  'buscaProcessos': function(e) {
    return Processo.find({
      etapas: Number(e)
    });
  },
  'buscaAnoSemestres': function(proc) {
    return proc.semestreSelecionado.anoLetivo + "/" + proc.semestreSelecionado.periodoLetivo
  },


})
Template.buscaProcessoMaior.events({
  'change #processoSelecionadoMaior':function(event){
    event.preventDefault();
    let pro=$("#processoSelecionadoMaior").val();
    Session.set("processoSelecionadoMaior",pro)
  }
})
}
if (Meteor.isServer) {
  Meteor.methods({

    'atualizarAlunos': function(id,qtde) {
      OfertaMateria.update({
        _id: id
      }, {
        $set: {
          alunos: qtde
        }
      })
    }

  })
}
