const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
const { pool } = require('../controller/index.controller');
const { param, validationResult } = require('express-validator');


app.use(fileUpload());
app.put('/upload/:id', [
    param('id').isNumeric().withMessage('EL parametro ID es necesario y es numerico')
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //obtener el id del usuario
    let { id } = req.params;

    //Obtener el usuario de la base de datos
    let userData = await (await pool.query('SELECT * FROM users where id=$1', [id])).rows;

    //verificar que el usuario exista
    if (userData.length <= 0) {

        return res.status(404).json({
            ok: false,
            err: {
                message: 'Usuario no encontrado'
            }
        });
    }

    //Verificar que los archivos vengan

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Error es necesario el archivo'
                }
            });
    }


    //Obtener el nombre de la foto del usuario
    const { url_foto } = userData[0];

    //extenciones permitidas
    let ext = ['png', 'jpg', 'jpeg', 'JPG'];


    let imagen = req.files.archivo;
    let nombreCortado = imagen.name.split('.');
    let extensionImagen = nombreCortado[nombreCortado.length - 1];

    //Cambiar nombre al archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionImagen}`;


    if (ext.indexOf(extensionImagen) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones validad son ${ext.join(' ')}`,
                ext: extension
            }
        })
    }

    imagen.mv(`uploads/user-foto/${nombreArchivo}`, async(err) => {
        if (err) {
            deleteFile(nombreArchivo);
            return res.status(500).send(err);
        }

        deleteFile(url_foto);

        const user = await pool.query('UPDATE users SET url_foto = $1 WHERE id=$2', [nombreArchivo, id]);
        res.status(200).json({
            ok: true,
            data: {
                id,
                url_foto: path.resolve(__dirname, `../../uploads/user-foto/${nombreArchivo}`)
            }
        });
    });
    // res.send("Desde upload");
});

function deleteFile(nombreImagen) {
    let pathImagen = path.resolve(__dirname, `../../uploads/user-foto/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

app.get('/imagen/:img',
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let img = req.params.img;

        let pathImg = `./uploads/user-foto/${ img }`;

        let pathImagen = path.resolve(__dirname, `../../uploads/user-foto/${ img }`);

        if (fs.existsSync(pathImagen)) {
            res.sendFile(pathImagen);
        } else {
            let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
            res.sendFile(noImagePath);
        }
    });


module.exports = app;