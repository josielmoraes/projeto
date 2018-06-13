import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'




Meteor.startup(() => {
if(Meteor.isClient){
	$('input').attr('autocomplete','off');
	console.log("inicio");

	//Meteor.logout();
	Meteor.loginWithPassword('root','root123', function(e,r){
		if(e){
			console.log(e);
		}else{
			console.log(r);
			console.log('teste')
		}
	})
}

if(Meteor.isServer){
	//Processo.update({_id:"Tg42BY9uYFv2NBJfD"},{$set:{etapas:0}})
	//ROOT_URL="http://192.168.0.108:3000" meteor run
	//Meteor.users.remove("WS2aQotJje9JHBZh5");
	//export MONGO_URL='mongodb://localhost:27017/admin';

  //process.env.MAIL_URL = 'smtp://jozeil@hotmail.com:jlm12345@smtp.live.com:25'
	//MAIL_URL = 'smtp://jozeil@hotmail.com:jlm12345@smtp.live.com:25'
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
