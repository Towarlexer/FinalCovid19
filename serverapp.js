//Definición de librerías a usar.

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const systemchild = require("child_process");
const bcryptjs = require('bcryptjs');
const dir = __dirname;
var io = require('socket.io')(server);
var path = require('path');
const Swal = require('sweetalert2');

//Activación del motor de plantillas ejs
app.set('view engine', 'ejs');

//Definición del límite de datos recibidos desde el backend para la parte de GET/POST.

app.use(express.json({limit: '200mb'}));

//Para recibir datos de la etiqueta FORM desde el login.ejs

app.use(express.urlencoded({extended: true}));

//Variable para la librería de sesión

const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//En esta sección se crean las "rutas" para cada archivo del servidor.

app.use("/resources", express.static(path.join(dir, 'src')));

app.get('/', (req, res) =>{
  res.render('index');
});

app.get('/login', (req, res) =>{
  if (req.session.loggedin){
    res.redirect('/dashboard');
  }else{
    res.render('login');
  }
  
});

app.get('/dashboard', (req, res) =>{
  if (req.session.loggedin){
    switch(req.session.rol){
      case 1:
        res.redirect('/dashboard/doctor/home');
        break;
      case 2:
        res.redirect('/dashboard/assistant/home');    
        break;
      case 3:
        res.redirect('/dashboard/admin/home');
        break;
    }
  }else{
    res.redirect('/');
  }
});

//Rutas para el Médico.

app.get('/dashboard/doctor/home', (req, res) =>{
  if (req.session.loggedin){
    if (req.session.rol==1){
      res.sendFile(dir + '/web_modules/medico/home_medico.html');
    }else{
      res.render('access_denied');
    }   
  }else{
      res.redirect('/login');
  }
});

app.get('/dashboard/doctor/cases-search', (req, res) =>{
  if (req.session.loggedin){
    if (req.session.rol==1){
      res.sendFile(dir + '/web_modules/medico/busqueda_medico.html');
    }else{
      res.render('access_denied');
    }   
  }else{
      res.redirect('/login');
  }
});

app.get('/dashboard/doctor/general-map', (req, res) =>{
  if (req.session.loggedin){
    if (req.session.rol==1){
      res.sendFile(dir + '/web_modules/medico/mapa_general_medico.html');
    }else{
      res.render('access_denied');
    }   
  }else{
      res.redirect('/login');
  }
});


//Rutas para el Ayudante.

app.get('/dashboard/assistant/home', (req, res) =>{
  if (req.session.loggedin){
    if (req.session.rol==2){
      res.sendFile(dir + '/web_modules/ayudante/home_ayudante.html');
    }else{
      res.render('access_denied');
    }
  }else{
      res.redirect('/login');
  }
});

app.get('/dashboard/assistant/cases-register', (req, res) =>{
  if (req.session.loggedin){
    if (req.session.rol==2){
      res.sendFile(dir + '/web_modules/ayudante/registro_ayudante.html');
    }else{
      res.render('access_denied');
    }
  }else{
      res.redirect('/login');
  }
});

app.get('/dashboard/assistant/cases-gestion', (req, res) =>{
  if (req.session.loggedin){
    if (req.session.rol==2){
      res.sendFile(dir + '/web_modules/ayudante/gestionar_ayudante.html');
    }else{
      res.render('access_denied');
    }
  }else{
      res.redirect('/login');
  }
});

//Rutas para el Admin.

app.get('/dashboard/admin/home', (req, res) =>{
  if (req.session.loggedin){
    if (req.session.rol==3){
      res.sendFile(dir + '/web_modules/administracion/home_admin.html');
    }else{
      res.render('access_denied');
    } 
  }else{
      res.redirect('/login');
  }
});
app.get('*', (req, res) => {
  res.status(404).render('error')
});

//Apertura del servidor web desde el puerto 8090.

server.listen(8090); 
console.log('Node.js web server listened at port 8090 is running...')

//----------------------------------------------------------Conexión a la base de datos----------------------------------------------------------------------------

//Definición de las variables de entorno.

dotenv = require('dotenv');
const entvar = dotenv.config({path: './env/.env'});
if (entvar.error) {
  throw entvar.error;
}

//Acceso a la base de datos

const mysql = require('mysql2');
const { request } = require('http');
const { response } = require('express');
const { Console } = require('console');
const { resolveSoa } = require('dns');
var con = mysql.createConnection({
  host: entvar.parsed.DB_HOST,      //
  user: entvar.parsed.DB_USER,      //  Variables de entorno (host: dirección de la base de datos, user: usuario que accede a la DB, password: Contraseña del usuario que accede)
  password: entvar.parsed.DB_PASS,  //
  database: entvar.parsed.DB_SCHEMA //
});

//¿Existe una conexión con la base de datos? 

con.connect((err) => {
  if (err) {
    console.log('Hay un error de conexión con la base de datos')
    throw err ; 
  } else {
    console.log('La conexión con la base de datos funciona correctamente.')
    console.log(entvar.parsed); //Muestra las variables de entorno de la base de datos.
  }
})



