const { Router } = require ('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/:coleccion/:id',[
    check('id','El id debe se de Mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas (c, ['usuarios','productos'])),
    validarCampos
], mostrarImagen)

router.post ('/',validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','El id debe se de Mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas (c, ['usuarios','productos'])),
    validarCampos
],actualizarImagenCloudinary)
//actualizarImagen)

module.exports = router;