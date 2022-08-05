const jwt = require('jsonwebtoken');
const { Usuario } = require ('../models')

const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '1000h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT')
            } else {
                resolve(token);
            }
        })
    })
}

const comprobarJWT = async (token = '') => {

    //console.log(token);

    try {        
        if( token.length <=10) {
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );        
        const usuario = await Usuario.findById(uid);
        console.log(usuario);

        if ( usuario ) {
            if ( usuario.estado ) {
                return usuario;
            } else {    
                console.log("El usuario fue borrado.");            
                return null;
            }
        } else {
            console.log("No hay usuario.");
            return null;
        }

    } catch (error) {
        console.log(error);
        return null;
    }

}

module.exports = { generarJWT , comprobarJWT};