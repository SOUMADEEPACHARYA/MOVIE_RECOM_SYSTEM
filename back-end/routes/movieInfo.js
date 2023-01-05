const router = require('express').Router();
const { getQuery } = require('../config/connect');



router.post('/', async (req, res) => {
    try {
        let movieIdList= req.body.movieIdList;
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
            message: 'Data read success',
            movieList:result
        });
    }

    catch (err) {
        console.error(err);
        res.status(200).send({
            status: false,
            message: 'Data read failed',
        });
    }

});

module.exports = router;