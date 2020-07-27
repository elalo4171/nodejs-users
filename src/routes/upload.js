const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload());



app.put('/upload/:id', (req, res) => {

    let { id } = req.params;
    //validar que venga la foto
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Error es necesario el archivo'
                }
            });
    }
    //extenciones permitidas
    let ext = ['png', 'jpg', 'jpeg', 'JPG'];


    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');

    let extension = nombreCortado[nombreCortado.length - 1];
    console.log("ID:" + id);
    if (ext.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones validad son ${ext.join(' ')}`,
                ext: extension
            }
        })
    }

    //Cambiar nombre al archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    console.log(extension);
    archivo.mv(`uploads/user-foto/${nombreArchivo}`, function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
    // res.send("Desde upload");
});


module.exports = app;