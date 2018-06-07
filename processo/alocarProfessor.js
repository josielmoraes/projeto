import OfertaMateria from "../imports/collections/ofertaMateria";
import Tabular from 'meteor/aldeed:tabular';

Router.route('/alocarProfessor',{
	template:'alocarProfessor'
})

new Tabular.Table({
  name: "OfertaProfessor",
  collection: OfertaMateria,
  columns: [
  	{data:"Turma", title:"Turma"},
  	{data:"Materia.nomeMateria", title:"Materia"},
  	{data:"Professor.nome", title:"Professor", className:"mostrar",
	  	createdCell( cell, cellData, rowData, rowIndex, colIndex ){
	  		//$(cell).attr('id',rowData.Professor);
	  		if(rowData.Professor!=""){
		  		var f=OfertaMateria.find({Professor:rowData.Professor}).fetch();
		  		console.log(f.length);
		  		var horas=parseInt(0)
		  		var aulas=parseInt(0)
		  		for(x=0;x<f.length;x++){
		  			console.log(f[x].cargaHoraria);
		  			horas+=parseInt(f[x].cargaHoraria);
		  			aulas+=parseInt(f[x].aulaSemanal);
		  		}
		  		$(cell).attr('title', 'Aulas: '+aulas+' horas semestre: '+horas)
		  	}
	  	},
	  },
  	{data:"Curso.nome", title:"Curso"}
    ],
    extraFields:[
    	'Materia','Area','aulaSemanal','cargaHoraria','qtdeAuto','auto','Professor','Curso'
    ],
    createdRow( row, data, dataIndex,cells) {
    	$(row).attr('id', 'professor')
  	},



	responsive: true,
	autoWidth: false,
	language:{
			"decimal":        "",
		    "emptyTable":     "Nao há dados disponível",
		    "info":           "Mostrando de _START_ a _END_ de _TOTAL_ registros",
		    "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
		    "infoFiltered":   "(filtrado um total de  _MAX_  registros)",
		    "infoPostFix":    "",
		    "thousands":      ",",
		    "lengthMenu":     "Exibindo _MENU_ registros por página",
		    "loadingRecords": "Carregando...",
		    "processing":     "Processando...",
		    "search":         "Procurar:",
		    "zeroRecords":    "Não encontrado nenhum registro",
		    "paginate": {
		        "first":      "Primeira",
		        "last":       "Última",
		        "next":       "Próxima",
		        "previous":   "Anterior"
		    },
	},

  })


new Tabular.Table({
  name: "OfertaEscolha",
  collection: OfertaMateria,
  columns: [
  	{data:"Turma", title:"Turma"},
  	{data:"Materia.nomeMateria", title:"Materia"},
  	{data:"Tipo", title:"Tipo"},
  	{data:"aulaSemanal", title:"Aulas"},
  	{data:"cargaHoraria", title: "Carga horária"},
    ],
    extraFields:[
    	'Materia','Area','auto','Professor','Curso'
    ],
    tbody:'teste',
  	 createdRow( row, data, dataIndex ) {
    	console.log(row);
    	$(row).attr('id', 'escolha')
  	},
	responsive: true,
	autoWidth: false,
	language:{
			"decimal":        "",
		    "emptyTable":     "Nao há dados disponível",
		    "info":           "Mostrando de _START_ a _END_ de _TOTAL_ registros",
		    "infoEmpty":      "Mostrando 0 a 0 de 0 registros",
		    "infoFiltered":   "(filtrado um total de  _MAX_  registros)",
		    "infoPostFix":    "",
		    "thousands":      ",",
		    "lengthMenu":     "Exibindo _MENU_ registros por página",
		    "loadingRecords": "Carregando...",
		    "processing":     "Processando...",
		    "search":         "Procurar:",
		    "zeroRecords":    "Não encontrado nenhum registro",
		    "paginate": {
		        "first":      "Primeira",
		        "last":       "Última",
		        "next":       "Próxima",
		        "previous":   "Anterior"
		    },
	},

  })
OfertaMateria.helpers({
	nomeMateria:function(){
		var a=Materia.findOne({_id:this.Materia})

		if(this.auto==""){
			return a.nomeMateria;
		}else{
			return 'Sub: '+a.nomeMateria;
		}
	},
	nomeArea:function(){
			var c= Area.findOne({_id:this.Area})
			return c.nome;
	},
	aulas(){

		if(this.auto==""){

			var a=Materia.findOne({_id:this.Materia})
			return a.aulaSemanal;
		}else{
			return this.aulaSemanal
		}
	},
	horas(){
		if(this.auto==""){
			var a=Materia.findOne({_id:this.Materia})
			return a.cargaHoraria;
		}else{
			return this.cargaHoraria
		}
	},
	professorNome(){
		if(this.Professor!=""){
			var prof=Professor.findOne({_id:this.Professor});
			return prof.nome
		}else{
			return "";
		}
	},
	nomeCurso(){
		var curso=Curso.findOne({_id:this.Curso});
		return curso.nome
	}


})


