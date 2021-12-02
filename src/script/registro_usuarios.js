var rolv = new Array();
rolv[0] = 'Medico'
rolv[1] = 'Ayudante'
    var lista_select = document.getElementById('rolid');
    for (var i = 0; i<rolv.length; i++){
        var new_opt = document.createElement('option');
        new_opt.value = rolv[i];
        new_opt.innerHTML = rolv[i];
        lista_select.appendChild(new_opt);
      } 

//Enviar

function registro() { 

  var cedula =     document.getElementById('cedula').value;
  var nombre =     document.getElementById('nombre').value;
  var apellido =   document.getElementById('apellido').value;
  var usuario  =   document.getElementById('Usuario').value;
  var contraseña = document.getElementById('contraseña').value;
  var rol =        document.getElementById('rolid').value;
  if (rol=='Medico')
  rol = 1  ; 
  else if (rol=='Ayudante')
  rol = 2 ; 


  const info = { cedula,nombre,apellido,usuario,contraseña,rol};
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(info)
  };
  fetch('/register', options);

} 