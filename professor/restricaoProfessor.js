import Prefix from '../imports/prefix.js';
Router.route(Prefix+'/restricaoProfessor', {
  template: 'restricaoProfessor',
  name:'restricaoProfessor'
})

if (Meteor.isClient) {
  Template.restricaoProfessor.onCreated(function(){
    Session.set("array",[]);
    $( document ).ready(function() {
      $(".nav-link").removeClass("active")
      $("#menu_professor").addClass("active");
    });
  })
  Template.restricaoProfessor.helpers({
    'perRestricaoProfessor': function(p) {
      if (p.permission == 1 ||p.permission==0 )
      return true;
      else
      return false;
    },
    'diasSemana': function() {
      var dias = ['Aulas', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
      return dias
    },
    'aulas': function() {
      var aulas = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
      return aulas
    },
    'criarTabela': function(params) {
      if (params == 0) {
        return true;
      } else {
        return false
      }
    },
    imprimir(aux) {
      //console.log(aux);
      if (aux == 0) {
        return "Matutino 1 - 7h30 às 8h30";
      } else if (aux == 1) {
        return "Matutino 2 - 8h30 às 9h30";
      } else if (aux == 2) {
        return "Matutino 3 - 9h30 às 10h30";
      } else if (aux == 3) {
        return "Matutino 4 - 10h30 às 11h30";
      } else if (aux == 4) {
        return "Matutino 5 - 11h30 às 12h30";
      } else if (aux == 5) {
        return "Vespertino 1 - 12h30 às 13h30";
      } else if (aux == 6) {
        return "Vespertino 2 - 13h30 às 14h30";
      } else if (aux == 7) {
        return "Vespertino 3 - 14h30 às 15h30";
      } else if (aux == 8) {
        return "Vespertino 4 - 15h30 às 16h30";
      } else if (aux == 9) {
        return "Vespertino 5 - 16h30 às 17h30";
      } else if (aux == 10) {
        return "Vespertino 6 - 17h30 às 18h30";
      } else if (aux == 11) {
        return "Noturno 1 - 19h00 às 20h00";
      } else if (aux == 12) {
        return "Noturno 2 - 20h00 às 21h00";
      } else if (aux == 13) {
        return "Noturno 3 - 21h00 às 22h00";
      } else if (aux == 14) {
        return "Noturno 4 - 22h00 às 23h00";
      }
    },
    "home": function() {
      Router.go('home')
    },
    "preencherTabela": function() {
      setTimeout(function() {
        var aux = Meteor.userId();
        var u = Meteor.users.findOne({
          _id: aux.toString
        })
        var horario = u.profile.horario;
        var array=[]
        for (d = 1; d < 7; d++) {
          for (a = 0; a < 14; a++) {
            for (x = 0; x < horario.length; x++) {
              if (horario[x].dia == d && horario[x].aula == a) {
                var i = (d + ';' + a);
                var j = document.getElementById(i)
                j.classList.add("red");
                j=document.getElementById('text'+d+""+a)
                j.value=horario[x].text
              //  $(j).attr("disabled",false)
                array.push({id:d+""+a,d:d.toString(),a:a.toString()})
              }
            }
          }
        }
        Session.set("array",array)
      }, 200)
    }
  })
  Template.restricaoProfessor.events({
    "click .restricao": function(event) {
      event.preventDefault();
      event.stopPropagation();
      var restricao=Session.get("array")
      var pai={}
      var filho={}
      if($(event.target).hasClass('textarea')){
        pai=event.target.parentElement
        filho=event.target
      }else{
        pai=event.target;
        filho=event.target.firstChild;
      }
      var tmp = pai.classList;
      var array = pai.id.split(';')
      var id = Meteor.userId();
      if (!$(pai).hasClass("red")) {
        $(pai).addClass("red")
        restricao.push({id:array[0]+""+array[1],d:array[0],a:array[1]})
        Session.set("array",restricao)
      } else {
        $(pai).removeClass("red")
        var result=restricao.filter((value,i)=>{
          if(value.id != array[0]+""+array[1]){
            return value
          }
        })
        console.log(result)
        $(filho).val("")
        Session.set("array",result)

      }
    },
    'click #finalizar':function(event){
      event.preventDefault();
      var restricao=Session.get("array")
      var out=false
      restricao.forEach((value)=>{

        if(value.a!="" && value.d!=""){
          var id=(value.d+""+value.a).toString();
          if($('#text'+id).val()==""){
            out=true
          }else{
            value.text=$('#text'+id).val()
          }
        }
      })
      if(out){
          Bert.alert("Preencher todas justificativas", 'danger', 'growl-top-right', 'fas fa-times')
        //alert()
      }else{
        var id = Meteor.userId();
        Meteor.call("removerHorario",id)
        restricao.forEach((value)=>{
          Meteor.call("adicionarHorario", id, value.d, value.a,value.text)
        })
        Bert.alert('Restrição alocada com sucesso', 'success', 'growl-top-right', 'fas fa-check')
      }


    }

  })
}
if (Meteor.isServer) {
  Meteor.methods({
    'adicionarHorario': function(id, dia, aula,text) {
      Meteor.users.update({
        _id: id
      }, {
        $addToSet: {
          "profile.horario": {
            dia: dia,
            aula: aula,
            text:text
          }
        }
      })
    },
    'removerHorario': function(id) {
      Meteor.users.update({
        _id: id
      }, {
        $set: {
          "profile.horario": []
        }
      })
    }
  })
}
