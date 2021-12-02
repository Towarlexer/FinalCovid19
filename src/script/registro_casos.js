//Datos del dropdown de sexo
var sex = new Array();
sex[0] = 'Masculino'
sex[1] = 'Femenino'
    var lista_select = document.getElementById('sexid');
    for (var i = 0; i<sex.length; i++){
        var new_opt = document.createElement('option');
        new_opt.value = sex[i];
        new_opt.innerHTML = sex[i];
        lista_select.appendChild(new_opt);
      } 


//Datos del dropdown del resultado
var rel = new Array();
      rel[0] = 'Positivo'
      rel[1] = 'Negativo'
          var lista_select2 = document.getElementById('resul');
          for (var i = 0; i<rel.length; i++){
              var new_opt2 = document.createElement('option');
              new_opt2.value = rel[i];
              new_opt2.innerHTML = rel[i];
              lista_select2.appendChild(new_opt2);
            } 


function caso() { 
    var cedula  =   document.getElementById('idcedu').value;
    var nombre = document.getElementById('idnombre').value;
    var apellido  =   document.getElementById('idapellido').value;
    var recidencia  =   document.getElementById('iddirreci').value;
    var trabajo  =   document.getElementById('iddirtra').value;
    var fnaci  =   document.getElementById('idfnaci').value;
    var fexam  =   document.getElementById('idfexam').value;
    var sex  =   document.getElementById('sexid').value;
    var resultado  =   document.getElementById('resul').value;
    if (sex=='Masculino')
    sex = 1  ; 
    else if (sex=='Femenino')
    sex = 2 ;
  
    if (resultado=='Positivo')
    resultado = 1  ; 
    else if (resultado=='negativo')
    resultado = 2 ; 
  
    const info = { cedula,nombre,apellido,recidencia,trabajo,fnaci,fexam,sex,resultado};
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
    };
    fetch('/caso', options);
  
   }