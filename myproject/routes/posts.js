const express = require('express');
const router = express();
const Post = require('../models/users');

router.get('/', (req, res) => {
    res.send('we are on posts');
});

router.post('/', async (req, res) => {
    console.log(req.body);
    const post = new Post({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
   try{
    const savedPost = await post.save()
    res.json(savedPost);

} catch (err){
res.json({message:err});
}

});

module.exports = router;