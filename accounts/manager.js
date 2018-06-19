
Router.route('/reset/:token', {
template: 'ResetPassword',
name: 'resetPassword',
onBeforeAction() {
  if (!Meteor.userId()) {
  Meteor.call('checkResetToken',this.params.token,(err)=>{
    if(err){
      console.log(err.message);
      Bert.alert('Link de recuperação expirado.', 'danger', 'growl-top-right');
      Router.go("/");
    }
  });
    Accounts._resetPasswordToken = this.params.token;
    this.next();
  } else {
    Accounts._resetPasswordToken = null;
    Router.go("/");
  }
}
});
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
			Modal.show('ForgotPassword');
		},
		'submit form':function(event){
			event.preventDefault();
			var email=$('#emailLogin').val();
			var senha=$("#pwdLogin").val();
			console.log(email,senha);
			Meteor.loginWithPassword(email,senha, function(e,r){
				if(e){
					console.log(e);
          $('#validarLogin').validate().showErrors({
            erroLogin:"Email ou senha não confere",
          })
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

  Template.ForgotPassword.events({
    'submit #forgotPasswordForm': function(e, t) {
      event.preventDefault();
      let myEmail = event.target.email.value;
      Accounts.forgotPassword({ email: myEmail }, function(error) {
        if (error) {
          if (error.message === 'User not found [403]'){
            //alert(BertMsg.login.errorEmailNotFound, 'danger', 'growl-top-right');
          }else{
          //  Bert.alert(BertMsg.errorUnknown, 'danger', 'growl-top-right');
            }
        } else {
          //Bert.alert(BertMsg.login.successRecover, 'success', 'growl-top-right');
          //Router.go("home");
        }
      });
      	Modal.hide('ForgotPassword');
    },
  });

  Template.ResetPassword.events({
    'submit #resetForm': function(event, t) {
      event.preventDefault();
      const newpassword = event.target.novaSenha.value;
      const newpasswordconfirm = event.target.confirmarSenha.value;
      /*
      const passcondition =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}/;

      if (!passcondition.test(newpassword)){
        Bert.alert(BertMsg.password.errorIncorrectPassword, 'danger', 'growl-top-right');
      } else if (newpassword != newpasswordconfirm) {
        Bert.alert(BertMsg.password.errorMatchPasswords, 'danger', 'growl-top-right');
      } else {
        Accounts.resetPassword(Accounts._resetPasswordToken, newpassword, function(error) {
          if (error) {
            Bert.alert(BertMsg.errorUnknown, 'danger', 'growl-top-right');
          } else {
            Bert.alert(BertMsg.password.success, 'success', 'growl-top-right');
            Meteor.call('changeFirstLogin');
          }
        });
      }
      */
      if(newpassword==newpasswordconfirm){
          console.log(Accounts._resetPasswordToken, newpassword)
          Accounts.resetPassword(Accounts._resetPasswordToken, newpassword)
      }else{
        alert("Senhas diferentes")
      }
    }
  });


}
if(Meteor.isServer){

  Meteor.methods({
    checkResetToken(token) {
        const user = Meteor.users.findOne({
          "services.password.reset.token": token});
        if (!user) {
          throw new Meteor.Error(403, "Token expired");
        }

        const when = user.services.password.reset.when;
        const reason = user.services.password.reset.reason;
        let tokenLifetimeMs = Accounts._getPasswordResetTokenLifetimeMs();
        if (reason === "enroll") {
          tokenLifetimeMs = Accounts._getPasswordEnrollTokenLifetimeMs();
        }
        const currentTimeMs = Date.now();
        if ((currentTimeMs - when) > tokenLifetimeMs) { // timeout
          throw new Meteor.Error(403, "Token expired");
        }
      }
  });

}