//Recibe los roles a partir de una consulta a la tabla "rol" en la base de datos

io.on('connection', (socket) => {
  con.query('select* from rol order by 2;', function(err, data){
    if (err) throw err;
    rolsvec = data.map(e=> e.rol); 
    socket.emit('rol', {
      rolsvec : rolsvec
    });
  });  
});

//----------------------------------------------------------Backend del login----------------------------------------------------------------------------

//Consulta en la base de datos el usuario y la contraseña del persona que intenta logear en el sistema.

app.post('/authorization', async (req, res) =>{
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHashed = await bcryptjs.hash(pass, 8);
  if (user && pass){
    con.query('SELECT * FROM administracion WHERE Usuario= ?', [user], async(error, results) =>{
      if(results.length==0 || !(await bcryptjs.compare(pass, results[0].Contraseña))){
        res.render('login',{
          alert: true,
          alertTitle: "Error",
          alertMessage: "Username or Password is wrong",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: 'login'
        })
      } else{
        req.session.loggedin = true;
        req.session.rol= results[0].Rol;
        req.session.user= results[0].Usuario;
        res.render('login',{
          alert: true,
          alertTitle: "Connection Success",
          alertMessage: "You are logged in!",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: 'dashboard'
        })
      }
      res.end("");
    });
  } 
});

//Cierra o destruye la sesión cuando se socilita el "logout".

app.post('/logout', (req, res) =>{
  req.session.destroy(()=>{
    res.redirect('/login')
    res.end("");
  });
})

//Pide el usuario logueado, en caso de que exista.
app.post('/whoislogged', (req, res) =>{
  io.emit('userlogged', { 
    usuario:req.session.user
  });
  res.end("");
})

//----------------------------------------------------------Backend de los módulos----------------------------------------------------------------------------

//Registra los usuarios cuando se invoca el fetch "register" en socket.

app.post ('/register', async function (req, res){ 
  var datos = req.body;
  var cedula = parseInt (datos.cedula); 
  var nombre = datos.nombre; 
  var apellido = datos.apellido; 
  var Usuario= datos.usuario; 
  var contraseña= datos.contraseña; 
  await bcryptjs.hash(contraseña, 8, (error, result)=>{
    var Rol =datos.rol;  
    var Imysql = "INSERT Administracion VALUES("+cedula+",'"+nombre+"','"+apellido+"','"+Usuario+"','"+result+"',"+Rol+")"
    console.log(Imysql)
    con.query(Imysql , function (err) {
      if (err) throw err;
      res.end("");
    })  
  });
}); 



//Envia el caso de los pacientes. (Ayudantes) 

app.post ('/caso',function (req, res){ 
    var datos = req.body;
    var cedula = parseInt (datos.cedula)   ; 
    var nombre = datos.nombre; 
    var apellido = datos.apellido; 
    var direcidencia= datos.recidencia; 
    var dirtrabajo= datos.trabajo; 
    var Fnacimiento =datos.fnaci;
    var Fexamen =datos.fexam
    var sexo =parseInt(datos.sex)
    var Resultado =parseInt(datos.resultado)
       
        
      var Imysql = "INSERT Caso VALUES("+null+",'"+cedula+"','"+nombre+"','"+apellido+"','"+sexo+"','"+Fnacimiento+"','"+direcidencia+"','"+dirtrabajo+"','"+Fexamen+"',"+Resultado+")"
      con.query(Imysql , function (err) {
        if (err) throw err;
        
      })
      console.log('usuario registrado');
      res.end("");
}); 
  

//Recibe busqueda y valor .Devuelve la informacion del cliente.

app.post ('/envcaso',function (req, res){ 
  var datos = req.body;
  var busqueda= datos.est; 
  var valor= datos.bus; 
  if (busqueda=='ID Caso'){
    busqueda = 'id';
    console.log('Se solicitó una búsqueda del caso que tiene la ID='+valor)
  } else{
    console.log('Se solicitó una búsqueda del caso que tiene la Cédula='+valor)
  }
    con.query("SELECT * FROM covid19.caso where covid19.caso."+busqueda+"="+valor+";", function(err, data){
      if (err) throw err;
      if (data[0] != null){
        data =  Object.values(data[0]);
        console.log('Resultado de la búsqueda:');
        console.log(data);
        io.emit('paciente', { 
          informacion:data,
          invalid: false
        });
      } else{
        io.emit('paciente', { 
          informacion:null,
          invalid:true
        });
      }
    });
  res.end(""); 
});


//Envía actualización de estado.

app.post ('/envestado',function (req, res){ 
    var datos = req.body;
    var cedula = parseInt (datos.cedula)   ; 
    var estact= datos.estact; 
    var today= datos.today; 
    var Imysql = "INSERT estado VALUES("+null+",'"+cedula+"','"+today+"','"+estact+"')"
    con.query(Imysql , function (err) {
      if (err) throw err;
    })
    res.end("");
}); 
  
  
//Recibe cedula y devuelve el estado de la persona por fechas.

