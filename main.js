const express = require('express');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');

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

app.get("/vinay", (req,res) => {
    res.render("vinay");
})

app.get("/vinnu", (req,res) => {
    res.render("vinnu");
})

app.get('/api/login/:userId', (req,res) => {
    const userId = req.params.userId
    if(userId){
        if(userId === '1'){
            res.redirect('/vinay')
        } else if(userId === "2"){
            res.redirect("/vinnu")
        }
        else {
            res.status(403).json('User not Found')
        }
    }

})

app.post("/api/logout", (req,res) => {
    const userTokens = req.headers.authorization
    if(userTokens) {
        const token = userToken.split(' ')[1]
        if(token){
            let allTokens = []
            const tokenIndex = allTokens.indexOf(token)
            if(tokenIndex !== -1){
                allTokens.splice(tokenIndex,1)
                res.status(200).json('Logout Sucessfully')
                res.redirect("/")  
            }
            else {
               res.status(400).json('you are not valid use') 
            }
        } else {
            res.status(400).json('token not found');
        }
    } else {
        res.status(400).json('you are not authenticated');
    }
})

app.get('/api/logout' , (req,res) => {
    res.redirect('/');
})

app.get('/', (req,res) => {
    res.render('home')
})

app.listen( PORT, () => {
    console.log( `Server started Running at ${PORT}` )
});