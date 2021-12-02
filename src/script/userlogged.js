setTimeout(()=>{
    const info = {};
    const options = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
    },
    body: JSON.stringify(info)
    };
    fetch('/whoislogged', options);
}, 150);

io().on('userlogged', (dato)=>{
    document.getElementById("usuarioconectado").innerText=dato.usuario;
    console.log('Logged User= '+ dato.usuario);
    document.getElementById("container-usuario").style.display="block";
});

function confirmlogout(){

    Swal.fire({
        title: '¿Está seguro?',
        text: "Al confirmar este mensaje, usted saldrá de su cuenta.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, deseo salir!'
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
            'Confirmed!',
            'You have logged out.',
            'success',
            )
            setTimeout(()=>{document.getElementById('logout').submit();},1500)
        }
    })

}