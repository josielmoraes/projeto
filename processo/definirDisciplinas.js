import Semestre from "../imports/collections/semestre";
import Materia from "../imports/collections/materia";
import OfertaMateria from "../imports/collections/ofertaMateria";
import Tabular from 'meteor/aldeed:tabular';
import Area from '../imports/collections/area';
import Processo from "../imports/collections/processo";
import SubTurma from '../imports/collections/subTurma'




Router.route('/definirDisciplina',{
	template:'definirDisciplina'
})
new Tabular.Table({
  name: "Oferta",
  collection: OfertaMateria,
  columns: [
  	{data:"Turma", title:"Turma"},
  	{data:"Materia.nomeMateria", title:"Materia"},
  	{data:"Area.nome", title:"Area"},
  	{data:"Tipo", title:"Tipo"},
  	{data:"aulaSemanal", title:"Aulas"},
  	{data:"cargaHoraria", title: "Carga horária"},
  	{data:"" , defaultContent:'<a href class="removerOferta">Remover</>'}
    ],
		extraFields: ['qtdeAuto', 'auto'],


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

if(Meteor.isClient){
	Template.cadastroOfertaDisciplina.onCreated(function(){
		Session.set('mostrar',"");
		Session.set('processoSelecionado',"");
		Session.set('aux',false);
		Session.set('setSubMateria',0);
	})
	Template.definirDisciplina.helpers({
			'permissao':function(valor){
				if(valor==0){
					return true;
				}else {
						Router.go('/')
						return false
					}
			},
		})

	Template.cadastroOfertaDisciplina.helpers({

		 settings: function() {
		 	Session.get('processoSelecionado')
		    return {
		      position: Session.get("position"),
		      limit: 10,
		      rules: [
		        {
		          token: '',
		          collection: Materia,
		          field: 'nomeMateria',
		          template: Template.materiaAuto,
		          	noMatchTemplate:Template.vazio
		        },
		      ],

		    }
  		},
  		settings2() {
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

  		select:function(){
  			var processo= Session.get('processoSelecionado');
  			return {Processo:processo}
  		},
  		mostrar(){
  			var s=Session.get('aux');
			return Session.get('aux');
  		},
  		campos(){
  		$('#materia').val("");
			$('#area').val("");
			$('#subMateria').val(0);
			$('#turmaMateria').val(1);
			$('#turmaMateria').focus()
			$('#subMateria').attr('disabled',false)
			$('#subMateria').attr('min',0)
			$("#cadastrar").val('Ofertar')
			Session.set('materiaSelecionada',"")
			Session.set('areaSelecionada',"");
			Session.set('setSubMateria',0);

  		},
  		validarTurma(){
  			var turma=$('#turmaMateria').val();
  			var aux=OfertaMateria.findOne({Turma:turma})
  			var row=Session.get('rowData')
  			if(row!=null){
	  			if(row._id!=aux._id){

	  				$('#cadastroOfertaMateria').validate().showErrors({
	  					turmaMateria:"Código cadastrado"
	  				})
	  				return false;
	  			}
  			}else{

	  			turma=$('#subTurma1').val();
	  			aux=OfertaMateria.findOne({Turma:turma})
	  			row=Session.get('rowDataSub1');
	  			if(row!=null){
		  			if(row._id!=aux._id){
		  				$('#cadastroOfertaMateria').validate().showErrors({
		  					subTurma1:"Código cadastrado"
		  				})
		  				return false;
		  			}
		  		}

	  			turma=$('#subTurma2').val();
	  			aux=OfertaMateria.findOne({Turma:turma})
	  			row=Session.get('rowDataSub2');
	  			if(row!=null){
		  			if(row._id!=aux._id){
		  				$('#cadastroOfertaMateria').validate().showErrors({
		  					subTurma2:"Código cadastrado"
		  				})
		  				return false;
		  			}
	  			}
	  			turma=$('#subTurma3').val();
	  			aux=OfertaMateria.findOne({Turma:turma})
	  			row=Session.get('rowDataSub3');
	  			if(row!=null){
		  			if(row._id!=aux._id){
		  				$('#cadastroOfertaMateria').validate().showErrors({
		  					subTurma3:"Código cadastrado"
		  				})
		  				return false;
		  			}
		  		}

	  			turma=$('#subTurma4').val();
	  			aux=OfertaMateria.findOne({Turma:turma})
	  			row=Session.get('rowDataSub4');
	  			if(row!=null){
		  			if(row._id!=aux._id){
		  				$('#cadastroOfertaMateria').validate().showErrors({
		  					subTurma4:"Código cadastrado"
		  				})
		  				return false;
		  			}
		  		}
	  			turma=$('#subTurma5').val();
	  			aux=OfertaMateria.findOne({Turma:turma})
	  			row=Session.get('rowDataSub5');
	  			if(row!=null){
		  			if(row._id!=aux._id){
		  				$('#cadastroOfertaMateria').validate().showErrors({
		  					subTurma5:"Código cadastrado"
		  				})
		  				return false;
		  			}
		  		}
	  		}
  			return true

  		}
  		,
  		completarSub(){
  			var l=Session.get('setSubMateria')
  			var aux={codigo:"", tipo:"",car:"",aula:""}
  			var sub=new Array(l);
  			var codSub="";
  			var tipo=""
  			var car="";
  			var aula="";
  			if(l>0){
	  			for(x=1;x<=l;x++){
	  				codSub=('#subTurma'+x).toString();
	  				tipo=('#subTipoAula'+x).toString();
	  				car=('#cargaHoraria'+x).toString();
	  				aula=("#aulasSemanal"+x).toString();
	  				aux={
	  					codigo:$(codSub).val(),
	  					tipo:$(tipo).val(),
	  					cargaHoraria:$(car).val(),
	  					aula:$(aula).val(),
	  				}
	  				sub[x-1]=aux;

	  			}
	  			return sub
	  		}
  		},
  	validar(){
	if(Session.get('aux')){
			window.setTimeout(
				function(){
				$('#cadastroOfertaMateria').validate({
							rules:{
								turmaMateria:{
									required:true,
								},
								materia:{
									required: true
								},
								area:{
									required: true
								},
								subTurma1:{
										required: true,
								},
								subNome1:{
										required: true,
								},
								cargaHoraria1:{
									required: true,
									number:true
								},
								aulasSemanal1:{
									required: true,
									number:true
								},

								subTurma2:{
										required: true,
								},
								subNome2:{
										required: true,
								},
								aulasSemanal2:{
									required: true,
									number:true
								},
								cargaHoraria2:{
									required: true,
									number:true
								},

								subTurma3:{
										required: true,
								},
								subNome3:{
										required: true,
								},
								cargaHoraria3:{
									required: true,
									number:true
								},
								aulasSemanal3:{
									required: true,
									number:true
								},

								subTurma4:{
										required: true,
								},
								subNome4:{
										required: true,
								},
								cargaHoraria4:{
									required: true,
									number:true
								},
								aulasSemanal4:{
									required: true,
									number:true
								},

								subTurma5:{
										required: true,
								},
								subNome5:{
										required: true,
								},
								cargaHoraria5:{
									required: true,
									number:true
								},
								aulasSemanal5:{
									required: true,
									number:true
								},
							},
							messages:{
								turmaMateria:{
									required:"Campo obrigatório",
								},
								materia:{
									required: "Campo obrigatório"
								},
								area:{
									required: "Campo obrigatório"
								},

								subTurma1:{
										required: "Campo obrigatório",
									},
								subNome1:{
										required: "Campo obrigatório",
									},
								cargaHoraria1:{
									required: "Campo obrigatório",
									number:"Somente números"
								},
								aulasSemanal1:{
									required: "Campo obrigatório",
									number:"Somente números"
								},

								subTurma2:{
										required: "Campo obrigatório",
									},
								subNome2:{
									required: "Campo obrigatório",
								},
								aulasSemanal2:{
									required:"Campo obrigatório",
									number:"Somente números"
								},
								cargaHoraria2:{
									required: "Campo obrigatório",
									number:"Somente números"
								},

								subTurma3:{
										required: "Campo obrigatório",
									},
								subNome3:{
									required: "Campo obrigatório",
								},
								cargaHoraria3:{
									required: "Campo obrigatório",
									number:"Somente números"
								},
								aulasSemanal3:{
									required:"Campo obrigatório",
									number:"Somente números"
								},

								subTurma4:{
										required: "Campo obrigatório",
									},
								subNome4:{
									required: "Campo obrigatório",
								},
								cargaHoraria4:{
									required:"Campo obrigatório",
									number:"Somente números"
								},
								aulasSemanal4:{
									required:"Campo obrigatório",
									number:"Somente números"
								},
								subTurma5:{
										required: "Campo obrigatório",
									},
								subNome5:{
									required: "Campo obrigatório",
								},
								cargaHoraria5:{
									required:"Campo obrigatório",
									number:"Somente números"
								},
								aulasSemanal5:{
									required:"Campo obrigatório",
									number:"Somente números"
								},
							}
						})
			},100)
 	 		}

 	 	}


	})


Template.cadastroOfertaDisciplina.events({
		'click #cadastroOfertaMateria .input':function(event){
			event.preventDefault();

			var id=$(event.target).prop('id');
			if(id=="limpar"){
				var sub=Template.cadastroOfertaDisciplina.__helpers.get('campos').call();
					$('#cadastroOfertaMateria').validate().resetForm()
			}else if(id=="voltar"){
				Router.go('/')
			}else if(id=="cadastrar"){
				var evento=$('#cadastrar').val()
				var sair=false;
					sair=$('#cadastroOfertaMateria').valid();
					//sair=Template.cadastroOfertaDisciplina.__helpers.get('validarTurma').call();
					var sub=Template.cadastroOfertaDisciplina.__helpers.get('completarSub').call();
					var mat= Session.get('materiaSelecionada');
					var processo= $('#processoSelecionado').val();
					var area=Session.get('areaSelecionada');
					var tipo=$('#tipoAula').val();
					var turma=$('#turmaMateria').val()
				if(evento=="Ofertar" && sair){
					Meteor.call('cadastrarOfertaMateria',turma,mat,mat.cargaHoraria,mat.aulaSemanal,processo,area,tipo,sub,function(e,r){
						if(e)
							console.log(e)
						else{
							Template.cadastroOfertaDisciplina.__helpers.get('campos').call();
						}
					});
				}else if(evento=="Atualizar"){
					var aux= Session.get('rowData');
					//console.log(aux._id,turma,mat._id,mat.cargaHoraria,mat.aulaSemanal,processo,area._id,tipo,aux.qtdeAuto,"");
					Meteor.call('atualizarOfertaMateria',aux._id,turma,mat,mat.cargaHoraria,mat.aulaSemanal,processo,area,tipo,aux.qtdeAuto,"")
					if(sub!=null){
						for(x=0;x<sub.length;x++){
							s=Session.get(('rowDataSub'+(x+1)).toString())
							if(s!=null){
								//console.log(s._id,sub[x].codigo,mat._id,sub[x].cargaHoraria,sub[x].aula,processo,area._id,sub[x].tipo,0,s.auto);
								Meteor.call('atualizarOfertaMateria',s._id,sub[x].codigo,mat,sub[x].cargaHoraria,sub[x].aula,processo,area,sub[x].tipo,0,s.auto)
							}else{
								//console.log(sub[x].codigo,mat._id,sub[x].cargaHoraria,sub[x].aula,processo,area._id,sub[x].tipo,0,aux._id);
								Meteor.call('cadastrarOfertaMateriaSub',sub[x].codigo,mat,sub[x].cargaHoraria,sub[x].aula,processo,area,sub[x].tipo,0,aux._id);
								Meteor.call('atualizarQtde',aux._id);
							}
						}
					}
					Template.cadastroOfertaDisciplina.__helpers.get('campos').call();
				}
			}
		},
		'click #confirmaOferta':function(event){
			event.preventDefault();
			Meteor.call('mudarEtapa',Session.get('processoSelecionado'),1,function(e,r){
				if(e){

				}else{
					Session.set('aux',false);
					Session.set('processoSelecionado',"");
					Bert.alert("Pré-oferta realizada com sucesso",'default','growl-top-right','fa-bell')
				}
			})
		},
		"autocompleteselect #materia": function(event, template, doc) {
			event.preventDefault();
		    Session.set('materiaSelecionada',doc)
		    console.log(doc);
		},
		 "autocompleteselect #area": function(event, template, doc) {
		  	event.preventDefault();
		    Session.set('areaSelecionada',doc)
		    console.log(doc);
		},
		'click tbody >tr': function (event,template) {
		  	event.preventDefault();
		  	var c=$(event.target).attr('class');
		    var dataTable = $(event.target).closest('table').DataTable();
		    var rowData = dataTable.row(event.currentTarget).data();
		  	if(c=="removerOferta"){
		  		$(event.target).closest('table').removeClass('selected');
		  		Meteor.call('removerOfertaMateria',rowData._id)
		  		Template.cadastroOfertaDisciplina.__helpers.get('campos').call();
		  	}else{
		  		Session.set('rowData',rowData);
		  		$('#cadastrar').val("Atualizar")

		  		atualizar();
		  	}
		},
		'click #subMateria':function(event){
				Session.set('setSubMateria',event.target.value);
				Session.set('setSubMateria',event.target.value);
		}
	});
function atualizar(){
	var rowData=Session.get('rowData');
	console.log(rowData)
	if(rowData.qtdeAuto==0 && rowData.auto==""){
		var m=rowData.Materia
		var a=rowData.Area
			$('#materia').val(m.nomeMateria);
			$('#area').val(a.nome);
			$('#subMateria').val(rowData.qtdeAuto);
		    $('#turmaMateria').val(rowData.Turma);
			Session.set('materiaSelecionada',m)
			Session.set('areaSelecionada',a);
			Session.set('setSubMateria',0);
	}else{
		if(rowData.auto!=""){
			var temp=rowData
			rowData=OfertaMateria.findOne({_id:temp.auto});
			Session.set('rowData',rowData);
		}
		console.log(rowData);
		$('#subMateria').attr('min',rowData.qtdeAuto)
		var m=rowData.Materia
		 Session.set('materiaSelecionada',m)
		var a=rowData.Area
		 Session.set('areaSelecionada',a)
		$('#materia').val(m.nomeMateria);
		$('#area').val(a.nome);

		$('#subMateria').val(rowData.qtdeAuto);
		$('#turmaMateria').val(rowData.Turma);
		Session.set('setSubMateria',rowData.qtdeAuto);
		var subs=OfertaMateria.find({auto:rowData._id}).fetch();
		window.setTimeout(function(){
			for(x=0;x<subs.length;x++){
				Session.set(('rowDataSub'+(x+1)).toString(),subs[x])
		  		codSub=('#subTurma'+(x+1)).toString();
		  		tipo=('#subTipoAula'+(x+1)).toString();
		  		car=('#cargaHoraria'+(x+1)).toString();
		  		aula=("#aulasSemanal"+(x+1)).toString();
		  		$(codSub).val(subs[x].Turma);
		  		$(tipo).val(subs[x].Tipo);
		  		$(car).val(subs[x].cargaHoraria);
		  		$(aula).val(subs[x].aulaSemanal);
	  		}
		},200)
	}
}

	Template.buscaSemestre.helpers({
		'buscaAnoSemestres':function(){
			return Semestre.find({});
		},
	})
	Template.buscaProcesso.helpers({
		'buscaProcessos':function(e){
			return Processo.find({etapas:Number(e)});
		},
		'buscaAnoSemestres':function(proc){
			var a=Semestre.findOne({_id:proc.semestreSelecionado});
			return a.anoLetivo+"/"+a.periodoLetivo
		},
	})
	Template.buscaProcesso.events({
		'click #processoSelecionado':function(event){
			var sem= $('#processoSelecionado').val();
			if(sem==""){
				Session.set('aux',false);
			}else{
				Session.set('aux',true);
				Session.set('processoSelecionado',sem);
			}
			$('#materia').val("");
			$('#area').val("");
			$('#subMateria').val(0)
			//$('#cadastroOfertaMateria').validate().resetForm()
			Session.set('setSubMateria',0);

		},

	})
	Template.subMateria.helpers({
		'habilitarSubMateria':function(){
			var v=Session.get('setSubMateria');
			var array=[];
			for(x=0;x<v;x++){
				array[x]=x+1;
			}
			return array;
		}

	})

}
if(Meteor.isServer){
	Meteor.methods({
		'cadastrarOfertaMateria':function(turma,Materia,cargaMateria,aulaSemanal, Processo, Area,tipo,dados){
			if(dados!=null){
				var a=OfertaMateria.insert({
				Materia:Materia,
				Processo:Processo,
				Area:Area,
				Tipo:tipo,
				auto:"",
				qtdeAuto:dados.length,
				Turma:turma,
				Professor:"",
				Curso:"",
				cargaHoraria:cargaMateria,
				aulaSemanal:aulaSemanal,
				horario:[],
				restricao:[]
				},function(e,r){
					if(e){

					}else{
						for(i=0;i<dados.length;i++){
							var c=OfertaMateria.insert({
								auto:a,
								qtdeAuto:0,
								cargaHoraria:dados[i].cargaHoraria,
								aulaSemanal:dados[i].aula,
								Turma:dados[i].codigo,
								Processo:Processo,
								Tipo:dados[i].tipo,
								Materia:Materia,
								Area:Area,
								Professor:"",
								Curso:"",
								horario:[],
								restricao:[]
							},function(e,r){
								if(e){
									console(e)
								}else{
									console.log("cadastro sub ",c)
								}
							})
						}
					}
				})
			}else{
				var a=OfertaMateria.insert({
				Materia:Materia,
				Processo:Processo,
				Area:Area,
				Tipo:tipo,
				auto:"",
				qtdeAuto:0,
				Turma:turma,
				Professor:"",
				Curso:"",
				cargaHoraria:cargaMateria,
				aulaSemanal:aulaSemanal,
				horario:[],
				restricao:[]
				})
			}

		},
		'cadastrarOfertaMateriaSub':function(turma,Materia,cargaMateria,aulaSemanal, Processo, Area,tipo,qtde,auto){
				var a=OfertaMateria.insert({
				Materia:Materia,
				Processo:Processo,
				Area:Area,
				Tipo:tipo,
				auto:auto,
				qtdeAuto:qtde,
				Turma:turma,
				Professor:"",
				Curso:"",
				cargaHoraria:cargaMateria,
				aulaSemanal:aulaSemanal,
				horario:[],
				restricao:[],
				})
			},

		'removerOfertaMateria':function(id){
			console.log(id);
			var mat=OfertaMateria.findOne({_id:id})
			//OfertaMateria.remove({})
			if(mat.qtdeAuto==0){
				OfertaMateria.remove({
					_id:id
				})
				if(mat.auto!=""){
					OfertaMateria.update({_id:mat.auto},{$inc:{
						qtdeAuto:-1
					}})
				}
			}else{
				var sub=OfertaMateria.find({auto:id}).fetch()
				console.log(sub);
				for(i=0;i<sub;i++){
					OfertaMateria.remove({
						_id:sub[i]._id
					})
				}
				OfertaMateria.remove({
					_id:id
				})
			}
		},
		'oferta':function(idM){
		},
		'mudarEtapa':function(id,int){
			Processo.update({_id:id},{$set:{etapas:int}})
		},
		'atualizarOfertaMateria':function(id,turma,Materia, cargaMateria,aulaSemanal, Processo, Area,tipo,qtdeAuto,auto){
			var a=OfertaMateria.update({_id:id},{$set:{
					Materia:Materia,
					Processo:Processo,
					Area:Area,
					Tipo:tipo,
					auto:auto,
					qtdeAuto:qtdeAuto,
					Turma:turma,
					Professor:"",
					Curso:"",
					cargaHoraria:cargaMateria,
					aulaSemanal:aulaSemanal,
					horario:[],
					restricao:[],

					}
				})
		},
		'atualizarQtde':function(id) {
			OfertaMateria.update({_id:id},{ $inc:{qtdeAuto:1} })
		}
	})



}
