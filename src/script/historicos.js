
//enviar las busquedas
function caso() { 
    var bus  =   document.getElementById('idbusca').value;
    var est  =   document.getElementById('resul').value;
    const info = {bus,est};
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
        };
    fetch('/envdoccaso', options);

} 
 //mostrar informacion de los pacientes


 var dat = new Array();
 var time = new Array();
 var socket = io() ;

 socket.on('paciente', function (dato){
     dat = dato.informacion;

 
     //document.getElementById('ta1').innerText = "  ID "
     //document.getElementById('ta2').innerText = " Cedula"
     //document.getElementById('Nombre').innerText = " Nombre"
     //document.getElementById('Apellido').innerText = " Apellido"
     //document.getElementById('sex').innerText = " Sexo"
     //document.getElementById('Nacimiento').innerText = " Fecha nacimiento"

     //document.getElementById('Residencia').innerText = " Direcciòn residencia "
     //document.getElementById('trabajo').innerText = " Direcciòn trabajo"
     //document.getElementById('Fexam').innerText = " Fecha examen"
     //document.getElementById('Resultado').innerText = "Resultado del examen"
     
     document.getElementById('ID').innerText = dat[0]
     document.getElementById('Cedula').innerText = dat[1]
     document.getElementById('Nombre').innerText = dat[2]
     document.getElementById('Apellido').innerText = dat[3]
     document.getElementById('sex').innerText = dat[4]
     document.getElementById('Nacimiento').innerText = dat[5].split('T')[0]
     document.getElementById('Residencia').innerText = dat[6]
     document.getElementById('trabajo').innerText = dat[7]
     document.getElementById('Fexam').innerText = dat[8].split('T')[0]
     if (dat[9]==1) 
     dat[9] = "Positivo"
     else if (dat[9]==2) 
     dat[9] = "Negativo" 
     document.getElementById('Resultado').innerText = dat[9]

});

////datos 
console.log(document.getElementById('td9').innerText.split('-')[2])
////

socket.on('estadospacientes', function (dato){
   
  //organizacion de la informacion ya recibida por el querry
  dat = dato.informacion;


  for (var i = 0; i < dat.length; i++) {
    console.log(i+1)
    document.getElementById('tb'+(i+1).toString()).innerText =dat[i]['Estado']
    document.getElementById('te'+(i+1).toString()).innerText =dat[i]['Fecha'].split('T')[0]
 }



});


            
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
