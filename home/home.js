
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

	import dataTablesBootstrap from 'datatables.net-bs4';
	import 'datatables.net-bs4/css/dataTables.bootstrap4.css';
	dataTablesBootstrap(window, $);
	Template.menu.onCreated(function(){
		//console.log(Meteor.userId())
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
		'perUsuario':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perDisci':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perProfessor':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perCurso':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perSemestre':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perArea':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perSala':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perHorario':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perData':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perSolicitar':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perAlocarProfessor':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perConfirmar':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perRestricao':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perHorario':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},
		'perSala':function(p){
			//console.log(p);
			if(p.permission==0)
				return true;
			else
				return false
		},

	})
	Template.menu.events({
		'click #sair':function(){
			//console.log('sair')
			Meteor.logout();
		}
	})
}
