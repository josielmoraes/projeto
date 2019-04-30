import OfertaMateria from "../imports/collections/ofertaMateria";
import Sala from "../imports/collections/sala";
import Tabular from 'meteor/aldeed:tabular';
import Prefix from '../imports/prefix.js';
Router.route(Prefix+'/alocarSalaVisao', {
  template: 'alocarSalaVisao',
  name: 'alocarSalaVisao'
})
function hiddenElement(val,bool,color){
  $('.sel').each(function(index){
     if($(this).val()!=val){
       $(this).find("option").each(function(i){

          if($(this).val()==val){
            $(this).attr("disabled",bool)
            $(this).css('color', color);
          }

       })
     }
  })
}
if(Meteor.isClient){
  Template.alocarSalaVisao.onCreated(function(){
    $( document ).ready(function() {
      $(".nav-link").removeClass("active")
      $("#menu_horario").addClass("active");
    });
    var self = this;
      Session.set('aux', false);
      Session.set('salaId',"")
      Session.set('contadorClick',0);
    self.autorun(function() {
      self.subscribe("sala");
      self.subscribe("acharSemetre");
      self.subscribe("buscaProcesso");
      self.subscribe("area");
      self.subscribe("curso");
      self.subscribe("buscaTodasOferta");
      self.subscribe("usuarioProfessor");
    })
  })
  Template.alocarSalaVisao.onDestroyed(function(){
      Session.set('aux', false);
      Session.set('salaId',"")
      Session.set('contadorClick',0);
  })

  Template.alocarSalaVisao.helpers({
    'permissao': function(p) {
      if (p.permission == 0) {
        return true;
      } else if (p.permission == 1 && p.subFuncao == 1) {
        return true;
      } else if(p.permission==2) {
        return true;
      }else{
        return false;
      }
    },
  })
  Template.visaoPorSala.onCreated(function(){
      Session.set('contadorClick',0);
    })
  Template.visaoPorSala.helpers({
    mostrar(){
      if(Session.get('aux')){
        ofertas=OfertaMateria.find({
          Processo:Session.get('processoSelecionado')
        },
        {
          sort:{'Materia.nomeMateria':1}
        }
      ).fetch()
        Session.set('ofertas',ofertas)
      }
      return Session.get('aux');
    },
    mostrarTabela(){
      if(Session.get('salaId')==''){
        return false
      }else{
        return true
      }
    },
    salaFind(){
      let salas=[]
      sala=Sala.findOne({'_id':Session.get('salaId')})
      if(sala!==undefined){
        salas.push(sala)
      }
      return salas
    },
    local(){
      var salas=Sala.find().fetch()
      Session.set('salas',salas);
        var local=[];
        for(sala of salas){
          tmp=local.find(x=> x.local==sala.local)
          if(tmp===undefined) local.push(sala)
        }
        Session.set('local',local);
        Meteor.defer(function(){
          var selectLocal=document.getElementById('local')
          for(l of local){
            opt=document.createElement("option");
            opt.value=l.local;
            opt.text=l.local;
            selectLocal.add(opt)
          }
        })
    },
    'diasSemana': function() {
      var dias = ['Aulas', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];
      return dias
    },
    'aulas': function() {
      var aulas = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
      return aulas
    },  imprimir(aux) {
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
      'criarDiasAulas': function(params) {
        if (params == 0) {
          return true;
        } else {
          return false
        }
      },
      encontrarAula(aula,dia){
        var nomeImprimir=""
        var oferta=OfertaMateria.findOne({
          Processo:Session.get('processoSelecionado'),
          horario: {
            $elemMatch: {
              dia: dia,
              aula: aula,
              'sala._id':Session.get('salaId'),
            }
          }
        })
        if(oferta!==undefined){
          if(oferta.Professor!=''){
            var nomes=oferta.Professor.profile.name.split(" ")

            if(nomes.length>1){
              nomeImprimir=nomes[0]+" "+nomes[nomes.length-1];
            }else{
              nomeImprimir=nomes[0]
            }
          }
          return oferta.Materia.nomeMateria+" "+oferta.Turma+"\n"+oferta.Semestre+" "+oferta.Tipo+"\n"+nomeImprimir
        }
      },
      preencherSelect(){
        setTimeout(function(){
          var ofertas=Session.get('ofertas')
          var salaId=Session.get("salaId")
          for (dia = 1; dia < 7; dia++) {
            for (aula = 0; aula < 12; aula++) {
              var string=dia+"s"+aula
              var element= document.getElementById(string);
              if (element != null) {
                for (i = element.options.length - 1; i >= 0; i--) {
                  element.remove(i);
                }
              }
              option=document.createElement('option');
              option.value="";
              option.text="";
              element.add(option);
              for(oferta of ofertas){
                let select=false
                let option=false
                let contador=0
                for(x=0;x<oferta.horario.length;x++){
                  if(oferta.horario[x].dia==dia && oferta.horario[x].aula==aula && oferta.horario[x].sala._id==salaId){
                    select=true
                  }
                  if(oferta.horario[x].dia==dia && oferta.horario[x].aula==aula ){
                    //option.style.color='red'
                    //option.disabled=true
                    option=true
                  }
                  if(oferta.horario[x].sala!=""){
                    contador++;
                  }
                }

                if(option){
                  if(oferta.Professor!=''){
                    var nomes=oferta.Professor.profile.name.split(" ")

                    if(nomes.length>1){
                      nomeImprimir=nomes[0]+" "+nomes[nomes.length-1];
                    }else{
                      nomeImprimir=nomes[0]
                    }
                  }
                  option=document.createElement('option');
                  option.value=oferta._id;
                  option.id=oferta._id;
                  option.text=oferta.Materia.nomeMateria+" "+oferta.Turma+" "+oferta.Tipo+" "+nomeImprimir
                  option.selected=false;
                    option.style.color='black'


                  if(contador==oferta.horario.length){
                    option.style.color='red'
                    option.disabled=true
                  }
                  if(select){
                    option.selected=true
                  }

                  element.add(option)
                }
              }
              element.disabled=false
            }
          }
        },500)
      }
  })
  Template.visaoPorSala.events({
    'change #local':function(event){
      var local=event.target.value
      var salas=Session.get('salas');
      var selectSala=document.getElementById('sala')
      for(x=selectSala.length-1;x>0;x--){
        selectSala.remove(x)
      }
      for(sala of salas){
        if(sala.local==local){
          opt=document.createElement("option");
          opt.value=sala._id;
          opt.text=sala.apelido+' '+sala.numero;
          selectSala.add(opt)
        }
      }
    },
    'change #sala':function(event){
      var salaId=event.target.value
      Session.set('salaId',salaId)
    },
    'change .sel':function(event){
      var salaid=Session.get('salaId')
      var anterior = Session.get('anterior');
      var val = $(event.target).val();
      var text = $(event.target).find("option:selected").text(); //only time the find is required
      var id = $(event.target).attr('id');
      id = id.split('s');
      var dia = id[0];
      var aula = id[1];
      var find=OfertaMateria.findOne({
        Processo:Session.get("processoSelecionado"),
        horario: {
          $elemMatch: {
            dia: dia,
            aula: aula,
            'sala._id':val
          }
        }
      })
      if(find===undefined){
        if(anterior!=""){
          Meteor.call('removerSala',anterior,dia,aula,function(e,r){
            if(e){

            }else{
              hiddenElement(anterior,false,'black')
            }
          })
        }
        if(val!=""){
          //sala=Sala.findOne({'_id':salaid})
          Meteor.call('alocarSala',val,dia,aula,salaid,function(e,r){
            if(e){

            }
            else{
              oferta=OfertaMateria.findOne({
                _id:val
              })

              contador=0;
              for(x=0;x<oferta.horario.length;x++){
                if(oferta.horario[x].sala!=""){
                  contador++
                }
              }
              if(contador==oferta.horario.length){
                hiddenElement(val,true,'red')
              }
            }
          })
        }
      }else{
      $(event.target).val(anterior)
      }
    },
    'focus .sel': function(event) {
      event.preventDefault();
      var select=$(event.target).find('option:selected')

      if(select.val()==""){
        Session.set('anterior', "")
      }
      Session.set('anterior', select.val())
    }
  })
}
