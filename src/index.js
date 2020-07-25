const express = require('express');
const app = express();
const port = 3000;

//middlewars
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//rutas 
app.use(require('./routes/index'));


app.listen(port, () => console.log(`Server on port ${port}`));