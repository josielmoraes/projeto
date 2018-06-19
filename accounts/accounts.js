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
			if(c!=null){
				$('#formCadastroUsuario').validate().showErrors({
					emailUsuario:'Email cadastrado'
				})
				return false;
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
			var sair=Meteor.users.find({"emails.address":c.toString()});
			if(c!=null){
				$('#formCadastroUsuario').validate().showErrors({
					emailUsuario:'Email cadastrado'
				})
				return false;
			}
		},
		selec(){

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
		'click #cadastrar':function(event){
			event.preventDefault();
			var i=$('#formCadastroUsuario').valid()
			var sair=validarUsuario();
			Meteor.call('sendConfirmation',Meteor.userId())
			sair=false
			if(sair){
				var dados={
					email:$('#emailUsuario').val(),
					profile:{
						name:$('#nomeUsuario').val(),
						permission:$('#funcao').val(),
					}
				}
				console.log(dados);
				Meteor.call('cadastrarUsuario',dados)
			}
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
		}
	})
	Meteor.publish('usuarios',function(){
		return Meteor.users.find({"profile.permission":{$not: 0}})
	})

}
