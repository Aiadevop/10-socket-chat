//FRONTEND

const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8090/api/auth/'
            : 'https://socketchat-restserver.herokuapp.com/api/auth/';

let usuario = null;
let socket  = null;

// txtUid
// txtMensaje
// ulUsuarios
// ulMensajes
// btnSalir

const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');


const validarJWT = async() => {
    
    const token = localStorage.getItem('token') || '';

    if(token.length <=10 ) {
        window.location= 'index.html'
        throw new Error ('No hay token en el servidor.')
    }

    const resp = await fetch (url, {
        headers: {'x-token': token}
    })
    
    const {usuario : userDB, token: tokenDB} = await resp.json ();
    console.log(userDB, tokenDB);
    //Guardamos el nuevo token
    localStorage.setItem('token', tokenDB);
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();

}

const conectarSocket = async() => {
    
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () =>{
        console.log('Sockets online')
    });

    socket.on('disconnect', () =>{
        console.log('Sockets offline') 
    });  

    socket.on('recibir-mensajes', (payload)=>{
        dibujarMensajes(payload)
    })
    
    socket.on('usuarios-activos', (payload)=>{
        //console.log(payload);
        dibujarUsuarios(payload)
    })

    socket.on('mensaje-privado', ({de, mensaje})=>{
        //console.log('Privado: ',payload);
        let mensajesHtml = '';
        mensajesHtml = `
            <li>
                <p>
                    <span class= "text-primary">Privado: ${de} :</span>
                    <span class="fs-6" text-muted>${mensaje}</span>
                </p>
            </li>
        `
        ulMensajes.innerHTML = mensajesHtml;
    })
    
    
}

const dibujarUsuarios = (usuarios = []) =>{
    let usersHtml = '';
    usuarios.forEach( /*user*/({nombre,uid}) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class= "text-success">${nombre}</h5>
                    <span class="fs-6" text-muted>${uid}</span>
                </p>
            </li>
        `
    });

    ulUsuarios.innerHTML = usersHtml;
}

txtMensaje.addEventListener('keyup', /*ev*/ ({keyCode})=>{
    //console.log(ev);

    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;  

    if(keyCode !== 13){ return;} //El keyCode= 13 es el Enter
    if(mensaje.length === 0){ return;}

    socket.emit('enviar-mensaje', {mensaje, uid})

})

const dibujarMensajes = (usuarios = []) =>{
    let mensajesHtml = '';
    usuarios.forEach( /*user*/({nombre,mensaje}) => {

        mensajesHtml += `
            <li>
                <p>
                    <span class= "text-primary">${nombre} :</span>
                    <span class="fs-6" text-muted>${mensaje}</span>
                </p>
            </li>
        `
    });

    ulMensajes.innerHTML = mensajesHtml;
}

btnSalir.addEventListener('click', ()=> {

    localStorage.removeItem('token');
    window.location = 'index.html';

});


const main = async() => {

    await validarJWT();
}

main();




