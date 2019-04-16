import OfertaMateria from "../imports/collections/ofertaMateria";
import Tabular from 'meteor/aldeed:tabular';
import Area from '../imports/collections/area'
import Processo from "../imports/collections/processo";
import Semestre from "../imports/collections/semestre";
import Prefix from '../imports/prefix.js';
Router.route(Prefix+'/alocarProfessor', {
  template: 'alocarProfessor',
  name: 'alocarProfessor'
})
new Tabular.Table({
  name: "OfertaProfessor",
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
      data: "Professor.profile.name",
      title: "Professor",
      className: "mostrar",
      createdCell(cell, cellData, rowData, rowIndex, colIndex) {
        //$(cell).attr('id',rowData.Professor);
        if (rowData.Professor != "") {
          var f = OfertaMateria.find({
            Professor: rowData.Professor
          }).fetch();
          //console.log(f.length);
          var horas = parseInt(0)
          var aulas = parseInt(0)
          for (x = 0; x < f.length; x++) {
            //console.log(f[x].cargaHoraria);
            horas += parseInt(f[x].cargaHoraria);
            aulas += parseInt(f[x].aulaSemanal);
          }
          $(cell).attr('title', 'Aulas semanais: ' + aulas + '. Horas semestre: ' + horas)
        }
      },
    },
    {
      data: "Curso.nome",
      title: "Curso"
    },
    {
      data: "Semestre",
      title: "Semestre"
    }
  ],
  extraFields: [
    'Materia', 'Area', 'aulaSemanal', 'cargaHoraria', 'qtdeAuto', 'auto', 'Professor', 'Curso', 'Ofertantes'
  ],
  createdRow(row, data, dataIndex, cells) {
    $(row).attr('id', 'professor')
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


new Tabular.Table({
  name: "OfertaEscolha",
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
      data: "Area.nome",
      title: "Area"
    },
    {
      data: "Tipo",
      title: "Tipo"
    },
    {
      data: "aulaSemanal",
      title: "Aulas"
    },
    {
      data: "cargaHoraria",
      title: "Carga horária"
    },

  ],
  extraFields: [
    'Materia', 'Area', 'auto', 'Professor', 'Curso', 'Ofertantes'
  ],
  createdRow(row, data, dataIndex) {
    //console.log(row);
    $(row).attr('id', 'escolha')
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
OfertaMateria.helpers({
  nomeMateria: function() {
    var a = Materia.findOne({
      _id: this.Materia
    })

    if (this.auto == "") {
      return a.nomeMateria;
    } else {
      return 'Sub: ' + a.nomeMateria;
    }
  },
  nomeArea: function() {
    var c = Area.findOne({
      _id: this.Area
    })
    return c.nome;
  },
  aulas() {

    if (this.auto == "") {

      var a = Materia.findOne({
        _id: this.Materia
      })
      return a.aulaSemanal;
    } else {
      return this.aulaSemanal
    }
  },
  horas() {
    if (this.auto == "") {
      var a = Materia.findOne({
        _id: this.Materia
      })
      return a.cargaHoraria;
    } else {
      return this.cargaHoraria
    }
  },
  professorNome() {
    if (this.Professor != "") {
      var prof = Professor.findOne({
        _id: this.Professor
      });
      return prof.nome
    } else {
      return "";
    }
  },
  nomeCurso() {
    var curso = Curso.findOne({
      _id: this.Curso
    });
    return curso.nome
  }


})


if (Meteor.isClient) {
  Template.alocarProfessor.onCreated(function() {
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
      self.subscribe("buscaProfessores");
    })
  })
  Template.cadastroAlocarProfessor.onDestroyed(function() {
    Session.set('aux', false);
  })
  Template.cadastroAlocarProfessor.onCreated(function() {
    Session.set('setRowDataProfessor', "");
    Session.set('aux', false);
    Session.set('plus', 0);
  })
  Template.professorAuto.helpers({
    validarProf(prof) {
      return true;
      console.log(prof);
      if (prof.profile.permission == 1) {
        return true;
      } else {
        return false
      }
    }
  })
  Template.alocarProfessor.helpers({
    'permissao': function(valor) {
      if (valor.permission == 0) {
        return true;
      } else if(valor.permission==1 && valor.subFuncao==1) {
        return true;
      }else{
        Router.go('home')
        return false
      }
    },
  })
  Template.cadastroAlocarProfessor.helpers({


    mostrar() {
      var s = Session.get('aux');
      return Session.get('aux');
    },

    settingsProfessor: function() {
      //console.log(Meteor.users)
      return {
        position: Session.get("position"),
        limit: 10,
        rules: [{
          token: '',
          collection: Meteor.users,
          field: 'profile.name',
          template: Template.professorAuto,
          noMatchTemplate: Template.vazio
        }, ],

      }
    },
    settingsArea() {
      return {
        position: Session.get("position"),
        limit: 10,
        rules: [{
          token: '',
          collection: Area,
          field: 'nome',
          template: Template.areaAuto,
          noMatchTemplate: Template.vazio
        }],

      }
    },
    settingsCurso() {
      return {
        position: Session.get("position"),
        limit: 10,
        rules: [{
          token: '',
          collection: Curso,
          field: 'nome',
          template: Template.cursoAuto,
          noMatchTemplate: Template.vazio
        }],
      }
    },
    buscaArea() {
      var tmp = Area.find().fetch();
      return tmp
    },
    buscaCurso() {
      var tmp = Curso.find().fetch();
      return tmp
    },
    campos() {
      $('#valorTurma').text("");
      $('#valorMateria').text("");
      $("#semestreAlocar").val(1);
      $("#professor").val("");
      Session.set('areaSelecionada', "")
      $('#area').val("");
      $('#curso').val("")
      Session.set('cursoSelecionado', "");
      Session.set('plus', 0)

    },
    setRowDataProfessor: function() {
      var rowData = Session.get('setRowDataProfessor');
      $('#valorTurma').text(rowData.Turma);
      var m = rowData.Materia;
      //console.log(m)
      $('#valorMateria').text(m.nomeMateria);
      var prof = Session.get('professorSelecionado');
      if (prof != "") {
        $("#professor").val(prof.profile.name)
      }else{
        $("#professor").val("")
      }
      var area = rowData.Area;
      Session.set('areaSelecionada', area)
      $('#area').val(area._id);
      var curso = rowData.Curso
      $('#curso').val(curso._id)
      $("#semestreAlocar").val(rowData.Semestre)
      Session.set('cursoSelecionado', curso);
      Template.cadastroAlocarProfessor.__helpers.get('setCursoOfertantes').call()
    },
    tbodyNameOfertaEscolha: function() {
      var dt = $('tbody').DataTable();
      //console.log(dt);
    },
    plus() {
      var cont = Session.get('plus');
      var tmp = new Array(Session.get('plus'));
      for (x = 0; x < cont; x++) {
        tmp[x] = x
      }
      return tmp
    },
    getCursoOfertante() {
      var tmp = Session.get('plus');
      var array = new Array(tmp);
      for (x = 0; x < tmp; x++) {
        s = ('#cursoOferta' + x).toString();
        c = $(s).children().val();
        console.log(c);
        id = Curso.findOne({
          _id: c
        });
        s = ('#semestreOfertante' + x).toString();
        sem = $(s).val()
        array[x] = {
          curso: id,
          semestre: sem
        }
      }
      return array;
    },
    setCursoOfertantes() {
      var rowData = Session.get('setRowDataProfessor');
      //console.log(rowData)
      var ofertantes = rowData.Ofertantes;
      //console.log(ofertantes);
      if (ofertantes != null) {
        Session.set('plus', ofertantes.length)
        setTimeout(function() {
          if (ofertantes != null) {

            for (i = 0; i < ofertantes.length; i++) {
              if (ofertantes[i].curso != null) {
                s = ('#cursoOferta' + i).toString();
                c = $(s).children().val(ofertantes[i].curso._id);
                s = ('#semestreOfertante' + i).toString();
                sem = $(s).val(ofertantes[i].semestre)
              }
            }
          }
        }, 50)
      }
    }

  })
  Template.ListaDisciplinas.events({
    'click table >  tbody >tr': function(event, template) {
      event.preventDefault();
      var id = event.currentTarget.id;
      var dataTable = $(event.target).closest('table').DataTable();
      var rowData = dataTable.row(event.currentTarget).data();
      Session.set('setRowDataProfessor', rowData);
      if (id == "escolha") {
        Session.set('professorSelecionado', "");
        Template.cadastroAlocarProfessor.__helpers.get('setRowDataProfessor').call();
      } else if (id == "professor") {
        var prof = rowData.Professor;
        if (prof) {
          Session.set('professorSelecionado', prof);
        } else {
          Session.set('professorSelecionado', "");
        }
        Template.cadastroAlocarProfessor.__helpers.get('setRowDataProfessor').call();
      }
    }
  })
  Template.ListaOfertasProfessores.events({
    'click table >  tbody >tr': function(event, template) {
      event.preventDefault();
      var id = event.currentTarget.id;
      var dataTable = $(event.target).closest('table').DataTable();
      var rowData = dataTable.row(event.currentTarget).data();
      Session.set('setRowDataProfessor', rowData);
      if (id == "escolha") {
        Session.set('professorSelecionado', "");
        Template.cadastroAlocarProfessor.__helpers.get('setRowDataProfessor').call();
      } else if (id == "professor") {
        var prof = rowData.Professor;
        if (prof) {
          Session.set('professorSelecionado', prof);
        } else {
          Session.set('professorSelecionado', "");
        }
        Template.cadastroAlocarProfessor.__helpers.get('setRowDataProfessor').call();
      }
    }
  })
  Template.cadastroAlocarProfessor.events({

    "autocompleteselect #professor": function(event, template, doc) {
      event.preventDefault();
      Session.set('professorSelecionado', doc);
    },
    /*
    "autocompleteselect #area": function(event, template, doc) {
    	event.preventDefault();
    	Session.set('areaSelecionada',doc);
    },
    */
    'change #area': function(event) {
      event.preventDefault();
      var valor = $('#area').val();
      if (valor != "") {
        var tmp = Area.findOne({
          _id: valor
        })
        Session.set('areaSelecionada', tmp)
      }
    },
    'change #curso': function(event) {
      event.preventDefault();
      var valor = $('#curso').val();
      if (valor != "") {
        var tmp = Curso.findOne({
          _id: valor
        })
        Session.set('cursoSelecionado', tmp)
      }
    },

    /*
    "autocompleteselect #curso": function(event, template, doc) {
    	event.preventDefault();
    	Session.set('cursoSelecionado',doc);
    },
    */
    'submit form': function(event) {
      event.preventDefault();
      //console.log("submit")
      var a = $("#professor").val();
      var rowData = Session.get('setRowDataProfessor');
      //console.log(a);
      var professor;
      if (a != "") {
        professor = Session.get('professorSelecionado');
      } else {
        professor = ""
      }
      var b = $('#curso').val();
      var curso = ""
      if (b != "") {
        curso = Session.get('cursoSelecionado');
      }
      var c = $('#area').val()
      var area = "";
      if (c != "") {
        area = Session.get('areaSelecionada');
      }
      if (!rowData) {
        alert("Selecione uma matéria");
      } else if (!area) {
        alert("Selecione um Area");
      } else if (!curso) {
        alert("Selecione um Curso");
      } else {
        $('#erro').text("");
        var novaTurma
        var cursoOfertantes = Template.cadastroAlocarProfessor.__helpers.get('getCursoOfertante').call()
        var semestre = $('#semestreAlocar').val();
        if (rowData.Turma.length == 1) {
          novaTurma = curso.sigla + rowData.Turma;
          //console.log(novaTurma)
        } else if (rowData.Turma.length == 3) {
          novaTurma = curso.sigla +rowData.Turma[2]
        }
        console.log(novaTurma)
        Meteor.call('atualizarProfessorOferta', rowData, professor, area, curso, semestre, cursoOfertantes, novaTurma);
        Template.cadastroAlocarProfessor.__helpers.get('campos').call();
      }
    },

    'click #plus': function(event) {
      //console.log("plusss")
      event.preventDefault();
      var tmp = Session.get('plus');
      Session.set('plus', tmp + 1)
      //console.log(Session.get('plus'))
    },
    'click #less': function(event) {
      event.preventDefault();
      var tmp = Session.get('plus');
      if (tmp > 0) {
        Session.set('plus', tmp - 1)
      }
    }
  })

  Template.ListaDisciplinas.helpers({
     mostrar() {
      var s = Session.get('aux');
      return Session.get('aux');
    },
    selectEscolha: function() {
      var processo = Session.get('processoSelecionado');
      return {
        Processo: processo,
        /*Professor:"",*/ Curso: ""
      }
    },
  })

  Template.ListaOfertasProfessores.helpers({
     mostrar() {
      var s = Session.get('aux');
      return Session.get('aux');
    },
    selectProfessor: function() {
      var processo = Session.get('processoSelecionado');
      return {
        Processo: processo,
        Curso: {
          $ne: ""
        }
      }
    },
  })

  Template.ListaOfertasProfessores.events({
     'click #finalizar': function(event) {
      event.preventDefault();
      var oferta = OfertaMateria.findOne({
        Processo: Session.get('processoSelecionado'),
        Curso: ""
      })
      //console.log(oferta);
      if (oferta != null) {
        alert("Necessita alocar pelo menos curso em todas disciplinas")
      } else {
        Meteor.call('mudarEtapa', Session.get('processoSelecionado'), 2, function(e, r) {
          if (e) {

          } else {
            Bert.alert("Alocação de professor realizada com sucesso", 'default', 'growl-top-right', 'fa-bell')
            Session.set('processoSelecionado', "")
            Session.set("aux", false)
          }
        })
      }
    },
  })



}
if (Meteor.isServer) {
  Meteor.methods({
    'atualizarProfessorOferta': function(oferta, prof, area, curso, semestre, ofertantes, novaTurma) {
      OfertaMateria.update({
        _id: oferta._id
      }, {
        $set: {
          Professor: prof,
          Area: area,
          Curso: curso,
          Semestre: semestre,
          Ofertantes: ofertantes,
          Turma: novaTurma
        }
      })
    }
  })
}
