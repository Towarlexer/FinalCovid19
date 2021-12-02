var marker1;
var marker2;
var uno=false; var dos= false;
let lat = 10.984719;
let long = -74.811302;
let map= L.map('map2').setView([lat, long], 12);  
const apiKey = "AAPK869630e28dbe436297a16b4d99e6f455jRhpYc9MeP2REcf-VhWqO7Lb0b6Y2X4C7wxAhdtIWleLdFTqLrPkdwrAIsrGs5gw";

const basemapEnum = "ArcGIS:Navigation";
L.esri.Vector.vectorBasemapLayer(basemapEnum, {
      apiKey: apiKey
    }).addTo(map);
    geocod=L.esri.Geocoding.geocodeService({apikey: apiKey})


//enviar las busquedas
function caso() { 
    for (var i = 0; i<5; i++) {
      document.getElementById('tb'+(i+1).toString()).innerText ="";
      document.getElementById('te'+(i+1).toString()).innerText ="";
    } 
    if (uno){
      map.removeLayer(marker1);
    }
    if (dos){
      map.removeLayer(marker2);
    }
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
     
     document.getElementById('ta1').innerText = "  ID "
     document.getElementById('ta2').innerText = " Cedula"
     document.getElementById('ta3').innerText = " Nombre"
     document.getElementById('ta4').innerText = " Apellido"
     document.getElementById('ta5').innerText = " Sexo"
     document.getElementById('ta6').innerText = " Fecha nacimiento"

     document.getElementById('ta7').innerText = " Direcciòn residencia "
     document.getElementById('ta8').innerText = " Direcciòn trabajo"
     document.getElementById('ta9').innerText = " Fecha examen"
     document.getElementById('ta10').innerText = "Resultado del examen"
     
     if (!dato.invalid){

      dat = dato.informacion;
      document.getElementById('td1').innerText = dat[0]
      document.getElementById('td2').innerText = dat[1]
      document.getElementById('td3').innerText = dat[2]
      document.getElementById('td4').innerText = dat[3]
      document.getElementById('td5').innerText = dat[4]
      document.getElementById('td6').innerText = dat[5].split('T')[0]
      document.getElementById('td7').innerText = dat[6]
      document.getElementById('td8').innerText = dat[7]
      document.getElementById('td9').innerText = dat[8].split('T')[0]
      if (dat[9]==1) 
      dat[9] = "Positivo"
      else if (dat[9]==2) 
      dat[9] = "Negativo" 
      document.getElementById('td10').innerText = dat[9]
      
      
 
      geocod.geocode().address(dat[6]).city('Barranquilla').region('Atlantico').run(function (err, results, response) {
       if (err) {
               console.log(errs);
               return;
       }
       marker1 = L.circleMarker([results.results[0].latlng.lat,results.results[0].latlng.lng],{color: '#0000FF',radius: 10}).addTo(map).bindPopup("Casa").openPopup(); 
       map.addLayer(marker1);
       uno= true;
            });
 
       geocod.geocode().address(dat[7]).city('Barranquilla').region('Atlantico').run(function (err, results, response) {
             if (err) {
                     console.log(errs);
                     return;
             }
             marker2 = L.circleMarker([results.results[0].latlng.lat,results.results[0].latlng.lng],{color: '#000000',radius: 10}).addTo(map).bindPopup("Trabajo").openPopup(); 
             map.addLayer(marker2);
             dos= true;
                  });

    }else{
  
      document.getElementById('td1').innerText = "N/A";
      document.getElementById('td2').innerText = "N/A";
      document.getElementById('td3').innerText = "N/A";
      document.getElementById('td4').innerText = "N/A";
      document.getElementById('td5').innerText = "N/A";
      document.getElementById('td6').innerText ="N/A";
      document.getElementById('td7').innerText = "N/A";
      document.getElementById('td8').innerText = "N/A";
      document.getElementById('td9').innerText = "N/A";
      document.getElementById('td10').innerText = "N/A";
  
  
    }

    console.log("recibiendo infotmacion ")

});

////datos 
console.log(document.getElementById('td9').innerText.split('-')[2])
////

socket.on('estadospacientes', function (dato){
   
  if (!dato.invalid){

    //organizacion de la informacion ya recibida por el querry
    dat = dato.informacion;


    for (var i = 0; i < dat.length; i++) {
      console.log(i+1)
      document.getElementById('tb'+(i+1).toString()).innerText =dat[i]['Estado']
      document.getElementById('te'+(i+1).toString()).innerText =dat[i]['Fecha'].split('T')[0]
    }

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