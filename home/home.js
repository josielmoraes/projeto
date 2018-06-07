
Router.route('/Inicio',{
	template:'home'
})
Router.route('/',{
	template:'home'
})

if(Meteor.isClient){

	import dataTablesBootstrap from 'datatables.net-bs4';
	import 'datatables.net-bs4/css/dataTables.bootstrap4.css';
	dataTablesBootstrap(window, $);
	Template.menu.helpers({
		'c':function(p){
			console.log(p);
			if(p==0)
				return true;
			else
				return false
		}
	})
}
