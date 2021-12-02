//Datos del dropdown de busqueda
var est = new Array();
est[0] = 'ID Caso'
est[1] = 'Cedula'
    var lista_select = document.getElementById('resul');
    for (var i = 0; i<est.length; i++){
        var new_opt = document.createElement('option');
        new_opt.value = est[i];
        new_opt.innerHTML = est[i];
        lista_select.appendChild(new_opt);
      } 

//enviar las busquedas
function caso() { 
    var bus= document.getElementById('idbusca').value;
    var est= document.getElementById('resul').value;
    console.log('ID de búsqueda es: ' + bus);
    console.log('Tipo de búsqueda es: ' + est);
    const info = {bus,est};
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
        };
    fetch('/envcaso', options);
    console.log('Se hizo fetch... a /envcaso');

} 
 //mostrar informacion de los pacientes


 var dat = new Array();
 var time = new Array();
 var socket = io() ;

 socket.on('paciente', function (dato){
     dat = dato.informacion;

 
     document.getElementById('ta1').innerText = "  ID "
     document.getElementById('ta2').innerText = " Cedula"
     document.getElementById('ta3').innerText = " Nombre"
     document.getElementById('ta4').innerText = " Apellido"
     document.getElementById('ta5').innerText = " Sexo"
     document.getElementById('ta6').innerText = " Fecha nacimiento"
     document.getElementById('ta7').innerText = " Direcciòn residencia "
     document.getElementById('ta8').innerText = " Direcciòn trabajo"
    
     
     document.getElementById('td1').innerText = dat[0]
     document.getElementById('td2').innerText = dat[1]
     document.getElementById('td3').innerText = dat[2]
     document.getElementById('td4').innerText = dat[3]
     document.getElementById('td5').innerText = dat[4]
     time = dat[5].split('T');
     document.getElementById('td6').innerText = time[0]
     document.getElementById('td7').innerText = dat[6]
     document.getElementById('td8').innerText = dat[7]
    
     console.log("recibiendo infotmacion ")

});



socket.on('estadospacientes', function (dato){
  var tiempo ; 
  //organizacion de la informacion ya recibida por el querry
  dat = dato.informacion;
  console.log ()



  for (var i = 0; i<dat.length; i++) {
    console.log(i+1)
    document.getElementById('tb'+(i+1).toString()).innerText =dat[i]['Estado']
    document.getElementById('te'+(i+1).toString()).innerText =dat[i]['Fecha'].split('T')[0]
 }



});

//enviar el estado del paciente
var estado = new Array();

        estado[0] = 'Casa'
        estado[1] = 'Hospital'
        estado[2] = 'UCI'
        estado[3] = 'Curado'
        estado[4] = 'Muerte'

          var lista_select2 = document.getElementById('idestado');
          for (var i = 0; i<estado.length; i++){
              var new3opt = document.createElement('option');
              new3opt.value = estado[i];
              new3opt.innerHTML = estado[i];
              lista_select2.appendChild(new3opt);
            } 

            
function estador() { 
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; 
  var yyyy = today.getFullYear();
  
  if (dd < 10) {
    dd = '0' + dd;
  }
  
  if (mm < 10) {
    mm = '0' + mm;
  }
  
  today =  yyyy+'-'+mm+'-'+dd;
  

 var cedula  =   document.getElementById('td2').innerText;
 var estact  =   document.getElementById('idestado').value;
console.log(cedula+estact+today);
 const info = {cedula,estact,today};
 const options = {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json'
  },
 body: JSON.stringify(info)
  };
 fetch('/envestado', options);
          
  } 

  function esant(){
    
    var cedula  = document.getElementById('td2').innerText;
    
    const info = {cedula};
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
        };
    fetch('/revestados', options);
    }