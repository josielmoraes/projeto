Router.route('/restricaoProfessor',{
  template: 'restricaoProfessor'
})

if(Meteor.isClient){
  Template.restricaoProfessor.helpers({
    'perRestricaoProfessor':function(p){
      if(p.permission==1 /*||p.permission==0*/)
      return true;
      else
      return false;
    },
    'diasSemana':function(){
      var dias=['Aulas','Segunda', 'Terca','Quarta','Quinta','Sexta','Sabado'];
      return dias
    },
    'aulas':function(){
      var aulas=['0','1', '2','3','4','5','6','7','8','9','10','11','12','13','14'];
      return aulas
    },
    'criarTabela':function(params){
      if(params==0){
        return true;
      }else {
        return false
      }
    },
    imprimir(aux){
      //console.log(aux);
      if(aux==0){
        return "Matutino 1";
      }else if(aux==1){
        return "Matutino 2";
      }else if(aux==2){
        return "Matutino 3";
      }else if(aux==3){
        return "Matutino 4";
      }else if(aux==4){
        return "Matutino 5";
      }else if(aux==5){
        return "Vespertino 1";
      }else if(aux==6){
        return "Vespertino 2";
      }else if(aux==7){
        return "Vespertino 3";
      }else if(aux==8){
        return "Vespertino 4";
      }else if(aux==9){
        return "Vespertino 5";
      }else if(aux==10){
        return "Vespertino 6";
      }else if(aux==11){
        return "Noturno 1";
      }else if(aux==12){
        return "Noturno 2";
      }else if(aux==13){
        return "Noturno 3";
      }else if(aux==14){
        return "Noturno 4";
      }
    },
    "home":function(){
      Router.go('/')
    },
    "preencherTabela":function(){
      setTimeout(function(){
        var aux=Meteor.userId();
        var u=Meteor.users.findOne({_id:aux.toString})
        var horario=u.profile.horario;
        for(d=1;d<7;d++){
          for(a=0;a<14;a++){
            for(x=0;x<horario.length;x++){
              if(horario[x].dia==d && horario[x].aula==a){
                var i=(d+';'+a);
                var j=document.getElementById(i)
                j.classList.add("red");
              }
            }
          }
        }
      },200)
    }
  })
  Template.restricaoProfessor.events({
    "click .restricao":function(event){
      event.preventDefault();
      event.target.classList.toggle("red")
      var tmp=event.target.classList;
      var array=event.target.id.split(';')
      console.log(Meteor.userId())
      var id=Meteor.userId();
      if(tmp[2]!=null){
        console.log("adicinou");
        console.log(array);
        Meteor.call("adicionarHorario",id,array[0],array[1])
      }else{
        console.log("retirou")
        console.log(array)
        Meteor.call("removerHorario",id,array[0],array[1])
      }
    }
  })
}
if(Meteor.isServer){
  Meteor.methods({
    'adicionarHorario':function(id,dia,aula){
      Meteor.users.update({_id:id},{ $addToSet:{"profile.horario":{dia:dia,aula:aula} } })
    },
    'removerHorario':function(id,dia,aula){
      Meteor.users.update({_id:id},{ $pull:{"profile.horario":{dia:dia,aula:aula}}})
    }
  })
}
