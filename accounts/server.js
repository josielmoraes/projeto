import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'




Meteor.startup(() => {
if(Meteor.isClient){
	$('input').attr('autocomplete','off');
	console.log("inicio");

	//Meteor.logout();
	Meteor.loginWithPassword('root','root1234', function(e,r){
		if(e){
			console.log(e);
		}else{
			console.log(r);
			console.log('teste')
		}
	})
}

if(Meteor.isServer){
	//Processo.update({_id:"tPt2tLvSgpZNPdbah"},{$set:{etapas:1}})

	//Meteor.users.remove("WS2aQotJje9JHBZh5");
	var us=Meteor.users.find({username:'root'}).fetch();
		//console.log(us);
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
