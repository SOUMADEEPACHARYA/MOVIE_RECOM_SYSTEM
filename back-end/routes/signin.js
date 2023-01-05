const router = require('express').Router();
const { getQuery } = require('../config/connect');

router.post('/', async (req, res) => {

    try {
        let {userName,password} = req.body;
        const [b]=await getQuery("SELECT USER_ID from USER_DETAILS where USERNAME=? and PASSWORD =?",[userName,password]) ;
        console.log(b)
        if(b && b.USER_ID>0)
        {
        res.status(200).send({
            status: true,
            message: 'Login successfull',
            userName,
            userId:b.USER_ID,
        });
        }
        else
        {
            res.status(200).send({
                status: false,
                message: 'Login unsuccessfull!Please enter correct details',
            });
        }
    }

    catch (err) {
        console.error(err);
        res.status(200).send({
            status: false,
            message: 'Login failed',
        });
    }

});

module.exports = router;