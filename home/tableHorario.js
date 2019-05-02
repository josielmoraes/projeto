import Prefix from '../imports/prefix.js';
import Materia from "/imports/collections/materia";
import OfertaMateria from "../imports/collections/ofertaMateria";
Router.route(Prefix+'/visualizarHorario', {
  template: 'visualizarHorario',
  name: 'visualizarHorario'
})

function validarMostrar(){
  disciplina=$('#disciplinaSelecionada').val();
  professor=$('#professorSelecionado').val();
  semestr=Session.get('periodoSelecionado');
}
if (Meteor.isClient) {
  Template.visualizarHorario.onCreated(function() {
    $('body').addClass('bg-blue');
    Session.set('validarTemplate', 'tableHorario')
    var self = this;
    self.autorun(function() {
      self.subscribe("acharSemetre");
      self.subscribe("processo");
      self.subscribe('curso');
      self.subscribe("buscaTodasOferta");
      self.subscribe("usuarios")
      self.subscribe("materia");
    })
  })
  Template.visualizarHorario.onDestroyed(function() {
    $('body').removeClass('bg-dark')
    Session.set("aux", false)
  })
  Template.tableHorario.onCreated(function() {
    Session.set('validarTemplate', 'tableHorario')
    Session.set("aux", false)
    Session.set('professorSelcionado','')
    Session.set('disciplinas','')
    Session.set('disciplinasFiltradas','')
    Session.set('professores','')
    Session.set('professorSelecionado','')
    Session.set('disciplinaSelecionada','')
    Session.set('ofertas',[])
    Session.set('ofertasFiltradas',[])
    Session.set('turmas',[])
  })
  Template.tableHorario.helpers({
    mostrar() {
      var s = Session.get('aux');

      /*if(s){
      var array=OfertaMateria.find({Processo:Session.get('processoSelecionado')}).fetch();
      Session.set("ofertasMaterias",array)
    }*/
    return Session.get('aux');
  },
  mostrarTabela() {
    curso = Session.get("cursoSelecionado");
    cursoDoc=Curso.findOne({_id:curso})
    sem = Session.get('periodoSelecionado');
    ofertas=Session.get('ofertas');
    ofertasFiltras=[]
    turma=[]
    disciplina=Session.get('disciplinaSelecionada')
    professor=Session.get('professorSelcionado')
    if( (curso!='' && sem!='') || professor!='' || disciplina!=""){
      ofertasFiltras=ofertas.filter((obj)=>{
        saidaCurso=false
        saidaSemestre=false
        saidaProfessor=false
        saidaDisciplina=false
        if(curso==''){
          saidaCurso=true
        }else{
          saidaCurso= obj.Curso._id==curso ? true:false

        }
        if(sem==''){
          saidaSemestre=true
        }else{
          saidaSemestre= obj.Semestre==sem ? true:false
        }
        if(!saidaCurso && sem!='' ){
          tmp=false
          for(ofertantes of obj.Ofertantes){
            if( ofertantes.curso._id==curso && ofertantes.semestre==sem){
              tmp=true
            }
          }
          saidaCurso=tmp
        }
        if(saidaCurso && saidaSemestre){
          turmaTmp=turma.find((element)=>{
            if(element[2]==obj.Turma[2])
              return obj.Turma
          })
          if(turmaTmp===undefined){
            if(cursoDoc!==undefined){
              turma.push(cursoDoc.sigla+obj.Turma[2])
            }else{
              turma.push(obj.Turma)
            }
          }
        }


        if(disciplina==''){
          saidaDisciplina=true
        }else{
          saidaDisciplina= obj.Materia._id==disciplina ? true:false
        }

        if(professor==''){
          saidaProfessor=true
        }else{
          saidaProfessor= obj.Professor._id==professor ? true:false
        }
        if(saidaCurso && saidaSemestre && saidaDisciplina && saidaProfessor){

          return true
        }
      })
      Session.set('turmas',turma)
      Session.set('ofertasFiltradas',ofertasFiltras)
      return true
    }else{
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
  imprimir(aux) {
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
  'turmaFind':function(){
    cursoid = Session.get("cursoSelecionado");
    turmas=Session.get('turmas')
    disciplina=Session.get('disciplinaSelecionada')
    professor=Session.get('professorSelcionado')

    array=[]
    return turmas
    if(cursoid!=""){

    }else if(disciplina!='' || professor!=''){
      array.push("")
    }

  },
  disciplinaFind(dia,aula,turma){
    ofertas=Session.get('ofertasFiltradas')
    sem = Session.get('periodoSelecionado');
    ofertaFind=ofertas.find((obj)=>{
      for(horario of obj.horario){
        if(horario.dia==dia && horario.aula==aula){
          if(turma=='' || obj.Turma[2]==turma[2]){
            return obj
          }
        }
      }
    })
  if(ofertaFind===undefined){
    return '';
  }else{
    nomeImprimir=""
    if(ofertaFind.Professor!=''){
      var nomes=ofertaFind.Professor.profile.name.split(" ")

      if(nomes.length>1){
        nomeImprimir=nomes[0]+" "+nomes[nomes.length-1];
      }else{
        nomeImprimir=nomes[0]
      }
    }
    for(horario of ofertaFind.horario){
      if(horario.dia==dia && horario.aula==aula){
        if(horario.sala!=''){
          return ofertaFind.Materia.nomeMateria + " " + ofertaFind.Turma + "\n"+ nomeImprimir+" " + horario.sala.local + " "+horario.sala.apelido+" "+ horario.sala.numero
        }else{
          return ofertaFind.Materia.nomeMateria + " " + ofertaFind.Turma + "\n"+ nomeImprimir+" "
        }

      }
    }

  }
  },
  buscarProfessor(){
    sem=Session.get('processoSelecionado');
    curso = Session.get("cursoSelecionado");
    sem = Session.get('periodoSelecionado');
    disciplina=Session.get('disciplinaSelecionada')
    ofertas=Session.get('ofertas');


    professores=[]
    professoresTmp=ofertas.filter((obj)=>{
      saidaCurso=false
      saidaSemestre=false
      saidaDisciplina=false
      if(curso==''){
        saidaCurso=true
      }else{
        saidaCurso= obj.Curso._id==curso ? true:false
      }
      if(sem==''){
        saidaSemestre=true
      }else{
        saidaSemestre= obj.Semestre==sem ? true:false
      }
      if(!saidaCurso && sem!='' ){
        tmp=false
        for(ofertantes of obj.Ofertantes){
          if( ofertantes.curso._id==curso && ofertantes.semestre==sem){
            tmp=true
          }
        }
        saidaCurso=tmp
      }

      if(disciplina==''){
        saidaDisciplina=true
      }else{
        saidaDisciplina= obj.Materia._id==disciplina ? true:false
      }

      if(saidaCurso && saidaSemestre && saidaDisciplina ){
        return true
      }
    })
    for(prof of professoresTmp){
      tmp=professores.find((obj)=>{
        if(obj.Professor._id==prof.Professor._id){
          return obj
        }
      })
      if(tmp===undefined){
        professores.push(prof)
      }
    }
    professores.sort(function(a,b){
      if(a.Professor!='' && b.Professor!=''){
        if(a.Professor.profile.name<b.Professor.profile.name){
          return -1
        }else if(a.Professor.profile.name>b.Professor.profile.name){
          return 1
        }else{
          return 0
        }
      }
    })

    return professores
  },
  preencherProfessor(){
    sem=Session.get('processoSelecionado');
    curso = Session.get("cursoSelecionado");
    sem = Session.get('periodoSelecionado');
    disciplina=Session.get('disciplinaSelecionada')
    setTimeout(function(){
      if(Session.get('professorSelcionado')!='' && $("#professorSelecionado option[value="+Session.get('professorSelcionado')+"]").length>0){
      $("#professorSelecionado option[value="+Session.get('professorSelcionado')+"]").attr('selected', 'selected');
    }else{
      Session.set('professorSelcionado',"")
    }
    },100)
  },
  imprimirProfessor(professor){
    if(professor!=""){
      nomes=professor.profile.name.split(" ");
      nomeImprimir=""
      if(nomes.length>1){
        nomeImprimir=nomes[0]+" "+nomes[nomes.length-1];
      }else{
        nomeImprimir=nomes[0]
      }
      return nomeImprimir;
    }
  },
  preencherDisciplina(){
    sem=Session.get('processoSelecionado');
    curso = Session.get("cursoSelecionado");
    sem = Session.get('periodoSelecionado');
    disciplina=Session.get('professorSelcionado')
    setTimeout(function(){
      if(Session.get('disciplinaSelecionada')!='' && $("#professorSelecionado option[value="+Session.get('disciplinaSelecionada')+"]").length>0){
      $("#disciplinaSelecionada option[value="+Session.get('disciplinaSelecionada')+"]").attr('selected', 'selected');
    }else{
      Session.set('disciplinaSelecionada',"")
    }
    },100)
  },
  buscarDisciplina(){
    sem=Session.get('processoSelecionado');
    curso = Session.get("cursoSelecionado");
    sem = Session.get('periodoSelecionado');
    professor=Session.get('professorSelcionado')
    ofertas=Session.get('ofertas');


    disciplinas=[]
    disciplinasTmp=ofertas.filter((obj)=>{
      saidaCurso=false
      saidaSemestre=false
      saidaProfessor=false
      if(curso==''){
        saidaCurso=true
      }else{
        saidaCurso= obj.Curso._id==curso ? true:false
      }
      if(sem==''){
        saidaSemestre=true
      }else{
        saidaSemestre= obj.Semestre==sem ? true:false
      }
      if(!saidaCurso && sem!='' ){
        tmp=false
        for(ofertantes of obj.Ofertantes){
          if( ofertantes.curso._id==curso && ofertantes.semestre==sem){
            tmp=true
          }
        }
        saidaCurso=tmp
      }

      if(professor==''){
        saidaProfessor=true
      }else{
        saidaProfessor= obj.Professor._id==professor ? true:false
      }

      if(saidaCurso && saidaSemestre && saidaProfessor ){
        return true
      }
    })
    for(disc of disciplinasTmp){
      tmp=disciplinas.find((obj)=>{
        if(obj.Materia._id==disc.Materia._id){
          return obj
        }
      })
      if(tmp===undefined){
        disciplinas.push(disc)
      }
    }
    disciplinas.sort(function(a,b){
        if(a.Materia.nomeMateria<b.Materia.nomeMateria){
          return -1
        }else if(a.Materia.nomeMateria>b.Materia.nomeMateria){
          return 1
        }else{
          return 0
        }

    })
    return disciplinas
  }
})
Template.tableHorario.events({
  'change #semestre': function(event) {
    var tmp = $('#semestre').val();
    Session.set('periodoSelecionado', tmp)
    //$('#professorSelcionado').val('');
    //$('#disciplinaSelecionada').val('');
  },
  'change #professorSelecionado':function(event){
    event.preventDefault();
    value=event.target.value;
    sem=Session.get('processoSelecionado');
    Session.set('professorSelcionado',value)
    if(value!=''){
      ofertas=OfertaMateria.find({Processo:sem,'Professor._id':value},{sort:{'Materia.nomeMateria':1}});
      materias=[];
      for(oferta of ofertas){
        var mat=materias.find(function(element){
          if(element._id==oferta.Materia._id){
            return element
          }
        })
        if(mat===undefined){
          materias.push(oferta.Materia)
        }

      }
      Session.set('disciplinasFiltradas',materias)
    }else{
      Session.set('disciplinasFiltradas',Session.get('disciplinas'))
    }
  },
  'change #disciplinaSelecionada':function(event){
    event.preventDefault();
    Session.set('disciplinaSelecionada',event.target.value)
  }
})
Template.barra.onCreated(function() {
  var self = this;
  Session.set('aux', false);
  self.autorun(function() {
    self.subscribe("acharSemetre");
    self.subscribe("processo");
  })
  //Meteor.subscribe()
})
Template.barra.onDestroyed(function() {
  Session.set('aux', false);
})

Template.barra.helpers({
  mostrar() {
    var s = Session.get('aux');
    return Session.get('aux');
  },
  colorir() {
    setTimeout(function() {
      var processo = Session.get("processoSelecionado");
      var tmp = Processo.findOne({
        _id: processo
      });
      var etapa = tmp.etapas;

      if (etapa == 0) {
        $('#definirDatas').addClass("center_verde");
        $('#solicitarDisciplina').addClass("center_amarelo");
        $('#alocarProfessor').addClass("center_vermelho");
        $('#confirmarProcesso').addClass("center_vermelho");
        $('#restricaoDisciplina').addClass("center_vermelho");
        $('#criarHorario').addClass("center_vermelho");
        $('#alocarAluno').addClass("center_vermelho");
        $('#alocarSala').addClass("center_vermelho");
      } else if (etapa == 1) {
        $('#definirDatas').addClass("center_verde");
        $('#solicitarDisciplina').addClass("center_verde");
        $('#alocarProfessor').addClass("center_amarelo");
        $('#confirmarProcesso').addClass("center_vermelho");
        $('#restricaoDisciplina').addClass("center_vermelho");
        $('#criarHorario').addClass("center_vermelho");
        $('#alocarAluno').addClass("center_vermelho");
        $('#alocarSala').addClass("center_vermelho");
      } else if (etapa == 2) {
        $('#definirDatas').addClass("center_verde");
        $('#solicitarDisciplina').addClass("center_verde");
        $('#alocarProfessor').addClass("center_verde");
        $('#confirmarProcesso').addClass("center_amarelo");
        $('#restricaoDisciplina').addClass("center_vermelho");
        $('#criarHorario').addClass("center_vermelho");
        $('#alocarAluno').addClass("center_vermelho");
        $('#alocarSala').addClass("center_vermelho");
      } else if (etapa == 3) {
        $('#definirDatas').addClass("center_verde");
        $('#solicitarDisciplina').addClass("center_verde");
        $('#alocarProfessor').addClass("center_verde");
        $('#confirmarProcesso').addClass("center_verde");
        $('#restricaoDisciplina').addClass("center_amarelo");
        $('#criarHorario').addClass("center_vermelho");
        $('#alocarAluno').addClass("center_vermelho");
        $('#alocarSala').addClass("center_vermelho");
      } else if (etapa == 4) {
        $('#definirDatas').addClass("center_verde");
        $('#solicitarDisciplina').addClass("center_verde");
        $('#alocarProfessor').addClass("center_verde");
        $('#confirmarProcesso').addClass("center_verde");
        $('#restricaoDisciplina').addClass("center_verde");
        $('#criarHorario').addClass("center_amarelo");
        $('#alocarAluno').addClass("center_vermelho");
        $('#alocarSala').addClass("center_vermelho");
      } else if (etapa == 5) {
        $('#definirDatas').addClass("center_verde");
        $('#solicitarDisciplina').addClass("center_verde");
        $('#alocarProfessor').addClass("center_verde");
        $('#confirmarProcesso').addClass("center_verde");
        $('#restricaoDisciplina').addClass("center_verde");
        $('#criarHorario').addClass("center_verde");
        $('#alocarAluno').addClass("center_amarelo");
        $('#alocarSala').addClass("center_vermelho");
      } else if (etapa == 6) {
        $('#definirDatas').addClass("center_verde");
        $('#solicitarDisciplina').addClass("center_verde");
        $('#alocarProfessor').addClass("center_verde");
        $('#confirmarProcesso').addClass("center_verde");
        $('#restricaoDisciplina').addClass("center_verde");
        $('#criarHorario').addClass("center_verde");
        $('#alocarAluno').addClass("center_verde");
        $('#alocarSala').addClass("center_amarelo");
      }else if (etapa == 7) {
        $('#definirDatas').addClass("center_verde");
        $('#solicitarDisciplina').addClass("center_verde");
        $('#alocarProfessor').addClass("center_verde");
        $('#confirmarProcesso').addClass("center_verde");
        $('#restricaoDisciplina').addClass("center_verde");
        $('#criarHorario').addClass("center_verde");
        $('#alocarAluno').addClass("center_verde");
        $('#alocarSala').addClass("center_verde");
      }

    }, 10)
  }
})
Template.buscaTodosProcesso.helpers({
  'buscaProcessos': function() {
    return Processo.find();
  },
  'buscaAnoSemestres': function(proc) {
    return proc.semestreSelecionado.anoLetivo + "/" + proc.semestreSelecionado.periodoLetivo
  },
})
Template.buscaTodosProcesso.events({
  'change #processoSelecionado': function(event) {
    event.preventDefault()
    var sem = $('#processoSelecionado').val();
    if (sem == "") {
      Session.set('aux', false);
    } else {
      Session.set('aux', true);
      Session.set('processoSelecionado', sem);
      ofertas=OfertaMateria.find({Processo:sem},{sort:{'Materia.nomeMateria':1}}).fetch();
      Session.set('ofertas',ofertas)
      materias=[];
      for(oferta of ofertas){
        var mat=materias.find(function(element){
          if(element._id==oferta.Materia._id){
            return element
          }
        })
        if(mat===undefined){
          materias.push(oferta.Materia)
        }

      }
      Session.set('disciplinas',materias)
      Session.set('disciplinasFiltradas',materias)

    }
  }
})
}
