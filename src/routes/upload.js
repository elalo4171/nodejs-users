const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload());



app.put('/upload', (req, res) => {
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
    const ext = ['png', 'jpg', 'jpeg'];


    let sampleFile = req.files.archivo;
    sampleFile.mv('uploads/user-foto/iamgen.jpg', function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
    // res.send("Desde upload");
});


module.exports = app;