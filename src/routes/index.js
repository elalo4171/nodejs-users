const { Router } = require('express');
const { param, body, validationResult } = require('express-validator');


const router = Router();

const { pool, getUsers, createUser, getUserById, uploadPhoto } = require('../controller/index.controller');

router.get('/users', getUsers);


router.get('/users/:id', [
    param('id').isNumeric(),
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const response = await pool.query('select * from users where id=$1', [req.params.id]);
    if (response.rowCount < 1) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'Usuario no encontrado'
            }
        });
    }
    getUserById(req, res);
});

router.post('/users', [
    body('email').isEmail({ allow_utf8_local_part: false }).withMessage('Email is required and type a@a.com'),
    body('name').isAlpha().isLength({ max: 50 }).withMessage('Name is required'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    createUser(req, res);
});


// router.put('/upload/:id', [param('id').isNumeric(), ], (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     uploadPhoto(req, res);
// });




module.exports = router;