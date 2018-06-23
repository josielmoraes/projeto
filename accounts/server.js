import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'



Meteor.startup(() => {
if(Meteor.isClient){
	$('input').attr('autocomplete','off');

	Meteor.loginWithPassword('root','12', function(e,r){
		if(e){
			//console.log(e);
		}else{
			//console.log(r);
		//	console.log('teste')
		}
	})
}

if(Meteor.isServer){
	//Processo.remove({})
	//ROOT_URL="http://192.168.0.108:3000" meteor run
	smtp = {
	 username: 'josielloureirodemoraes2@gmail.com',   // eg: server@gentlenode.com
	 password: 'jlm134268759',   // eg: 3eeP1gtizk5eziohfervU
	 server:   'smtp.gmail.com',  // eg: mail.gandi.net
	 port: 465
 }
 process.env.MAIL_URL = 'smtps://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
 let templateEmailrecovery ={
     from:function(){
         return 'academicsystem@ufmt.com.br';
     },
     subject:function(user){
         return 'Recuperação de Senha';
     },
     text:function(user, url){
               var newUrl = url.replace('#/reset-password','reset');
                return 'Olá,\nPara recuperar sua senha, clique no link...\n'+newUrl;;
         }
 }
 Accounts.emailTemplates.resetPassword = templateEmailrecovery;


		//console.log(us);
		var us=Meteor.users.find({username:'root'}).fetch();
	var r={
		username:'root',
		email:'josielloureirodemoraes@gmail.com',
		password:'root1234',
		profile:{
			permission:0,
			name:'Root'
		}
	};
	var a={
		username:'josiel',
		email:'josiel@gmail.com',
		//password:'root1234',
		profile:{
			permission:1,
			name:'Josiel'
		}
	};
	if(Meteor.users.findOne({username:r.username})==null){
		Accounts.createUser({
			username:r.username,
			email:r.email,
			password:r.password,
			profile:r.profile

		});
	}
	if(Meteor.users.findOne({username:a.username})==null){
		Accounts.createUser({
			username:a.username,
			email:a.email,
			//password:a.password,
			profile:a.profile

		});
	}




}

})
