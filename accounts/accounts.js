import Tabular from 'meteor/aldeed:tabular';

Router.route('/Usuario',{
	template:'cadastroUsuario'
})



new Tabular.Table({
	name: "Usuario",
	collection: Meteor.users,
	columns: [
		{data: "profile.name", title: "Usuário"},
		{data: "emails[0].address", title: "Email"},
		{data: "profile.permission", title: "Permissão"},
	],
	extraFields:[
		'emails[0]',
	],

	responsive: true,
	//autoWidth: false,
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



function validarUsuario(){
	console.log("email 1",$('#emailUsuario').val());
	var c=$('#emailUsuario').val()
	var sair=Meteor.users.findOne({"emails.address":c.toString()});
	console.log(sair)
	if(sair!=null){
		$('#formCadastroUsuario').validate().showErrors({
			emailUsuario:'Email cadastrado'
		})
		return false;
	}else{
		return true;
	}
};
if(Meteor.isClient){

	Template.cadastroUsuario.helpers({

		'logado':function(l){
			Session.set('user',l)
		},
		validarUsuario(){
			console.log("email 1",$('#emailUsuario').val());
			var c=$('#emailUsuario').val()
			var sair=Meteor.users.findOne({"emails.address":c.toString()});
			console.log(sair)
			if(sair!=null){
				$('#formCadastroUsuario').validate().showErrors({
					emailUsuario:'Email cadastrado'
				})
				return false;
			}else{
				return true;
			}
		},
		campos(){
			$('#nomeUsuario').val("");
			$('#emailUsuario').val("");
			$('#funcao').val(0);
			$('#cadastrar').val("Cadastrar");
			$('#deletar').val("Voltar")
		},
		'permissao':function(valor){
			if(valor==0){
				return true;
			}else {
				Router.go('/')
				return false
			}
		},
	})
	Template.cadastroUsuario.onRendered(function(){
		console.log("render");
		$('#formCadastroUsuario').validate({
			rules:{
				nomeUsuario:{
					required:true
				},
				emailUsuario:{
					required:true,
					email:true,
				}
			},
			messages:{
				nomeUsuario:{
					required:"Campo obrigatório"
				},
				emailUsuario:{
					required:"Campo obrigatório",
					email:"Entre com email valido"
				}
			}
		})
	})

	Template.cadastroUsuario.events({
		'click .input':function(event){
			event.preventDefault();
			var id=$(event.target).prop('id');
			if(id=="cadastrar"){
				var i=$('#formCadastroUsuario').valid()
				var sair=validarUsuario();
				console.log(sair);
				var dados={
					email:$('#emailUsuario').val(),
					profile:{
						name:$('#nomeUsuario').val(),
						permission:$('#funcao').val(),
					}
				}
					var evento=  $('#cadastrar').val();
					if(evento=="Cadastrar"){
						Meteor.call('cadastrarUsuario',dados,function(e,r){
							if(e){
							}else{
								Accounts.forgotPassword({ email: dados.email })
							}
						})
					}else if(evento="Atualizar"){
						console.log('atualizar')
							Meteor.call('atualizarUsuario',dados);
					}
					Template.cadastroUsuario.__helpers.get("campos").call()
				}else if(id=="deletar"){
					var evento=  $('#deletar').val();
					if(evento=="Voltar"){
						Router.go('/');
					}else if(evento=="Deletar"){

					}else if(evento=="Deletar"){
						Template.cadastroUsuario.__helpers.get("campos").call()
					}
				}else if(id="limparCampos"){
					Template.cadastroUsuario.__helpers.get("campos").call()
				}
			},
			'click tbody > tr': function (event,template) {
					var dataTable = $(event.target).closest('table').DataTable();
					var rowData = dataTable.row(event.currentTarget).data();
					console.log(rowData)
					$('#nomeUsuario').val(rowData.profile.name);
					$('#emailUsuario').val(rowData.emails[0].address);
					$('#funcao').val(rowData.profile.permission);
					$('#cadastrar').val("Atualizar");
					$('#deletar').val("Deletar")
					Session.set("user",rowData);
				}

	})

}

if(Meteor.isServer){

	Meteor.methods({

		'sendConfirmation':function(user){
			Accounts.sendEnrollmentEmail(user)
			//Accounts.sendResetPasswordEmail(user);
		},
		cadastrarUsuario:function(user){
			var id=Accounts.createUser({
				email:user.email,
				profile:user.profile
			})
			console.log(id)
		},
		atualizarUsuario:function(user){
			 Meteor.users.update({_id:user.id}, {
				email:user.email,
				profile:user.profile
			})
		}
	})
	Meteor.publish('usuarios',function(){
		return Meteor.users.find({"profile.permission":{$not: 0}})
	})

}
