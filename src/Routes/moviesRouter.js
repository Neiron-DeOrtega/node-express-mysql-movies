const { Router } = require('express'); 
const router = Router(); 

router.post('/getmovies', moviesController)

module.exports = router