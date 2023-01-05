const router = require('express').Router();
const { getQuery } = require('../config/connect');

async function sendResponse(movieIdList,res){
    try {
        console.log(movieIdList)
        const reslt=await getQuery("SELECT ID,MOVIE_ID, TITLE,GENRES,OVERVIEW,KEYWORDS,CAST,CREW,POSTER_PATH from MOVIE where MOVIE_ID IN (?)",[movieIdList]) ;
        const result = reslt.map((b) => {
        if(res && b.ID>0){
            return {
                id:         b.ID,
                movieId:    b.MOVIE_ID,
                title:      b.TITLE,
                genres:     b.GENRES.replace(/'/g, '"'),
                overview :  b.OVERVIEW,
                keywords :  b.KEYWORDS.replace(/'/g, '"'),
                cast :      b.CAST.replace(/'/g, '"'),
                crew:       b.CREW.replace(/'/g, '"'),
                posterPath: b.POSTER_PATH
            };
        }
        return {
            id: null,
            movieId: null,
        }
        })
        res.status(200).send({
            status: true,
                message: 'Rating added successfully',
                movieList:result
        });
    }
    catch (err) {
        console.error(err);
        res.status(200).send({
            status: false,
            message: 'Adding rating failed',
        });
    }
}

function redirection(uid ,mid, res)
{   
    let movieIdList = []

    uid = Number(uid)
    mid = Number(mid)

    const { spawn } = require('child_process');

    obj = { 'user_id': uid ,'movie_id': mid }
    const childPython = spawn('python3', [ 'routes/recommender.py', JSON.stringify(obj) ]);

    childPython.stdout.on( 'data', (data) => {
        
        mystr = data.toString();
        myjson = JSON.parse(mystr);
        movieIdList=myjson.Data;
        sendResponse(movieIdList,res)
    });

    childPython.stderr.on( 'data', (data) => {
        console.log(`stderr: ${data}`);
    });
    childPython.stderr.on( 'close', (code) => {
        console.log(`child process with code ${code}`);
    });
}


router.post('/', async (req, res) => {

    try {
        let {userId,movieId,rating} = req.body;
        const id= await getQuery("SELECT ID FROM USER_RATINGS WHERE USER_ID=? AND MOVIE_ID=?",[userId,movieId]);
        if(id.length && id?.[0] && id[0]?.ID>0)
         await getQuery("UPDATE USER_RATINGS SET RATING=? WHERE ID = ?",[rating,id[0].ID])
         else
         await getQuery("INSERT INTO USER_RATINGS(USER_ID,MOVIE_ID,RATING) values(?,?,?) ",[userId,movieId,rating]);


        redirection(userId,movieId,res)
        // console.log(movieIdList)
        // Code for getting list of related movies 
        // if(movieIdList.length==0){
        //     res.status(200).send({
        //         status: false,
        //         message: 'Python code failed',
        //     });
        //     return;
        // }
        ////////////
        // try {
        //     // let movieIdList= req.body.movieIdList;
        //     const reslt=await getQuery("SELECT ID,MOVIE_ID, TITLE,GENRES,OVERVIEW,KEYWORDS,CAST,CREW,POSTER_PATH from MOVIE where MOVIE_ID IN (?)",[movieIdList]) ;
        //     const result = reslt.map((b) => {
        //     if(res && b.ID>0){
        //         return {
        //             id:         b.ID,
        //             movieId:    b.MOVIE_ID,
        //             title:      b.TITLE,
        //             genres:     b.GENRES.replace(/'/g, '"'),
        //             overview :  b.OVERVIEW,
        //             keywords :  b.KEYWORDS.replace(/'/g, '"'),
        //             cast :      b.CAST.replace(/'/g, '"'),
        //             crew:       b.CREW.replace(/'/g, '"'),
        //             posterPath: b.POSTER_PATH
        //         };
        //     }
        //     return {
        //         id: null,
        //         movieId: null,
        //     }
        //     })
        //     res.status(200).send({
        //         status: true,
        //          message: 'Rating added successfully',
        //          movieList:result
        //     });
        // }

        ///////////////
    }

    catch (err) {
        console.error(err);
        res.status(200).send({
            status: false,
            message: 'Adding rating failed',
        });
    }

});

module.exports = router;