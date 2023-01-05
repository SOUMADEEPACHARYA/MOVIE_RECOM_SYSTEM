// const jwt = require('jsonwebtoken');
// const { getQuery } = require('./connect');

// const {secret} = require('../utils/config.json')['jwt'];

// const verifyToken = () => {
//     return (req, res, next) => {

//         try {
//             // eslint-disable-next-line no-unused-vars
//             let jwtToken, _, typeHeader;

//             if(req.method === 'POST')
//                 [typeHeader] = req.headers['content-type'].split(" ");
            
//             // If GET method or POST method with multipart/form-data
//             if(req.method === 'GET' || (req.method === 'POST' && typeHeader == 'multipart/form-data;') ) {
//                 const header = req.headers['authorization'];

//                 if(header) {
//                     [_, jwtToken] = header.split(' ');
//                 }

//                 else {
//                     return res.status(401).send({
//                         status: false,
//                         message: 'Bearer Token missing',
//                     });
//                 }
//             }

//             else {
//                 const {token} = req.body;
//                 delete req.body.token;

//                 jwtToken = token;
//             }

//             const payload = jwt.verify(jwtToken, secret);
//             req.body.payload = payload;

//             return next();
            
//         } catch (err) {
//             if (err instanceof jwt.JsonWebTokenError) {
//                 return res.status(401).send({
//                     status: false,
//                     message: err.message,
//                 });
//             }
//         }
//     }
// }


// const signToken = (payload) => {
    
//     try {
//         const token = jwt.sign(payload, secret);
//         return token;

//     } catch (err) {
//         if (err instanceof jwt.JsonWebTokenError) {
//             return res.status(401).send({
//                 status: false,
//                 message: err.message,
//             });
//         }
//     }
// }


// const fetchUsers = async (user_id) => {
//     const [{client_id, isClient}] = await getQuery(`SELECT client_id, isClient FROM user_info WHERE user_id = ? `,
//     [user_id]);
//     let users;

//     // If asso with a client
//     if (client_id && isClient == '0') {
//         [{users}] = await getQuery(`SELECT GROUP_CONCAT(user_id) AS users FROM user_info WHERE client_id = ? `,
//         [client_id]);
//         users = users + "," + client_id;
//     }

//     // If a client
//     else if(isClient == '1') {
//         [{users}] = await getQuery(`SELECT GROUP_CONCAT(user_id) AS users FROM user_info WHERE client_id = ? `, [user_id]);
//         users = users + "," + user_id;
//     }

//     else
//         users = `${user_id}`;
//     return users;
// }


// module.exports = {
//     verifyToken,
//     signToken,
//     fetchUsers
// };