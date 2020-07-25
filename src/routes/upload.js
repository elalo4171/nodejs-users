const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload());



app.put('/upload', (req, res) => {

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Error al subir la foto'
                }
            });
    }
    res.send("Desde upload");
});


module.exports = app;