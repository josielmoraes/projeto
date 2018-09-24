

Router.route('/Inicio', {
  template: 'home',
  onBeforeAction: function() {
    var login = Meteor.userId();
    if (login == null) {
      $('body').addClass('bg-blue')
      $('body').removeClass('fixed-nav')
      $('body').removeClass('sticky-footer')
    } else {
      $('body').removeClass('bg-blue')
      $('body').addClass('fixed-nav')
      $('body').addClass('sticky-footer')
    }
    this.next();
  }
}, )
Router.route('/', {
  template: 'home',
  onBeforeAction: function() {
    var login = Meteor.userId();
    if (login == null) {
      $('body').addClass('bg-blue')
      $('body').removeClass('fixed-nav')
      $('body').removeClass('sticky-footer')
    } else {
      $('body').removeClass('bg-blue')
      $('body').addClass('fixed-nav')
      $('body').addClass('sticky-footer')
    }

    this.next();
  },
})

if (Meteor.isClient) {

  import dataTablesBootstrap from 'datatables.net-bs4';
  import 'datatables.net-bs4/css/dataTables.bootstrap4.css';
  dataTablesBootstrap(window, $);
  Template.menu.onCreated(function() {
    //console.log(Meteor.userId())
    if (Meteor.userId() == null) {
      $('body').addClass('bg-blue');
    } else {
      $('body').removeClass('bg-blue');
    }
  })
  Template.menu.onDestroyed(function() {
    $('body').removeClass('bg-blue');
  })
  Template.menu.helpers({
    'perUsuario': function(p) {
      //console.log(p);
      if (p.permission == 0)
        return true;
      else
        return false
    },
    'perDisci': function(p) {
      //console.log(p);
      if (p.permission == 0)
        return true;
      else
        return false
    },
    'perProfessor': function(p) {
      //console.log(p);
      if (p.permission == 1 )//||p.permission==0 )
        return true;
      else
        return false
    },
    'perCurso': function(p) {
      //console.log(p);
      if (p.permission == 0)
        return true;
      else
        return false
    },
    'perSemestre': function(p) {
      //console.log(p);
      if (p.permission == 0)
        return true;
      else
        return false
    },
    'perArea': function(p) {
      //console.log(p);
      if (p.permission == 0)
        return true;
      else
        return false
    },
    'perSala': function(p) {
      //console.log(p);
      if (p.permission == 0)
        return true;
      else
        return false
    },
    'perHorario': function(p) {
      console.log(p);
      if (p.permission == 1 && p.subFuncao != 4) {
        return true;
      } else if (p.permission == 0 || p.permission == 2)
        return true;
      else
        return false
    },
    'perData': function(p) {
      //console.log(p);
      if (p.permission == 0) {
        return true;
      } else if (p.permission == 1 && p.subFuncao == 0) {
        return true;
      } else {
        return false;
      }
    },
    'perSolicitar': function(p) {
      //console.log(p);
      if (p.permission == 0) {
        return true;
      } else if (p.permission == 1 && p.subFuncao == 1) {
        return true;
      } else {
        return false;
      }
    },
    'perAlocarProfessor': function(p) {
      //console.log(p);
      if (p.permission == 0) {
        return true;
      } else if (p.permission == 1 && p.subFuncao == 1) {
        return true;
      } else {
        return false
      }
    },
    'perConfirmar': function(p) {
      //console.log(p);
      if (p.permission == 0) {
        return true;
      } else if (p.permission == 1 && p.subFuncao == 0) {
        return true;
      } else {
        return false;
      }
    },
    'perRestricao': function(p) {
      //console.log(p);
      if (p.permission == 0) {
        return true;
      } else if (p.permission == 1 && p.subFuncao == 1) {
        return true;
      } else {
        return false;
      }
    },
    'perCriarHorario': function(p) {
      //console.log(p);
      if (p.permission == 0) {
        return true;
      } else if (p.permission == 1 && p.subFuncao == 1) {
        return true;
      } else {
        return false;
      }
    },
    'perAlocarSala': function(p) {
      //console.log(p);
      if (p.permission == 0) {
        return true;
      } else if (p.permission == 1 && p.subFuncao == 2) {
        return true;
      } else {
        return false;
      }
    },

  })
  Template.menu.events({
    'click #sair': function() {
      //console.log('sair')
      Router.go('/')
      Meteor.logout();
    },

    'click .nav-link': function(event){
      //event.preventDefault();
      //$(".nav-link").removeClass("active")
      //$(event.currentTarget).addClass("active")
    },

    'click .menu_horario a': function(event){
     // event.preventDefault();
      //$(".nav-link").removeClass("active")
     // $('.menu_horario').addClass("active")
    }

  })
}