if(Meteor.isClient){

	Template.cadastroAlocarProfessor.onCreated(function(){
		 Session.set('setRowDataProfessor',"");
	})
	Template.cadastroAlocarProfessor.helpers({
		selectEscolha:function(){
  			var processo= Session.get('processoSelecionado');
  			return {Processo:processo, /*Professor:"",*/Curso:""}
  		},
  		selectProfessor:function(){
  			var processo= Session.get('processoSelecionado');
  			return {Processo:processo,Curso:{$ne:""}}
  		},
  		mostrar(){
  			var s=Session.get('aux');
  			console.log("mo "+s)
			return Session.get('aux');
  		},

		settingsProfessor: function() {
		    return {
		      position: Session.get("position"),
		      limit: 10,
		      rules: [
		        {
		          token: '',
		          collection: Professor,
		          field: 'nome',
		          template: Template.professorAuto,
		          noMatchTemplate:Template.vazio
		        },
		      ],

		    }
  		},
  		settingsArea() {
		    return {
		      position: Session.get("position"),
		      limit: 10,
		      rules: [
		        {
		          token: '',
		          collection: Area,
		          field: 'nome',
		          template: Template.areaAuto,
		          noMatchTemplate:Template.vazio
		        }
		      ],

		    }
  		},
  		settingsCurso() {
		    return {
		      position: Session.get("position"),
		      limit: 10,
		      rules: [
		        {
		          token: '',
		          collection: Curso,
		          field: 'nome',
		          template: Template.cursoAuto,
		          noMatchTemplate:Template.vazio
		        }
		      ],
		    }
  		},
  		campos(){
  			$('#valorTurma').text("");
  			$('#valorMateria').text("");
  			$("#professor").val("");
  			Session.set('areaSelecionada',"")
  			$('#area').val("");
  			$('#curso').val("")
  			Session.set('cursoSelecionado',"");


  		},
  		setRowDataProfessor:function(){
  			var rowData=Session.get('setRowDataProfessor');
  			$('#valorTurma').text(rowData.Turma);
  			var m= Materia.findOne({_id:rowData.Materia});
  			$('#valorMateria').text(rowData.nomeMateria);
  			var prof=Session.get('professorSelecionado');
  			$("#professor").val(prof.nome)
  			var area=rowData.Area;
  			Session.set('areaSelecionada',area)
  			$('#area').val(area.nome);
  			var curso=rowData.Curso
  			$('#curso').val(curso.nome)
  			Session.set('cursoSelecionado',curso);
  		},
  		tbodyNameOfertaEscolha:function() {
  			var dt=$('tbody').DataTable();
  			console.log(dt);
  		}
  	})
  	Template.cadastroAlocarProfessor.events({
  		'click table >  tbody >tr': function (event,template) {
		  	event.preventDefault();
		  	var id=event.currentTarget.id;
		  	var dataTable = $(event.target).closest('table').DataTable();
		    var rowData = dataTable.row(event.currentTarget).data();
		    Session.set('setRowDataProfessor',rowData);
		  	if(id=="escolha"){
		    	Session.set('professorSelecionado',"");
		    	Template.cadastroAlocarProfessor.__helpers.get('setRowDataProfessor').call();
			}else if(id=="professor"){
				var prof=rowData.Professor;
				if(prof){
					Session.set('professorSelecionado',prof);
				}else{
					Session.set('professorSelecionado',"");
				}
		    	Template.cadastroAlocarProfessor.__helpers.get('setRowDataProfessor').call();
			}
		},

		"autocompleteselect #professor": function(event, template, doc) {
		  	event.preventDefault();
		  	Session.set('professorSelecionado',doc);
		 },
		 "autocompleteselect #area": function(event, template, doc) {
		  	event.preventDefault();
		  	Session.set('areaSelecionada',doc);
		 },
		 "autocompleteselect #curso": function(event, template, doc) {
		  	event.preventDefault();
		  	Session.set('cursoSelecionado',doc);
		 },
		 'submit form':function(event){
		 	event.preventDefault();
		 	console.log("submit")
		 	var a=$("#professor").val();
		 	var rowData=Session.get('setRowDataProfessor');
		 	console.log(a);
		 	var professor;
		 	if(a!=""){
		 		professor=Session.get('professorSelecionado');
		 	}else{
		 		professor=""
		 	}
		 	var b=$('#curso').val();
		 	var curso=""
		 	if(b!=""){
		 	 curso=Session.get('cursoSelecionado');
		 	}
		 	var c= $('#area').val()
		 	var area="";
		 	if(c!=""){
		 		area=Session.get('areaSelecionada');
		 	}
			 	if(!rowData){
			 		alert("Selecione uma matéria");
			 	}else if(!area){
			 		alert("Selecione um Area");
			 	}else if(!curso){
			 		alert("Selecione um Curso");
			 	}else{
			 		$('#erro').text("");
			 		console.log(professor);
			 		console.log(rowData);
			 		if(professor==""){
			 			Meteor.call('atualizarProfessorOferta',rowData,professor,area,curso);
			 		}else{
			 			Meteor.call('atualizarProfessorOferta',rowData,professor,area,curso);
			 		}
			 		Template.cadastroAlocarProfessor.__helpers.get('campos').call();
			 	}
		 },
		 'click #finalizar':function(event){
		 	event.preventDefault();
		 	var oferta=OfertaMateria.findOne({Processo:Session.get('processoSelecionado'),  Curso:""})
		 	console.log(oferta);
		 	if(oferta!=null){
		 		alert("Necessita alocar pelo menos curso em todas disciplinas todas as disciplinas")
		 	}else{
		 		Meteor.call('mudarEtapa',Session.get('processoSelecionado'),2,function(e,r){
		 			if(e){

		 			}else{
		 				alert("Alocação realizada com sucesso");
		 				Session.set('processoSelecionado',"")
		 				Session.set("aux",false)
		 			}
		 		})


		 	}
		 }
  	})

}
if(Meteor.isServer){
	Meteor.methods({
		'atualizarProfessorOferta':function(oferta,prof,area,curso){
			OfertaMateria.update({_id:oferta._id},{$set:{Professor:prof,Area:area,Curso:curso}})
		}
	})
}
