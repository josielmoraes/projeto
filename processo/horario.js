import OfertaMateria from "../imports/collections/ofertaMateria";
import Tabular from 'meteor/aldeed:tabular';

Router.route('/criarHorario',{
  template:'horario'
})

function criarArrayOferta(turma){
  var pro=Session.get('processoSelecionado');
  var curso=  Session.get("cursoSelecionado");
  var sem=Session.get('periodoSelecionado');
  console.log(pro,curso,sem,turma)
  var array=[" "];
   var tmp=OfertaMateria.find({Processo:pro, Semestre:sem, 'Curso._id':curso,Turma:turma}).fetch();
   for(x=0;x<tmp.length;x++){
     array.push(tmp[x])
   }
   var temp=  OfertaMateria.find({Processo:pro, 'Ofertantes.semestre':sem,'Ofertantes.curso._id':curso}).fetch();
   for(x=0;x<temp.length;x++){
     array.push(temp[x])
   }

   return array;
}

if(Meteor.isClient){
  Template.horario.helpers({
    'permissao':function(valor){
        if(valor==0){
          return true;
        }else {
            Router.go('/')
            return false
          }
      },
    })
    Template.buscaCurso.onCreated(function(){
      Session.set('cursoSelecionado',"");
      Session.set('periodoSelecionado',"")
      Session.set('sairOption',false)
    })
    Template.buscaCurso.onDestroyed(function(){
      Session.set('aux',false)
    })
  Template.buscaCurso.helpers({
    buscaCurso(){
      return Curso.find().fetch()
    }
  })
  Template.buscaCurso.events({
    'change #cursoSelecionado':function(event){
      var tmp= $('#cursoSelecionado').val();
      Session.set("cursoSelecionado",tmp)
      $('#semestre').val("");
      Session.set('periodoSelecionado',"")
    }
  })
  Template.criarHorario.helpers({
    mostrar(){
      var s=Session.get('aux');
      console.log("mo "+s)
      return Session.get('aux');
    },
    mostrarTabela(){
      var curso=  Session.get("cursoSelecionado");
      var sem=Session.get('periodoSelecionado');
      console.log(curso)
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
  Template.criarHorario.events({
    'change #semestre':function(event){
      var tmp =$('#semestre').val();
      Session.set('periodoSelecionado',tmp)

    }
  })
  Template.tabelaHorario.helpers({
    'diasSemana':function(){
      var dias=['Aulas','Segunda', 'Terca','Quarta','Quinta','Sexta','Sabado'];
      return dias
    },
    'aulas':function(){
      var aulas=['0','1', '2','3','4','5','6','7','8','9','10','11'];

      return aulas
    },
    'criarTabela':function(params){
      if(params==0){
        return true;
      }else {
        return false
      }
    },
    turmasTabela(){
      var pro=Session.get('processoSelecionado');
      var curso=  Session.get("cursoSelecionado");
      var sem=Session.get('periodoSelecionado');
      console.log(pro,curso,sem)
      var tmp=[]
      tmp=OfertaMateria.find({Processo:pro,'Curso._id':curso,Semestre:sem}).fetch();
      console.log(tmp)
      var array=[];
      for(x=0;x<tmp.length;x++){
        temp=tmp[x].Turma;
        if(array.length==0){
          array.push(temp)
        }
        var sair=false;
        for(y=0;y<array.length;y++){
          if(array[y]==temp){
            sair=true
          }
        }
        if(sair==false){
          array.push(temp)
        }
      }
      console.log('array turmas ',array, 'tamanha: ',array.length);
        return array
    },
    buscaOferta(a){
      var tmp;
      if(a!=null){
      tmp=criarArrayOferta(a)
      console.log(tmp)

          setTimeout(function(){
          for(dia=1;dia<7;dia++){
            for(aula=0;aula<12;aula++){
                string=dia+'s'+aula+a;
                aux=document.getElementById(string);
                if(aux!=null){
                  //console.log(aux)
                  var i;
                  for(i =aux.options.length - 1 ; i >= 0 ; i--)
                  {
                      aux.remove(i);
                  }
                  for(x=0;x<tmp.length;x++){
                    var option = document.createElement("option");
                    if(x==0){
                    option.text=""
                    option.value=""
                    }else{
                      option.text=tmp[x].Materia.nomeMateria+'/'+tmp[x].Turma
                      option.value=tmp[x]._id;

                      horario=tmp[x].horario;
                      for(y=0;y<horario.length;y++){
                        if(horario[y].dia==dia && horario[y].aula==aula){
                            option.selected=true
                        }
                      }
                    }
                    option.id=dia+';'+aula;
                    aux.add(option)
                  }
                }
              }
          }
        },2)
      }
    },
    condicao( dia, aula,tmp){
      var tmp=Session.get('arrayDrop');
      var posicao=""
      dia=parseInt(dia)
      aula=parseInt(aula)
      setTimeout(function(){
        for(x=1;x<tmp.length;x++){
          horario=tmp[x].horario;
          for(y=0;y<horario.length;y++){
            if(horario[y].dia==dia && horario[y].aula==aula){
              posicao=x
            }
          }
        }
        if(posicao!=""){
          var string=dia+'s'+aula;
          //document.getElementById(string).options[posicao].selected=true
        }
      })
    },
  imprimir(loop){
        console.log("imprimir ",loop)

    },
    imprimir2(tmp){
        //var tmp=Session.get('arrayDrop');
         console.log(tmp)
      }
  })
function validarProfessor(id,dia,aula){
  var pro=Session.get('processoSelecionado');
  var tmpOferta=OfertaMateria.findOne({_id:id});
  dia=parseInt(dia);
  aula=parseInt(aula);
  //console.log(tmpOferta)
  var mat=OfertaMateria.find({'Processo':pro,'Professor._id':tmpOferta.Professor._id,horario:{dia:dia,aula:aula}}).fetch();
  console.log(mat);
  if(mat.length==0){

    return false;
  }else{
    var string='Conflito:\n'
    for(x=0;x<mat.length;x++){
      string+="Professor: "+mat[x].Professor.nome+"Curso: "+mat[x].Curso.nome+" Disc: "+mat[x].Materia.nomeMateria+'\n'
    }
    alert(string)
    return true;
  }
};
function validarRestricao(id,dia,aula){
  var pro=Session.get('processoSelecionado');
  dia=parseInt(dia);
  aula=parseInt(aula)
  var tmpOferta=OfertaMateria.findOne({_id:id});
  var array=tmpOferta.restricao;
  var aux=[];
  if(array!=null){
    for(x=0;x<array.length;x++){
      t=OfertaMateria.findOne({_id:array[x], horario:{dia:dia,aula:aula}})
      if(t!=null){
        aux.push(t)
      }
    }
    if(aux.length!=0){
      var string='Conflito de restrição:\n'
      for(x=0;x<aux.length;x++){
        string+="Professor: "+aux[x].Professor.nome+" Curso: "+aux[x].Curso.nome+" Disc: "+aux[x].Materia.nomeMateria+'\n'
      }
      alert(string)
      return true;
    }else{
      return false
    }
  }else{
    return false
  }

}
function validarMaterias(id,dia,aula){
  var pro=Session.get('processoSelecionado');
  dia=parseInt(dia);
  aula=parseInt(aula)
  var tmpOferta=OfertaMateria.findOne({_id:id});
  console.log(tmpOferta)
  console.log(tmpOferta.Ofertantes);
  var array= tmpOferta.Ofertantes;
  var string=""
  for(x=0;x<array.length;x++){
    //procurar no curso do mesmo semestre das ofertantes senao nao existe conflito
    console.log(array)
    var aux=OfertaMateria.findOne({Processo:pro, 'Curso._id':array[x].curso._id,Semestre:array[x].semestre,horario:{dia:dia,aula:aula}});
    console.log(aux)
    if(aux!=null){
      string+='Conflito de materia:\n';
      console.log(aux.Materia.nomeMateria,aux.Curso.nome)
      string+=aux.Materia.nomeMateria+" Curso: "+aux.Curso.nome;
    }
  }
  if(string!=""){
    alert(string)
    return true
  }
  string=""
  //procurar em todas Ofertas quais ofertantes do mesmo curso e semestre esta no mesmo horario
  var a=OfertaMateria.findOne({Processo:pro,Ofertantes:{$elemMatch:{'curso._id':tmpOferta.Curso._id,semestre:tmpOferta.Semestre}}, horario:{dia:dia,aula:aula}});
  console.log(a)
  if(a!=null){
    string+='Conflito de materia:\n'
    string+=a.Materia.nomeMateria+" Curso: "+a.Curso.nome
    alert(string)
    return true;
  }
  return false
}
  Template.tabelaHorario.events({
    'change .sel':function(event){
      event.preventDefault();
      console.log('change');
      var ant= Session.get('anterior');
      console.log('anterior ',ant)
      console.log(event.target)
        var val = $(event.target).val();
        var text = $(event.target).find("option:selected").text(); //only time the find is required
        var id = $(event.target).find("option:selected").attr('id');
        console.log(val,text,id);
        id=id.split(';');
        var dia= id[0];
        var aula=id[1];

          if(ant==""){
            if(validarProfessor(val ,dia, aula)){
              event.target.options[0].selected=true;
            }else if(validarRestricao(val ,dia, aula)){

              event.target.options[0].selected=true;
            }else if(validarMaterias(val ,dia, aula)){
                event.target.options[0].selected=true;;
            }else{

              Meteor.call('atualizarAula',val ,dia, aula)
            }
          }else if(ant!=val){
              if(val==''){
                  Meteor.call('removerAula',ant,dia,aula);
              }else{
                aux=event.target;
                var posicao="";
                for(x=0;x<event.target.length;x++){
                  if(event.target.options[x].value==ant){
                    posicao=x;
                  }
                }
                if(validarProfessor(val ,dia, aula)){
                  event.target.options[posicao].selected=true;
                }else if(validarRestricao(val ,dia, aula)){

                  event.target.options[posicao].selected=true;
                }else if(validarMaterias(val ,dia, aula)){
                    event.target.options[posicao].selected=true;;

                }else{
                  Meteor.call('removerAula',ant,dia,aula);
                  Meteor.call('atualizarAula',val ,dia, aula)
                }
              }
          }

    },

    'mouseenter .sel':function(event){
      event.preventDefault();
      var val = $(event.target).val()
      Session.set('anterior',val)
      //console.log('open ',val)
    }
  })
}


if(Meteor.isServer){
  Meteor.methods({
    'atualizarAula':function(id,dia,aula){
      dia=parseInt(dia)
      aula=parseInt(aula)
      //console.log('dia',dia,'aula',aula,'t')
      var vetor= new Array()
      vetor[0]={
        dia:dia,
        aula:aula
      }
      OfertaMateria.update({_id:id},{$addToSet:{horario:{dia:dia,aula:aula}} })
    },
    'removerAula':function(id,dia,aula){
      dia=parseInt(dia)
      aula=parseInt(aula)
      var tmp= OfertaMateria.findOne({_id:id});

      array=tmp.horario;
      var posicao=""
        console.log(array)
      for(x=0;x<array.length;x++){
        console.log(array[x].dia)
        if(array[x].dia==dia && array[x].aula==aula){
          posicao=x
        }
      }
      var string= ('horario.'+posicao)
      console.log(string)
      OfertaMateria.update({_id:id},{$pull:{horario:{dia:dia,aula:aula}} })
    }
  })
}