app.post ('/revestados',function (req, res){    
    var datos = req.body;
    var cedula= datos.cedula; 
    con.query("select DISTINCT t.Estado, t.Fecha, t.Cedula from Covid19.estado t inner join ( select  Estado, max(Fecha) as MaxDate  from Covid19.estado group by Estado  ) tm on t.Estado = tm.Estado and t.Fecha = tm.MaxDate and t.Cedula = "+cedula+" order by Fecha DESC", function(err, data){
      if (err) {return};
      if (data[0] != null){
        data =  Object.values(data);
        console.log('Resultado de la búsqueda:');
        console.log(data);
        io.emit('estadospacientes', { 
          informacion:data,
          invalid: false
        });
      } else{
        io.emit('estadospacientes', { 
          informacion:null,
          invalid:true
        });
      }       
    }); 
    res.end(""); 
});
  
//Búsqueda de pacientes (Doctores)
app.post ('/envdoccaso',function (req, res){ 
  var datos = req.body;
  var busqueda= datos.est; 
  var valor= datos.bus; 
  con.query("SELECT * FROM Covid19.Caso where Covid19.Caso.Cedula="+valor+" and Covid19.Caso.id = "+busqueda, function(err, data){  
    if (err) {throw err};
    if (data[0] != null){
      data =  Object.values(data[0]);
      console.log('Resultado de la búsqueda:');
      console.log(data);
      io.emit('paciente', { 
        informacion:data,
        invalid: false
      });
    } else{
      io.emit('paciente', { 
        informacion:null,
        invalid:true
      });
    }    
  });
  res.end("");
});



//Toda esta sección envía a los graficos de linea...  
  
app.post ('/graph',function (req, res){ 
    con.query('SELECT a.Fechaexamen, COUNT(*) AS num FROM Covid19.Caso AS a GROUP BY a.Fechaexamen ORDER BY a.Fechaexamen;', function(err, dato){
      if (err) throw err;
        dato =  Object.values(dato);
        io.emit('lineagrap', {
          lineadata : dato
        });
      });
  res.end("");  
});
  
app.post ('/piediagram',function (req, res){ 
    con.query('select tabla.numero , tabla.nombre from ( SELECT distinct count(est.Cedula) AS numero,est.Estado as nombre FROM Covid19.estado as est where est.Estado = "Curado" or est.Estado = "Muerte" GROUP BY nombre ORDER BY numero DESC ) as tabla union all select sum(tabla.numero ), "Infectados" from ( SELECT distinct count(est.Cedula) AS numero,est.Estado as nombre FROM Covid19.estado as est GROUP BY nombre ORDER BY numero DESC ) as tabla', function(err, dato){
      if (err) throw err;
      dato =  Object.values(dato);
      io.emit('piegraph', {
        lineadata : dato
      }); 
    });
  res.end("");
});
  
app.post ('/piediagram2',function (req, res){ 
    con.query('select tabla.numero , tabla.nombre from (SELECT distinct count(est.Cedula) AS numero,est.Estado as nombre FROM Covid19.estado as est where est.Estado = "Casa" or est.Estado = "Hospital" or est.Estado = "UCI" or est.Estado = "Muerte" GROUP BY nombre ORDER BY numero DESC ) as tabla', function(err, dato){
      if (err) throw err;
      dato =  Object.values(dato);
      io.emit('piegraph2', {
        lineadata : dato
      });
    });
  res.end("");
});
  
app.post ('/piediagram3',function (req, res){ 
    con.query('SELECT count(da.Cedula) AS total,  s.Resultado FROM Covid19.Caso as da, Covid19.Resultado as s WHERE da.Resultado=s.idResultado group by  s.Resultado', function(err, dato){
      if (err) throw err;
      dato =  Object.values(dato);
      io.emit('piegraph3', {
        lineadata : dato
      });
    });
  res.end("");
});
  
app.post ('/map2',function (req, res){ 
  io.on('connection', function (socket) {
  con.query('select DISTINCT tabla.Estado , cas.Recidencia from ( select DISTINCT t.Estado, t.Fecha, t.Cedula from Covid19.estado t inner join ( select  Cedula, max(Fecha) as MaxDate  from Covid19.estado group by Cedula  ) tm on t.Cedula = tm.Cedula and t.Fecha = tm.MaxDate order by Fecha DESC) as tabla , Covid19.Caso as cas where tabla.Cedula = cas.Cedula union all select tabla.Resultado , tabla.Recidencia from (select DISTINCT t.Resultado, t.Fechaexamen, t.Cedula ,t.Recidencia from Covid19.Caso as t inner join ( select  Cedula, max(Fechaexamen) as MaxDate  from Covid19.Caso group by Cedula  ) tm on t.Cedula = tm.Cedula and t.Fechaexamen = tm.MaxDate where t.Resultado= "2" ) as tabla', function(err, dato){
    
    if (err) throw err;
    
    dato =  Object.values(dato);
   
    io.emit('mapa2', {
      lineadata : dato
    });
  
  });
});
  
});










































  

  

        

  
  