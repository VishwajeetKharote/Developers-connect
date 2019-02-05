const express = require('express');
const router = express.Router();

router.get('/test', (req,res)=>{
    res.send({msg:'This is test route'});
});

 module.exports = router;