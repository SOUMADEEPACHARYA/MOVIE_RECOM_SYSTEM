const router = require('express').Router();
const { getQuery } = require('../config/connect');

router.post('/', async (req, res) => {

    try {
        let {userName,email,password} = req.body;
        console.log(userName,email,password,req.body);
        const [b]=await getQuery("SELECT COUNT(*) as var from USER_DETAILS where USERNAME=? and PASSWORD =?",[userName,password]) ;
            if(b.var>0)
            {
            res.status(200).send({
                status: false,
                message: 'USER ALREADY EXIST',
            });
            }
            else
            {
                await getQuery("INSERT INTO USER_DETAILS (USERNAME, EMAIL, PASSWORD) values (?,?,?)",[ userName, email, password]) ;
                const [user] = await getQuery("SELECT USER_ID from USER_DETAILS where USERNAME=? and EMAIL=? and PASSWORD =?",[ userName, email, password]) ;
                res.status(200).send({
                    status: true,
                    message: 'Signup successfull',
                    userName,
                    userId:user.USER_ID,
                });
            }
        }
    catch (err) {
        console.error(err);
        res.status(200).send({
            status: false,
            message: 'Signup failed',
        });
    }

});

module.exports = router;