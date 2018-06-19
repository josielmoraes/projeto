
Router.route('/Inicio',
	{
		template:'home',
		onBeforeAction: function() {
			var login=Meteor.userId();
			if(login==null){
				var element = document.getElementsByTagName("body");
    		//element.classList.add("bg-dark");
				$('body').addClass('bg-dark')
				console.log(ocument.body.classList)
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
				var element = document.getElementsByTagName("body");
				$('body').addClass('bg-dark')
				//document.body.classList.add='bg-dark';
				console.log(document.body.classList)
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
