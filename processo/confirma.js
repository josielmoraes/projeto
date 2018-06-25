import OfertaMateria from "../imports/collections/ofertaMateria";
import Tabular from 'meteor/aldeed:tabular';
import Professor from '/imports/collections/professor'

Router.route('/confirmarProcesso',{
	template:'confirmarProcesso'
})
new Tabular.Table({

    name: "OfertaConfirmarProfessor",
	  collection: OfertaMateria,
		order:[[0,'asc']],
   	columns: [
			{data:"Professor.profile.name", title:"Professor", className:"mostrar", visible:false },
			{data:"Materia.nomeMateria", title:"Materia",orderable: false},
			{data:"Turma", title:"Turma",orderable: false},
			{data:"sub()", title:"SubTurma", orderable:false},
			{data:"Curso.nome", title:"Curso",orderable: false},
			{data:"aulaSemanal", title:'Aulas',orderable: false},
			{data:"cargaHoraria", title:'C.H.',orderable: false},
		],
		extraFields:[
			'qtdeAuto','auto','Area'
		],

        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;

            api.column(0, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(

                        '<tr id="group"><td colspan="7">'+group+'</td></tr>'
                    );
                    last = group;
                }
					})
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
	    name: "OfertaConfirmarArea",
		  collection: OfertaMateria,
			order:[[0,'asc']],
	   	columns: [
				{data:"Area.nome", title:"Area",className:"mostrar", visible:false},
				{data:"Materia.nomeMateria", title:"Materia",orderable: false},
				{data:"Turma", title:"Turma",orderable:false },
				{data:"sub()", title:"SubTurma", orderable:false},
				{data:"Curso.nome", title:"Curso",orderable: false},
				{data:"Professor.nome", title:"Professor", orderable: false},
				{data:"aulaSemanal", title:'Aulas',orderable: false},
				{data:"cargaHoraria", title:'C.H.',orderable: false},
			],
			extraFields:[
				'qtdeAuto','auto','Area'
			],

	        "drawCallback": function ( settings ) {
	            var api = this.api();
	            var rows = api.rows( {page:'current'} ).nodes();
	            var last=null;

	            api.column(0, {page:'current'} ).data().each( function ( group, i ) {
	                if ( last !== group ) {
	                    $(rows).eq( i ).before(

	                        '<tr id="group"><td colspan="7">'+group+'</td></tr>'
	                    );
	                    last = group;
	                }
						})

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
	sub(){
		if(this.auto==""){
			return 'Não'
		}else{
			return 'Sim'
		}
	}
})

if(Meteor.isClient){
	Template.confirmarProcesso.helpers({
			'permissao':function(valor){
				if(valor==0){
					return true;
				}else {
						Router.go('/')
						return false
					}
			},
		})
	Template.confirmar.onCreated(function(){
		Session.set('mostrarArear',false)
		Session.set('mostrarProfessor',false)
		Session.set('mostrarForm',false);
		Session.set('aux',false);
	})
	Template.confirmar.helpers({
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
		selectProfessor:function(){
  			var processo= Session.get('processoSelecionado');
				console.log('select pro ',processo)
  			return {Processo:processo}
  		},
		mostrar(){
  			var s=Session.get('aux');
  			console.log("conf "+s)
  			if(!s){
  				Session.set('mostrarArear',false)
				Session.set('mostrarProfessor',false)
  			}

			return Session.get('aux');
  		},
  		mostrarArea(){
  			return Session.get('mostrarArear')
  		},
  		mostrarProfessor(){
				console.log("snacipnsciancsaipn")
  			return Session.get('mostrarProfessor')
  		},
			teste(){
				return Session.get('mostrarForm');
			},
			mostrarFinalizar(){
				var a= Session.get('mostrarArear');
				var b= Session.get('mostrarProfessor');
				if(a || b)
					return true;

				if(!a && !b)
					return false
			},
			setFields(){
					var rowData=Session.get('rowDataConfirma');
					console.log(rowData)
					$('#valorTurmaConfirmar').text(rowData.Turma);
					$('#valorMateriaConfirmar').text(rowData.Materia.nomeMateria);
					var prof=rowData.Professor
					Session.set('professorSelecionado',prof);
					$("#professor").val(prof.nome)
					var area=rowData.Area;
					Session.set('areaSelecionada',area)
					$('#area').val(area.nome);
					var curso=rowData.Curso
					$('#curso').val(curso.nome)
					Session.set('cursoSelecionado',curso);
					if(rowData.qtdeAuto==0){
						$('#removerConfirmar').attr('disabled',false);
					}else{
						$('#removerConfirmar').attr('disabled',true);
					}
			}



})
	Template.confirmar.events({
		'click .input':function(event){
			event.preventDefault();
			var id=event.currentTarget.id;
			console.log(id);
			if(id=="atualizarConfirmar"){
				var curso=$('#curso').val();
				if(curso!=""){
					curso=Session.get('cursoSelecionado');
				}
				var area=$('#area').val();
				if(area!=""){
					area=Session.get('areaSelecionada');
				}
				var prof=$('#professor').val();
				if(prof!=""){
					prof=Session.get('professorSelecionado');
				}
				console.log(prof,area,curso)
				if(area==null || area==""){
					alert("Selecione uma area")
				}else if(curso==null || curso==""){
					alert("Selecione um curso")
				}else{
					var oferta=Session.get('rowDataConfirma');
					Meteor.call('atualizarConfirmar',oferta,prof,area,curso)
				}
			}else if(id=="removerConfirmar"){
				console.log('niaoncisaonc');
				var row= Session.get('rowDataConfirma');
				console.log(row)
				if(row.auto==""){
					Meteor.call('removerById',row._id);
						console.log('result rem ', r)
				}else{
						Meteor.call('removerById',row._id);
						Meteor.call('atualizarQtdeDesc',row.auto);
				}
			}
		},
		'click #finalizarConfimar':function(event){
			event.preventDefault();
			Meteor.call('mudarEtapa',Session.get('processoSelecionado'),3,function(e,r){
				if(e){

				}else{
					Bert.alert("Confirmação realizada com sucesso",'default','growl-top-right','fa-bell')
					Session.set('processoSelecionado',"")
					Session.set("aux",false)
				}
			})
		},
		'change .radioB':function(event){
			event.preventDefault();
			var id=event.target.id;
			Session.set('mostrarForm',false);
			if(id=="radioArea"){
				Session.set('mostrarArear',true);
				Session.set('mostrarProfessor',false)
			}else{
				Session.set('mostrarArear',false)
				Session.set('mostrarProfessor',true)
			}
		},
		'click table >  tbody >tr': function (event,template) {
			event.preventDefault();
			var id=event.currentTarget.id;
			var dataTable = $(event.target).closest('table').DataTable();
			var rowData = dataTable.row(event.currentTarget).data();
			console.log(rowData)
			if(rowData!=null){
				Session.set('rowDataConfirma',rowData)
				Session.set('mostrarForm',true);
				setTimeout(function(){
					Template.confirmar.__helpers.get('setFields').call();
				},50)
			}else{
					Session.set('mostrarForm',false);
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
	})
}

if(Meteor.isServer){
	Meteor.methods({
			teste(s){
				console.log(s)
			},
			atualizarConfirmar(oferta,professor,area,curso){
				OfertaMateria.update({_id:oferta._id},{$set:{Professor:professor,Area:area,Curso:curso}})
			},
			'atualizarQtdeDesc':function(id) {
				OfertaMateria.update({_id:id},{ $inc:{qtdeAuto:-1} })
			},
			removerById(id){
				OfertaMateria.remove({_id:id})
			}

		})
}
