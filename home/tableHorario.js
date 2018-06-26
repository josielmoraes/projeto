Router.route('/visualizarHorario',{
  template:'visualizarHorario'
})

if(Meteor.isClient){
  Template.visualizarHorario.onCreated(function(){
    $('body').addClass('bg-dark');
    Session.set('validarTemplate','tableHorario')
  })
  Template.visualizarHorario.onDestroyed(function(){
      $('body').removeClass('bg-dark')
  })
  Template.tableHorario.onCreated(function(){
    Session.set('validarTemplate','tableHorario')
  })
  Template.tableHorario.helpers({
    mostrar(){
      var s=Session.get('aux');
      return Session.get('aux');
    },
    mostrarTabela(){
      var curso=  Session.get("cursoSelecionado");
      var sem=Session.get('periodoSelecionado');
      //console.log(curso)
      if(curso==""){
        Session.set('sairOption',false)
        return false;
      }else{
        if(sem==""){
          Session.set('sairOption',false)
          return false;
        }else{
          Session.set('sairOption',true)
          return true;
        }
      }
    },
  })
  Template.tableHorario.events({
    'change #semestre':function(event){
      var tmp =$('#semestre').val();
      Session.set('periodoSelecionado',tmp)

    }
  })
}
