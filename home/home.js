
Router.route('/Inicio',
	{
		template:'home',
		onBeforeAction: function() {
			var login=Meteor.userId();
			if(login==null){
				$('body').addClass('bg-dark')
				$('body').removeClass('fixed-nav')
				$('body').removeClass('sticky-footer')
			}else{
				$('body').removeClass('bg-dark')
				$('body').addClass('fixed-nav')
				$('body').addClass('sticky-footer')
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
				$('body').removeClass('fixed-nav')
				$('body').removeClass('sticky-footer')
			}else{
				$('body').removeClass('bg-dark')
				$('body').addClass('fixed-nav')
				$('body').addClass('sticky-footer')
			}

			 this.next();
		},
	}
)

if(Meteor.isClient){

		// dataTablesBootstrap from 'datatables.net-bs4';
	//import 'datatables.net-bs4/css/dataTables.bootstrap4.css';
	//dataTablesBootstrap(window, $);
	Template.menu.onCreated(function(){
		console.log(Meteor.userId())
		if(Meteor.userId()==null){
			$('body').addClass('bg-dark');
		}else{
			$('body').removeClass('bg-dark');
		}
	})
	Template.menu.onDestroyed(function(){
		$('body').removeClass('bg-dark');
	})
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
