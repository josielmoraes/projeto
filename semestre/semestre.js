import Semestre from "../imports/collections/semestre";
import Tabular from 'meteor/aldeed:tabular';
import dataTablesBootstrap from 'datatables.net-bs4';
Router.route('/Semestre',{
	template:'cadastroSemestre'
})

new Tabular.Table({
  name: "Semestre",
  collection: Semestre,
  columns: [
    {data: "anoLetivo", title: "Ano"},
    {data: "periodoLetivo", title: "Periodo"},
    {data: "dataInicio", title:"Data Início"},
    {data: "dataFinal", title:"Data Encerramento"}
    ],
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
	}
  })


if(Meteor.isClient){
function campos(){
	 		$('#anoLetivo').val("2018");
		    $('#periodoLetivo').val("1");
		    $('#dataInicio').val("dd/MM/yyyy");
		    $('#dataFinal').val("dd/MM/yyyy");
		    $('#cadastrar').val("Cadastrar");
		    $('#deletar').val("Voltar");
}
function validarSemestre(){
	var dataFinal= $('#dataFinal').val();
	var dataInicio=$('#dataInicio').val();
	var anoLetivo=$('#anoLetivo').val();
	var periodoLetivo= $('#periodoLetivo').val();
	var cadastrar=$('#cadastrar').val();
	var boolean=true;
	if(cadastrar=="Atualizar"){
		var aux= Session.get("semestre");
		if(anoLetivo==aux.anoLetivo && periodoLetivo==aux.periodoLetivo)
			boolean=false;
	}
		if(dataFinal<=dataInicio){
					$('#formCadastroSemestre').validate().showErrors({
						dataFinal:"Data Final não pode ser menor que Inicial"
					});
			return false;
		}else if(Semestre.findOne({anoLetivo:anoLetivo, periodoLetivo:periodoLetivo}) && boolean){
					//console.log("Ano letivo e periodoLetivo existentes");
					$('#formCadastroSemestre').validate().showErrors({
						erro:"Semestre cadastrado no perido e ano letivo"
					});
			return false;
		}else{
			return true;
		}

}
function validarDeletar(id){
		var horarioSemanal= HorarioSemanal.find({idSemestre:id}).fetch();
		if(horarioSemanal.length>0){
			$('#formCadastroSemestre').validate().showErrors({
				erro:"Semestre relacionado com Horário Semanal"
			})
			return false
		}else{
			return true;
		}

	}
Template.cadastroSemestre.helpers({
	'permissao':function(valor){
			if(valor==0)
				return true;
		},
})
Template.cadastroSemestre.events({
	'click .input':function(event){
		event.preventDefault();
		var id=$(event.target).prop('id');
		//console.log("entrou");
		//console.log(id);
		if(id=="cadastrar"){
			var dadoSemestre={
				anoLetivo: 	$('#anoLetivo').val(),
				dataInicio: $('#dataInicio').val(),
				dataFinal:$('#dataFinal').val(),
				periodoLetivo:$('#periodoLetivo').val(),
			}



			var cadastrar=$('#cadastrar').val();
			var validar=$('#formCadastroSemestre').valid();
			if(validar==true)
				validar=validarSemestre();


			if(cadastrar=="Cadastrar" && validar){
				Meteor.call('cadastrarSemestre',dadoSemestre);
			}else if(cadastrar=="Atualizar" && validar) {
				Meteor.call('atualizarSemestre',dadoSemestre);
			}
			if(validar){
				campos();
			}
		}else if(id=="deletar"){
			var deletar=$('#deletar').val();
			if(deletar=="Voltar"){
				Router.go('/');
			}else if(deletar=="Deletar"){
				var aux= Session.get("semestre");
				if(validarDeletar(aux._id)){
					Meteor.call('deletarSemestre',aux._id);
					campos();
				}
			}
		}
	},
	'chage #anoLetivo': function(event){
		Session.set("ano", event.target.value)
	},
	'chage #anoPeriodo': function(event){
		Session.set("periodo", event.target.value)
	},

	'click tbody > tr': function (event,template) {
		var dataTable = $(event.target).closest('table').DataTable();
		var rowData = dataTable.row(event.currentTarget).data();
		    $('#anoLetivo').val(rowData.anoLetivo);
		    $('#periodoLetivo').val(rowData.periodoLetivo);
		    $('#dataInicio').val(rowData.dataInicio);
		    $('#dataFinal').val(rowData.dataFinal);
		    $('#cadastrar').val("Atualizar");
		    $('#deletar').val("Deletar");
		    $('#formCadastroSemestre').valid();
		    Session.set("semestre",rowData);
	}
})

Template.cadastroSemestre.onRendered(function(){
	$('#formCadastroSemestre').validate({
		rules:{
			dataInicio:{
				required: true,
				date:true
			},
			dataFinal:{
				required: true,
				date:true
			},
		},
		messages:{
			dataInicio:{
				required: "Campo obrigatório",
				date:true
			},
			dataFinal:{
				required: "Campo obrigatório",
				date:true
			},
		}
	});
})

}



if(Meteor.isServer){
Meteor.methods({
	'cadastrarSemestre':function(dadoSemestre){
		Semestre.insert({
			anoLetivo:dadoSemestre.anoLetivo,
			periodoLetivo:dadoSemestre.periodoLetivo,
			dataInicio:dadoSemestre.dataInicio,
			dataFinal:dadoSemestre.dataFinal,
		})
	},
	deletarSemestre:function(id){
		Semestre.remove({_id:id})
	},
	atualizarSemestre:function(dadoSemestre){
		Semestre.update({_id:dadoSemestre._id},{
			anoLetivo:dadoSemestre.anoLetivo,
			periodoLetivo:dadoSemestre.periodoLetivo,
			dataInicio:dadoSemestre.dataInicio,
			dataFinal:dadoSemestre.dataFinal,})
	},
	semestre:function(){
		return Semestre.find();
	}
})
Meteor.publish('semestre',function(){
	return Semestre.find();
})
}
