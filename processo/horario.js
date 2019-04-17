import OfertaMateria from "../imports/collections/ofertaMateria";
import Sala from "../imports/collections/sala";
import Tabular from 'meteor/aldeed:tabular';
import Prefix from '../imports/prefix.js';
Router.route(Prefix+'/criarHorario', {
  template: 'horario',
  name: 'criarHorario'
})

function criarArrayOferta(turma) {
  var pro = Session.get('processoSelecionado');
  var curso = Session.get("cursoSelecionado");
  var sem = Session.get('periodoSelecionado');
  console.log(pro,curso,sem,turma)
  var array = [];
  var tmp = OfertaMateria.find({
    Processo: pro,
    Semestre: sem.toString(),
    'Curso._id': curso,
    Turma: turma
  }).fetch();
  //console.log(tmp)
  for (x = 0; x < tmp.length; x++) {
    //console.log(tmp[x])
    filter=array.filter((obj)=>{
      if(obj.oferta.Materia.nomeMateria==tmp[x].Materia.nomeMateria && obj.oferta.Turma==tmp[x].Turma && obj.oferta.Tipo==tmp[x].Tipo)
      return obj
    })
    if(filter.length>1){
      //console.log(tmp[x],filter.length)
      for(y=0;y<filter.length;y++){
        filter[x].contador++;
      }
      array.push({"oferta":tmp[x], 'contador':filter[filter.length-1].contador+1})
    }else if(filter.length==1){
      filter[0].contador++;
      array.push({"oferta":tmp[x], 'contador':filter[0].contador+1})
    }else{
      array.push({"oferta":tmp[x], 'contador':0})
    }
  }
  /*tmp = OfertaMateria.find({
    Processo: pro,
    "Turma":{$regex: turma[2]},
    "Ofertantes":{
      $elemMatch:{
        "curso._id":curso,
        "semestre":sem}
      }

  }).fetch();
  for (x = 0; x < tmp.length; x++) {
    filter=array.filter((obj)=>{
      if(obj.oferta.Materia.nomeMateria==tmp[x].Materia.nomeMateria && obj.oferta.Turma==tmp[x].Turma && obj.oferta.Tipo==tmp[x].Tipo)
      return obj
    })
    if(filter.length>1){
      for(y=0;y<filter.length;y++){
        filter[x].contador++;
      }
      array.push({"oferta":tmp[x], 'contador':filter[filter.length-1].contador+1})
    }else if(filter.length==1){
      filter[0].contador++;
      array.push({"oferta":tmp[x], 'contador':filter[0].contador+1})
    }else{
      array.push({"oferta":tmp[x], 'contador':0})
    }
  }*/
  return array;
}

