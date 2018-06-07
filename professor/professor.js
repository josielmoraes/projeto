import Professor from "../imports/collections/professor";
import Tabular from 'meteor/aldeed:tabular';
Router.route('/Professor',{
	template: 'cadastroProfessor'
})



new Tabular.Table({
  name: "Professor",
  collection: Professor,
  columns: [
    {data: "nome", title: "Nome"},
    {data: "formacao", title: "Formacao"},
    {data: "email", title:"Email"},
    {data: "telefone", title:"Telefone"}
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
		var horarioSemanal= HorarioSemanal.find({idProfessor:id}).fetch();
		if(horarioSemanal.length>0){
			$( '#formCadastroProfessor' ).validate().showErrors({
				erro:"Professor relacionado com Horário Semanal"
			})
			return false
		}else{
			return true;
		}
		
	}
	Template.cadastroProfessor.helpers({
		campos(){
			$('#nomeProfessor').val("");
			$('#siape').val("");
			$('#formacaoProfessor').val("");
			$('#emailProfessor').val("");
			$('#telefoneProfessor').val("");
			$('#Cadastrar').val("Cadastrar");
			$('#Deletar').val("Voltar");	
		},
		'permissao':function(valor){
			console.log(valor);
			if(valor==0)
				return true
			
		},
	})
	Template.cadastroProfessor.events({
		
		'click .input': function(event){
			event.preventDefault();	
			
			var id=$(event.target).prop('id');
			console.log(id);
			if(id=="Cadastrar"){
				var evento=  $('#Cadastrar').val();
				var dadosProfessor={
						nome:  $('#nomeProfessor').val(), 
						siape:  $('#siape').val(),
						formacao:  $('#formacaoProfessor').val(),
						email: $('#emailProfessor').val(),
						telefone: $('#telefoneProfessor').val(),
					}
					console.log(dadosProfessor)
				var validar=$( '#formCadastroProfessor' ).valid();
				if(evento=="Cadastrar" && validar==true){
					Meteor.call('cadastrarProfessor',dadosProfessor);
					Template.cadastroProfessor.__helpers.get('campos').call();
				}else if(evento=="Atualizar" && validar==true){
					var prof=Session.get("professor")
					Meteor.call('atualizarProfessor',prof._id, dadosProfessor);
					Template.cadastroProfessor.__helpers.get('campos').call();
				}
				
			}else if( id=="Deletar"){
				var evento=  $('#Deletar').val();
				if(evento=="Voltar"){
					Router.go('/');		
				}else if(evento=="Deletar"){
					var prof=Session.get("professor");
					if(validarDeletar(prof._id)){
						Meteor.call('deletarProfessor',prof._id);
						Template.cadastroProfessor.__helpers.get('campos').call();
					}
				}
			}else if(id=="limpar"){
				Template.cadastroProfessor.__helpers.get('campos').call();
			}
					
			
		},
		'click tbody > tr': function (event,template) {
		    var dataTable = $(event.target).closest('table').DataTable();
		    var rowData = dataTable.row(event.currentTarget).data();
		    console.log(rowData._id)
		    var prof=Professor.findOne({_id:rowData._id})// Meteor.call('procurarProfessor',rowData._id);
		    console.log(prof);
		    $('#nomeProfessor').val(prof.nome);
		    $('#siape').val(prof.siape);
		    $('#formacaoProfessor').val(prof.formacao);
		    $('#emailProfessor').val(prof.email);
		    $('#telefoneProfessor').val(prof.telefone);
		    $('#Cadastrar').val("Atualizar");
		    $('#Deletar').val("Deletar");

		    Session.set("professor",prof);
		  }

  	});

	Template.cadastroProfessor.onRendered(function(){	  
	
		$( '#formCadastroProfessor' ).validate({
			    	rules:{
			    		nomeProfessor:{
			    			 minlength: 6,
			    			 required:true
			    		},
			    		siape:{
			    			minlength: 6,
			    			 required:true
			    		},
			    		formacaoProfessor:{
			    			minlength: 6,
			    			 required:true
			    		},
			    		emailProfessor:{
			    			email:true,
			    			required:true
			    		},
			    		telefoneProfessor:{
			    			digits:true,
			    			required:true
			    		}
			    	},
			    	messages:{
			    		nomeProfessor:{
			    			minlength:"Precisa de no minimo 6 letras",
			    			required:"Campo obrigatório"
			    		},
			    		siape:{
			    			minlength:"Precisa de no minimo 6 letras",
			    			required:"Campo obrigatório"
			    		},
			    		formacaoProfessor:{
			    			minlength:"Precisa de no minimo 6 letras",
			    			required:"Campo obrigatório"
			    		},
			    		emailProfessor:{
			    			email:"Entre com um email válido",
			    			required:"Campo obrigatório"
			    		},
			    		telefoneProfessor:{
			    			required:"Campo obrigatório"
			    		}
			    	},
			 });
	});
}

if(Meteor.isServer){
	Meteor.methods({
		'cadastrarProfessor':function(dadosProfessor){
			console.log(dadosProfessor)
			Professor.insert({
				nome: dadosProfessor.nome,
				formacao: dadosProfessor.formacao,
				email: dadosProfessor.email,
				telefone: dadosProfessor.telefone,
				siape: dadosProfessor.siape,
			})
		},
		'atualizarProfessor':function(id,dadosProfessor){
			Professor.update({_id:id},{$set:{
				nome: dadosProfessor.nome,
				siape: dadosProfessor.lotacao,
				formacao: dadosProfessor.formacao,
				email: dadosProfessor.email,
				telefone: dadosProfessor.telefone,
			}
			})
		},
		'deletarProfessor':function(id){
			Professor.remove({_id:id})
		},
		'procurarProfessor':function(id){
			return Professor.findOne({_id:id});
		}

	});
	
}