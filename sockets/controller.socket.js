//BACKEND

const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

//Al poner io ya importa todos los usuarios.
const socketController = async (socket = new Socket(), io) => {

    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    //console.log('Socket controller: '+usuario);
    if (!usuario) {
        console.log('Socket desconectado');
        return socket.disconnect();
    }

    console.log('Se conecto', usuario.nombre);

    chatMensajes.conectarUsuario(usuario)
    //Al haber puesto io ya se envía a todos los usuarios.
    io.emit('usuarios-activos', chatMensajes.usuariosArr);//sala global
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);//sala con su propio id ,socket.id

    //Conectarlo a una sala especial
    socket.join(/*nombre de la sala */usuario.id)

    //Limpiar cuando alguien se desconecta.
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id)
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    })

    socket.on('enviar-mensaje', (/*payload*/{ uid, mensaje }) => {
        //console.log(payload);
        if (uid) {
            //Mensaje privado
            socket.to(uid).emit('mensaje-privado',{de: usuario.nombre, mensaje})
           
           
        } else {
            chatMensajes.enviarmensajes(usuario.id, usuario.nombre, mensaje)
            io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }
    })

}

module.exports = {
    socketController
}