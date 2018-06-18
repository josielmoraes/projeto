
//Router.route('/reset-password', {name: 'resetPassword',template:'resetPassword'});

Router.route('/#/reset-password/:token',
 {name: 'resetPassword',template:'resetPassword'}
 );
/*
AccountsTemplates.configureRoute('resetPwd',{
		path: '/reset',
    	template: 'resetPassword',

    });
*/

if(Meteor.isClient){
	Template.login.onCreated(function(){
		Session.set('showModal', false);
	})
	Template.login.helpers({
		'showModal':function(){
			return Session.get('showModal')
		},
    logado(current){
      console.log(current)
      if(current!=null){
        console.log('true')
        return false;
      }else{
        console.log(false)
        return true;
      }
    }
	})
	Template.login.events({
		'click #esqueciSenha':function(event,template){
			console.log("esquicisenha");
			Modal.show('esqueceuSenha');

		},
		'submit form':function(event){
			event.preventDefault();
			var email=$('#emailLogin').val();
			var senha=$("#pwdLogin").val();
			console.log(email,senha);
			Meteor.loginWithPassword(email,senha, function(e,r){
				if(e){
					console.log(e);
				}else{
					console.log(r);
					console.log('teste');
					Router.go('/')
				}
			})
		},
    'click #sair':function(event){
			event.preventDefault();
			console.log('sair')
			Meteor.logout()
		}
	})
	Template.esqueceuSenha.helpers({
		valida(){
			var email=$('#email').val();
			if(email==""){
				$('#esqueceuSenha').validate().showErrors({
					erro:"Digite um email"
				})
			}else{
				var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   				var v=re.test(String(email).toLowerCase());
   				if(!v){
   					$('#esqueceuSenha').validate().showErrors({
					erro:"Digite um email valido"
				})
   				}
			}
		}
	})
	Template.esqueceuSenha.events({
		'submit form': function(e){
			e.preventDefault();
			var email=$('#email').val();
			Template.esqueceuSenha.__helpers.get('valida').call()
			console.log(email);
			//var user=Meteor.users.find({"emails[0].address":email.toString()}).fetch();
			//console.log(user);
			Meteor.call('esqueceuSenha',email)
      	Modal.hide('esqueceuSenha');
		}
	})

	Template.esqueceuSenha.onRendered(function(){
		console.log("render")
		$('#esqueceuSenha').validate({
			rules:{
				email:{
					email:true,
			    	required:true
				}
			},
			messages:{
				email:{
					required:"Necessita de um Email",
					email:"Digita um email valido"
				}
			}
		})
	});
	Template.resetPassword.events({
		'submit form': function(event){
			event.preventDefault();
			console.log("teste")
			var a= Meteor.userId();
			var s=$('#confirmarSenha').val();
			//var t=Session.get('tokenReset');
			console.log(Accounts._resetPasswordToken);
      /*
			Accounts.resetPassword(t.toString(),s,function(e,r){
				if(e){
					console.log(e)
				}else{
					console.log("senhatrocada")
					Router.go('/Inicio')
				}
			})
      */
		}
	})


}
if(Meteor.isServer){
	Meteor.methods({
		'esqueceuSenha':function(user){


			var a=Accounts.findUserByEmail(user);
			console.log('inicio:',a);
			Accounts.sendResetPasswordEmail(a._id)
		},
		'resetarSenha':function(){

		}
	})

}
