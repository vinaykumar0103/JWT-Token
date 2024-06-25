const express = require('express');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const jwt = require('jsonwebtoken');
const ejc = require('ejs');

const app = express();

 dotEnv.config();
 app.use(express.json());
 app.set('view engine', 'ejs');
 app.use(express.urlencoded({ extended: true }));

const PORT = 4000;

const secretKey = process.env.MysecretKey

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Server Connected Sucessfully ')
})
.catch((error) => {
    console.log(`${error}`)
});



const users = [{
    id: '1',
    username: 'Vinay',
    password: 'Web3',
    isAdmin: true
},

{
    id: '2',
    username: 'vinnu',
    password: 'web5',
    isAdmin: false
}];

// MiddleWear
const verifyUser = ( req, res, next ) => {
    const userToken = req.headers.authorization;
    if(userToken) {
        const token = userToken.split(" ")[1]
        jwt.verify( token, secretKey, ( err, user ) => {
            if(err){
                return res.status(403).json({ err: 'token is not valid '});
            }
            req.user = user
            next();
        })

    } else {
        res.status(401).json('you are not authenticated')

    }
}



app.post('/api/login', ( req, res ) => {
    const { username, password } = req.body;

    const user = users.find((person) => {
        return person.username === username || person.password === password;   
    })

    if(user) {
        const accessToken = jwt.sign({
            id:user.id,
            username:user.username,
            isAdmin:user.isAdmin
        },secretKey)
        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken
        });
    } else {
        res.status(401).json('user crential not matched');
    }
})

app.delete('/api/users/:userId', verifyUser , (req,res) => {
    if(req.user.id === req.params.userId || rrq.user.isAdmin ){
        res.status(200).json('user is deleted sucessfully');
    } else {
        res.status(401).json('you are not allow to delete ')
    }

})


app.listen( PORT, () => {
    console.log( `Server started Running at ${PORT}` )
});