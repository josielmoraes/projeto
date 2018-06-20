
Router.route('/Inicio',
	{
		template:'home',
		onBeforeAction: function() {
			var login=Meteor.userId();
			if(login==null){
				$('body').addClass('bg-dark')
			}else{
				$('body').removeClass('bg-dark')
			}
			this.next();
		}
  },
	)
Router.route('/',
	{
		template:'home',
		onBeforeAction: function() {
			var login=Meteor.userId();
			if(login==null){
				$('body').addClass('bg-dark')
			}else{
				$('body').removeClass('bg-dark')
			}

			 this.next();
		},
	}
)

if(Meteor.isClient){

		// dataTablesBootstrap from 'datatables.net-bs4';
	//import 'datatables.net-bs4/css/dataTables.bootstrap4.css';
	//dataTablesBootstrap(window, $);
	Template.menu.helpers({
		'c':function(p){
			console.log(p);
			if(p==0)
				return true;
			else
				return false
		}
	})
	Template.menu.events({
		'click #sair':function(){
			console.log('sair')
			Meteor.logout();
		}
	})
}
