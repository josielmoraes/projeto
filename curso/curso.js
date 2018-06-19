import HorarioSemanal from "../imports/collections/horarioSemanal";
import Curso from "../imports/collections/curso";
import Tabular from 'meteor/aldeed:tabular';


Router.route('/Curso',{
	template:'cadastroCurso'
});
new Tabular.Table({
  name: "Curso",
  collection: Curso,
  columns: [
    {data: "nome", title: "Curso"},
    {data: "sigla", title: "Sigla"},
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

	function validarDeletar(id){
		var horarioSemanal= HorarioSemanal.find({idCurso:id}).fetch();
		if(horarioSemanal.length>0){
			$('#formCadrastroCurso').validate().showErrors({
				erro:"Curso relacionado com Horário Semanal"
			})
			return false
		}else{
			return true;
		}

	}
	Template.cadastroCurso.helpers({

		 campos(){
			 	$('#nomeCurso').focus()
			$('#nomeCurso').val("");
			$('#siglaCurso').val("");
			$('#cadastrarCurso').val("Cadastrar");
			$('#deletarCurso').val("Voltar")
		},
		'permissao':function(valor){
			if(valor==0)
				return true;
		},
	})
	Template.cadastroCurso.events({
		'click .input':function(event){
			event.preventDefault();
			var id=$(event.target).prop('id');
			if(id=="cadastrarCurso"){
				var evento=  $('#cadastrarCurso').val();
				var validar=$('#formCadrastroCurso').valid();
				var dadosCurso={
						nome: $('#nomeCurso').val(),
						sigla:$('#siglaCurso').val()
					}
				console.log(dadosCurso.nome);
				console.log(dadosCurso.sigla);
				if(evento=="Cadastrar" && validar){
					Meteor.call('criarCurso', dadosCurso);
					Template.cadastroCurso.__helpers.get('campos').call();
				}else if(evento=="Atualizar" && validar){
					var curso=Session.get("curso");
					Meteor.call('atualizarCurso',curso._id,dadosCurso);
					Template.cadastroCurso.__helpers.get('campos').call();
				}
			}else if(id=="deletarCurso"){
				var deletar= $('#deletarCurso').val();
				if(deletar=="Voltar"){
					Router.go("/")
				}else if (deletar=="Deletar"){
					var idCurso=Session.get("curso");
					if(validarDeletar(idCurso._id)){
						Meteor.call('deletarCurso',idCurso._id);
						Template.cadastroCurso.__helpers.get('campos').call();
					}
				}

			}else if(id=="limpar"){
				Template.cadastroCurso.__helpers.get('campos').call();
			}


		},
		'click tbody > tr': function (event,template) {
		    var dataTable = $(event.target).closest('table').DataTable();
		    var rowData = dataTable.row(event.currentTarget).data();
		    $('#nomeCurso').val(rowData.nome);
		    $('#siglaCurso').val(rowData.sigla);
		    $('#cadastrarCurso').val("Atualizar");
		    $('#deletarCurso').val("Deletar")
		    Session.set("curso",rowData);
		  }
	});

	Template.cadastroCurso.onRendered(function(){
		$('#formCadrastroCurso').validate({
			rules:{
				nomeCurso:{
					required:true,
					minlength:6
				},
				siglaCurso:{
					required:true,
					minlength:2,
				}
			},
			messages:{
				nomeCurso:{
					required:" Campo obrigatório",
					minlength:"Mínimo de 8 letras"
				},
				siglaCurso:{
					required:" Campo obrigatório",
					minlength:"Duas letras"
				}
			}
		});
	});
}
if(Meteor.isServer){
	Meteor.methods({
		'criarCurso':function(dadosCurso){
			Curso.insert({
				nome:dadosCurso.nome,
				sigla:dadosCurso.sigla
			})
		},
		'atualizarCurso':function(id,dadosCurso){
			Curso.update({_id:id},
			{
				nome:dadosCurso.nome,
				sigla:dadosCurso.sigla
			})
		},
		'deletarCurso':function(idDeletar){
			Curso.remove({_id:idDeletar})
		}
	});
}
