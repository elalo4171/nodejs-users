const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'users',
    port: '5432'
});


const getUsers = async(req, res) => {
    const response = await pool.query('select * from users');
    res.status(200).json(response.rows);
    console.log(response.rows);
};

const getUserById = async(req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM users where id=$1', [id]);

    if (response.rowCount >= 1) {
        res.json({
            ok: true,
            user: response.rows,
        });
    } else {
        res.status(404).json({
            ok: false,
            err: {
                type: 'Usuario no encontrado'
            }
        })
    }

}

const createUser = async(req, res) => {

    const { name, email, url } = req.body;
    let verificarCorreo = await pool.query('SELECT * FROM users where email=$1', [email]);
    if (verificarCorreo.rowCount > 0) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'Este correo ya esta registrado'
            }
        });
    }

    await pool.query('INSERT into users(name,email,url_foto) values($1,$2,$3)', [name, email, url]);
    const userBD = await pool.query('SELECT * FROM users where email=$1', [email]);
    res.json({
        message: 'Usuer add succesfully',
        body: { user: userBD.rows }
    })

}



module.exports = {
    pool,
    getUsers,
    getUserById,
    createUser,
};