if (Meteor.isClient) {
  Template.horario.onDestroyed(function() {
    Session.set('aux', false);
  })
  Template.horario.onCreated(function() {
    Session.set('aux', false);
    $( document ).ready(function() {
      $(".nav-link").removeClass("active")
      $("#menu_horario").addClass("active");
    });
    var pro = Session.get('processoSelecionado');
    var self = this;
    self.autorun(function() {
      self.subscribe("acharSemetre");
      self.subscribe("buscaProcesso");
      self.subscribe("buscaTodasOferta");
      self.subscribe("curso");
    })
  })
  Template.horario.helpers({
    'permissao': function(valor) {
      if (valor.permission == 0) {
        return true;
      } else if(valor.permission==1 && valor.subFuncao==1) {
        return true;
      }else{
        Router.go('home')
        return false
      }
    },
  })
  Template.buscaCurso.onCreated(function() {
    Session.set('cursoSelecionado', "");
    Session.set('periodoSelecionado', "")
    Session.set('sairOption', false)
  })
  Template.buscaCurso.onDestroyed(function() {
    Session.set('aux', false)
  })
  Template.buscaCurso.helpers({
    buscaCurso() {
      return Curso.find().fetch()
    }
  })
  Template.buscaCurso.events({
    'change #cursoSelecionado': function(event) {
      var tmp = $('#cursoSelecionado').val();
      Session.set("cursoSelecionado", tmp)
      $('#semestre').val("");
      Session.set('periodoSelecionado', "")
    }
  })
  Template.criarHorario.onCreated(function() {
    Session.set('validarTemplate', 'criarHorario')
    var processo=Session.get('processoSelecionado');

  })
  Template.criarHorario.helpers({
    mostrar() {
      var s = Session.get('aux');
      return Session.get('aux');
    },
    mostrarTabela() {
      var curso = Session.get("cursoSelecionado");
      var sem = Session.get('periodoSelecionado');
      console.log(curso,sem)
      if (curso == "") {
        Session.set('sairOption', false)
        return false;
      } else {
        if (sem == "") {
          Session.set('sairOption', false)
          return false;
        } else {
          Session.set('sairOption', true)
          return true;
        }
      }
    },


  })
  Template.criarHorario.events({
    'click #finalizarHorario':function(event){
      event.preventDefault();
      Meteor.call('mudarEtapa', Session.get('processoSelecionado'), 5, function(e, r) {
        if (e) {

        } else {
          Session.set('aux', false);
          Session.set('processoSelecionado', "");
          Bert.alert("Criação de horário realizada com sucesso", 'default', 'growl-top-right', 'fa-bell')
        }
      })
    },
    'change #semestre': function(event) {
      var tmp = $('#semestre').val();
      Session.set('periodoSelecionado', tmp)

    }
  })

  Template.tabelaHorario.helpers({
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
    'mostrarHorario': function() {
      var tmp = Session.get('validarTemplate')
      if (tmp == "tableHorario") {
        return true
      } else {
        return false
      }
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
    'imprimirSala': function(saida, d, a) {
      var horario = saida.horario;
      for (x = 0; x < horario.length; x++) {
        if (horario[x].dia == d && horario[x].aula == a) {
          if (horario[x].sala != "") {
            return saida.Materia.nomeMateria + " " + saida.Turma + " \n" + horario[x].sala.local + " " + horario[x].sala.numero
          } else {
            return saida.Materia.nomeMateria + " " + saida.Turma;
          }
        }
      }
    },
    turmasTabela() {
      var pro = Session.get('processoSelecionado');
      var curso = Session.get("cursoSelecionado");
      var sem = Session.get('periodoSelecionado');
      //console.log(pro,curso,sem)
      var tmp = []
      tmp = OfertaMateria.find({
        Processo: pro,
        'Curso._id': curso,
        Semestre: sem
      }).fetch();
      //console.log(tmp)
      var array = [];
      for (x = 0; x < tmp.length; x++) {
        temp = tmp[x].Turma;
        if (array.length == 0) {
          array.push(temp)
        }
        var sair = false;
        for (y = 0; y < array.length; y++) {
          if (array[y] == temp) {
            sair = true
          }
        }
        if (sair == false) {
          array.push(temp)
        }
      }
      //console.log('array turmas ',array, 'tamanha: ',array.length);
      return array
    },
    'validarTemplate': function() {
      var tmp = Session.get('validarTemplate')
      //console.log(tmp)

      if (tmp == "criarHorario") {
        return true
      } else {
        return false
      }
    },

    buscaOferta(a) {
      var tmp;
      var curso = Session.get("cursoSelecionado");
      if (a != null) {
        tmp = criarArrayOferta(a)
        console.log("aa",tmp)
        setTimeout(function() {
          for (dia = 1; dia < 7; dia++) {
            for (aula = 0; aula < 15; aula++) {
              string = dia + 's' + aula + a;
              aux = document.getElementById(string);
              if (aux != null) {
                //console.log(aux)
                var i;
                for (i = aux.options.length - 1; i >= 0; i--) {
                  aux.remove(i);
                }
                let optionNull= document.createElement("option");
                optionNull.text = ""
                optionNull.value = ""
                optionNull.id = dia + ';' + aula;
                aux.add(optionNull)
                for (x = 0; x < tmp.length; x++) {
                  let option = document.createElement("option");
                    if(tmp[x].contador>0){
                      option.text = tmp[x].oferta.Materia.nomeMateria + '/' + tmp[x].oferta.Tipo+" "+tmp[x].contador
                    }else{
                    option.text = tmp[x].oferta.Materia.nomeMateria + '/' + tmp[x].oferta.Tipo
                    }
                    if(tmp[x].oferta.Curso._id!=curso){
                      option.text+="/ "+tmp[x].oferta.Turma
                    }
                    option.value = tmp[x].oferta._id;
                    horario = tmp[x].oferta.horario;
                    for (y = 0; y < horario.length; y++) {
                      if (horario[y].dia == dia && horario[y].aula == aula) {
                        option.selected = true
                      }
                    }
                  option.id = dia + ';' + aula;
                  aux.add(option)
                }
              }
            }
          }
        }, 2)
      }
    },
    buscarSala(a) {

      Session.get('periodoSelecionado')
      var tmp = [" "]
      var aux = Sala.find().fetch()
      for (x = 0; x < aux.length; x++) {
        tmp.push(aux[x])
      }
      setTimeout(function() {
        for (dia = 1; dia < 7; dia++) {
          for (aula = 0; aula < 12; aula++) {
            string = dia + 's' + aula + a;
            aux = document.getElementById(string);
            if (aux != null) {
              var sa = aux.parentNode.children[0].id;
              var ofertaM = OfertaMateria.findOne({
                _id: sa
              })
              var i;
              for (i = aux.options.length - 1; i >= 0; i--) {
                aux.remove(i);
              }
              for (x = 0; x < tmp.length; x++) {
                var option = document.createElement("option");
                if (x == 0) {
                  option.text = ""
                  option.value = ""
                } else {
                  option.text = tmp[x].local + " " + tmp[x].numero;

                  for (y = 0; y < ofertaM.horario.length; y++) {
                    if (ofertaM.horario[y].sala != "") {
                      if (tmp[x]._id == ofertaM.horario[y].sala._id && ofertaM.horario[y].dia == dia && ofertaM.horario[y].aula == aula) {
                        //console.log('achou')
                        //console.log(tmp[x])
                        option.selected = true
                      }
                    }
                  }
                  option.value = tmp[x]._id;
                }
                option.id = dia + ';' + aula;
                aux.add(option)
              }
            }
          }
        }
      }, 100)
    },
    buscarValido(dia, aula, turma) {
      var pro = Session.get('processoSelecionado');
      var curso = Session.get("cursoSelecionado");
      var sem = Session.get('periodoSelecionado');
      //var ofertas=  Session.get("ofertasMaterias")
      Session.set('validarLabel', "")
      dia = parseInt(dia)
      aula = parseInt(aula)
      var array = new Array()
      /*array =ofertas.filter((obj)=>{
        if(obj.Curso._id==curso &&  obj.Semestre==sem && obj.Turma==turma){
          for(let horario of obj.horario){
            if(horario.dia==dia && horario.aula==aula)
              return obj
          }
        }
      })
      if(array.length==0){
        array=ofertas.filter((obj)=>{
          for(let ofertante of obj.Ofertantes){
            if(ofertante.curso._id==curso && ofertante.semestre==sem && obj.Turma[2]==turma[2] ){
              for(let horario of obj.horario){
                if(horario.dia==dia && horario.aula==aula)
                  return obj
              }
            }
          }
        })
      }*/

      var tmp = OfertaMateria.findOne({
        Processo: pro,
        'Curso._id': curso,
        Semestre: sem,
        Turma: turma,
        horario: {
          $elemMatch: {
            dia: dia,
            aula: aula
          }
        }
      });
      //console.log('validar ',tmp)
      if (tmp != null) {
        array.push(tmp)
      }else{
        tmp2 = OfertaMateria.findOne({
          Processo: pro,
          "Turma":{$regex: turma[2]},
          Ofertantes:{
            $elemMatch:{
              'curso._id':curso,
              'semestre':sem
            }
          },
          horario: {
            $elemMatch: {
              dia: dia,
              aula: aula
            }
          }
        });
        if (tmp2 != null) {
          //console.log(tmp2)
          //if(tmp2.Turma[2]==turma[2])
           array.push(tmp2)
        }
      }
      return array

    },

  })

  function validarProfessor(id, dia, aula) {
    var pro = Session.get('processoSelecionado');
    var tmpOferta = OfertaMateria.findOne({
      _id: id
    });
    dia = parseInt(dia);
    aula = parseInt(aula);
    if(tmpOferta!=null){
      if(tmpOferta.Professor!=""){
        var mat = OfertaMateria.find({
          'Processo': pro,
          'Professor._id': tmpOferta.Professor._id,
          horario: {
            $elemMatch: {
              dia: dia,
              aula: aula
            }
          }
        }).fetch();
        if (mat.length == 0) {

          return false;
        } else {
          var string = 'Conflito:\n'
          for (x = 0; x < mat.length; x++) {
            string += "Professor: " + mat[x].Professor.profile.name + " Curso: " + mat[x].Curso.nome + " Disc: " + mat[x].Materia.nomeMateria + '\n'
          }
          //alert(string)
          Bert.alert({
            message: string,
            type: 'danger',
            style: 'growl-top-right',
            hideDelay: 10000,
          });
          return true;
        }
      }}
    };

    function validarRestricaoProfessor(id, dia, aula) {
      var tmpOferta = OfertaMateria.findOne({
        _id: id
      });
      if(tmpOferta!=null){
        var professor=tmpOferta.Professor;
        if(professor!=""){
          var horario = professor.profile.horario;
          if (horario != null) {
            for (x = 0; x < horario.length; x++) {
              if (horario[x].dia == dia && horario[x].aula == aula) {
                console.log("entrou");
                var tmp = confirm("Horário que o professor nao gostaria de ministrar aula. Deseja manter a disciplina nesse horário?");
                console.log(tmp);
                return tmp
              }
            }
          }
        }
      }
      return true;
    }

    function validarRestricao(id, dia, aula) {
      //validar com as restrições
      var pro = Session.get('processoSelecionado');
      dia = parseInt(dia);
      aula = parseInt(aula)
      var tmpOferta = OfertaMateria.findOne({
        _id: id
      });
      var array = tmpOferta.restricao;
      var aux = [];
      if (array != null) {
        for (x = 0; x < array.length; x++) {
          t = OfertaMateria.findOne({
            _id: array[x],
            horario: {
              $elemMatch: {
                dia: dia,
                aula: aula
              }
            }
          })
          if (t != null) {
            aux.push(t)
          }
        }
        if (aux.length != 0) {
          var string = 'Conflito de restrição:\n'
          for (x = 0; x < aux.length; x++) {
            string += "Professor: " + aux[x].Professor.profile.name + " Curso: " + aux[x].Curso.nome + " Disc: " + aux[x].Materia.nomeMateria + '\n'
          }
          //alert(string)
          Bert.alert({
            message: string,
            type: 'danger',
            style: 'growl-top-right',
            hideDelay: 10000,
          });
          return true;
        } else {
          return false
        }
      } else {
        return false
      }

    }

    function validarMaterias(id, dia, aula) {
      var pro = Session.get('processoSelecionado');
      dia = parseInt(dia);
      aula = parseInt(aula)
      var tmpOferta = OfertaMateria.findOne({
        _id: id
      });
      //console.log(tmpOferta)
      //console.log(tmpOferta.Ofertantes);
      var array = tmpOferta.Ofertantes;
      var string = ""
      for (x = 0; x < array.length; x++) {
        //procurar no curso do mesmo semestre das ofertantes senao nao existe conflito
        //console.log(array)
        var aux = OfertaMateria.findOne({
          Processo: pro,
          'Curso._id': array[x].curso._id,
          Semestre: array[x].semestre,
          "Turma":{$regex: tmpOferta.Turma[2]},
          horario: {
            $elemMatch: {
              dia: dia,
              aula: aula
            }
          }
        });
        //console.log(aux)
        if (aux != null) {
          string += 'Conflito de materia:\n';
          //console.log(aux.Materia.nomeMateria,aux.Curso.nome)
          string += aux.Materia.nomeMateria + " Curso: " + aux.Curso.nome;
        }
      }
      if (string != "") {
        //alert(string)
        Bert.alert({
          message: string,
          type: 'danger',
          style: 'growl-top-right',
          hideDelay: 10000,
        });
        return true
      }
      string = ""
      //procurar em todas Ofertas quais ofertantes do mesmo curso e semestre esta no mesmo horario
      var a = OfertaMateria.findOne({
        Processo: pro,
        "Turma":{$regex: tmpOferta.Turma[2]},
        Ofertantes: {
          $elemMatch: {
            'curso._id': tmpOferta.Curso._id,
            semestre: tmpOferta.Semestre
          }
        },
        horario: {
          $elemMatch: {
            dia: dia,
            aula: aula
          }
        }
      });
      //console.log(a)
      if (a != null) {
        string += 'Conflito de materia:\n'
        string += a.Materia.nomeMateria + " Curso: " + a.Curso.nome
        //alert(string)
        Bert.alert({
          message: string,
          type: 'danger',
          style: 'growl-top-right',
          hideDelay: 10000,
        });
        return true;
      }
      return false
    }

    function validarSala(id, dia, aula, sala) {
      var pro = Session.get('processoSelecionado');
      dia = parseInt(dia);
      aula = parseInt(aula)
      var tmp = OfertaMateria.findOne({
        Processo: pro,
        horario: {
          $elemMatch: {
            dia: dia,
            aula: aula,
            'sala._id': sala
          }
        }
      })
      //console.log('validar sala',sala)
      if (tmp != null) {
        //alert('Sala utilizada pela disciplina ' + tmp.Materia.nomeMateria + " do " + tmp.Semestre + "º semestre do curso " + tmp.Curso.nome)
        let string='Sala utilizada pela disciplina ' + tmp.Materia.nomeMateria + " do " + tmp.Semestre + "º semestre do curso " + tmp.Curso.nome;
        Bert.alert({
          message: string,
          type: 'danger',
          style: 'growl-top-right',
          hideDelay: 10000,
        });
        return false
      } else {
        return true
      }
    }
    Template.tabelaHorario.events({
      'change .sel': function(event) {
        event.preventDefault();
        var tmp = Session.get('validarTemplate')
        if (tmp == "criarHorario") {
          var ant = Session.get('anterior');
          var val = $(event.target).val();
          var text = $(event.target).find("option:selected").text(); //only time the find is required
          var id = $(event.target).find("option:selected").attr('id');
          //console.log(val,text,id);
          id = id.split(';');
          var dia = id[0];
          var aula = id[1];

          if (ant == "") {
            if (!validarRestricaoProfessor(val, dia, aula)) {
              event.target.options[0].selected = true;
            } else if (validarProfessor(val, dia, aula)) {
              event.target.options[0].selected = true;
            } else if (validarRestricao(val, dia, aula)) {

              event.target.options[0].selected = true;
            } else if (validarMaterias(val, dia, aula)) {
              event.target.options[0].selected = true;;
            } else {

              Meteor.call('atualizarAula', val, dia, aula,function(e,r){
                if(e){
                  //alert("Número excedente de aula")
                  Bert.alert({
                    message: "Número excedente de aula",
                    type: 'danger',
                    style: 'growl-top-right',
                    hideDelay: 10000,
                  });
                  event.target.options[0].selected = true;
                }
              })

            }
          } else if (ant != val) {
            if (val == '') {
              Meteor.call('removerAula', ant, dia, aula);
            } else {
              console.log("aqui")
              Meteor.call('removerAula', ant, dia, aula,function(e,r){
                if(e){
                  console.log(e)
                }else{
                  console.log(r);

                  aux = event.target;
                  var posicao = "";
                  for (x = 0; x < event.target.length; x++) {
                    if (event.target.options[x].value == ant) {
                      posicao = x;
                    }
                  }
                  if (!validarRestricaoProfessor(val, dia, aula)) {
                    event.target.options[posicao].selected = true;
                  }
                  if (validarProfessor(val, dia, aula)) {
                    event.target.options[posicao].selected = true;
                  } else if (validarRestricao(val, dia, aula)) {
                    event.target.options[posicao].selected = true;
                  } else if (validarMaterias(val, dia, aula)) {
                    event.target.options[posicao].selected = true;;

                  } else {

                    Meteor.call('atualizarAula', val, dia, aula,function(e,r){
                      if(e){
                        //alert("Número excedente de aula")
                        Bert.alert({
                          message: string,
                          type: 'danger',
                          style: 'growl-top-right',
                          hideDelay: 10000,
                        });
                        event.target.options[0].selected = true;
                      }
                    })
                  }
                }
              });
            }
          }
        } else {
          var ant = Session.get('anterior');
          var val = $(event.target).val();
          var text = $(event.target).find("option:selected").text();
          var id = $(event.target).find("option:selected").attr('id');
          id = id.split(';');
          var dia = id[0];
          var aula = id[1];
          id = event.target.parentNode.children[0].id
          if (ant == "") {
            //console.log('anterior vazio')
            if (validarSala(id, dia, aula, val)) {
              Meteor.call('alocarSala', id, dia, aula, val);
            } else {
              event.target.options[0].selected = true;
            }
          } else {

            if (val == "") {
              Meteor.call('removerSala', id, dia, aula);
            } else {
              aux = event.target;
              var posicao = "";
              for (x = 0; x < event.target.length; x++) {
                if (event.target.options[x].value == ant) {
                  posicao = x;
                }
              }
              if (validarSala(id, dia, aula, val)) {
                Meteor.call('alocarSala', id, dia, aula, val);
              } else {
                event.target.options[posicao].selected = true;
              }
            }
          }
        }
      },

      'focus .sel': function(event) {
        event.preventDefault();
        var val = $(event.target).val()
        Session.set('anterior', val)
      }
    })
  }


  if (Meteor.isServer) {
    Meteor.methods({
      'atualizarAula': function(id, dia, aula) {
        dia = parseInt(dia)
        aula = parseInt(aula)
        //console.log('dia',dia,'aula',aula,'t')
        var vetor = new Array()
        vetor[0] = {
          dia: dia,
          aula: aula
        }
        let mat=  OfertaMateria.findOne({ _id: id })
        if(mat.horario.length<mat.aulaSemanal){
          OfertaMateria.update({
            _id: id
          }, {
            $addToSet: {
              horario: {
                dia: dia,
                aula: aula,
                sala: ""
              }
            }
          })

        }else{
          throw new Meteor.Error('qtde_aula', "Quantidade de aulas");
        }
      },
      'removerAula': function(id, dia, aula) {
        dia = parseInt(dia)
        aula = parseInt(aula)
        return OfertaMateria.update({
          _id: id
        }, {
          $pull: {
            horario: {
              dia: dia,
              aula: aula
            }
          }
        })
      },
      'alocarSala': function(id, dia, aula, sala) {
        dia = parseInt(dia);
        aula = parseInt(aula)
        var sala = Sala.findOne({
          _id: sala
        })
        //console.log(sala,dia,aula)
        var resul = OfertaMateria.update({
          _id: id,
          horario: {
            $elemMatch: {
              dia: dia,
              aula: aula
            }
          }
        }, {
          $set: {
            "horario.$.sala": sala
          }
        })
        //console.log(resul)
      },
      'removerSala': function(id, dia, aula) {
        dia = parseInt(dia);
        aula = parseInt(aula);
        var resul = OfertaMateria.update({
          _id: id,
          horario: {
            $elemMatch: {
              dia: dia,
              aula: aula
            }
          }
        }, {
          $set: {
            "horario.$.sala": ""
          }
        })
        //console.log(resul)
      }
    })
  }
