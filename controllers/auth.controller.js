const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if (usuario.estado === false) { //!usuario.estado
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar contraseña
        const contraseñaValida = bcryptjs.compareSync(password, usuario.password)
        if (!contraseñaValida) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - contraseña'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.status(200).json({
            msg: 'Login ok',
            usuario,
            token
        });


    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { nombre, img, correo /*googleUser */ } = await googleVerify(id_token);

        //Generar la referencia para el ver si el usuario ya está en la BD

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {

            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'

            };

            usuario = new Usuario(data);
            await usuario.save(/*usuario*/);
        }

        //Si el usuario tiene el estado en falso

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            msg: 'Todo ok',
            token,
            usuario
        })

    } catch (error) {

        res.status(400).json({
            msg: 'Error Google - el token no se pudo verificar.'
        })
        console.log(error);
    }
}

const renovarToken = async (req, res = response) => {

    const { usuario } = req; //ya valido el usuario el JWT

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.status(200).json({
        msg: 'Login ok',
        usuario,
        token
    });

}

module.exports = {
    login,
    googleSignIn,
    renovarToken

}