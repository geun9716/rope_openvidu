/* CONFIGURATION */

var OpenVidu = require('openvidu-node-client').OpenVidu;
var OpenViduRole = require('openvidu-node-client').OpenViduRole;

// Check launch arguments: must receive openvidu-server URL and the secret
if (process.argv.length != 4) {
    console.log("Usage: node " + __filename + " OPENVIDU_URL OPENVIDU_SECRET");
    process.exit(-1);
}
// For demo purposes we ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

// Node imports
var express = require('express');
var fs = require('fs');
var session = require('express-session');
var https = require('https');
var bodyParser = require('body-parser'); // Pull information from HTML POST (express4)
var app = express(); // Create our app with express
var mysql = require('mysql');
var cors = require('cors');
const { resolveSoa } = require('dns');
const { doesNotMatch } = require('assert');
//const router = require('express').Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, res, callback) {
      callback(null, "uploads/");
  },
});

const upload = multer({
storage: storage,
});


//connect DataBase server
var connection = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:"wndjs1212",
    // password:"",
    database:'rope',
});
connection.connect();

// Server configuration
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'MY_SECRET'
}));
app.use(cors());
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // Parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // Parse application/vnd.api+json as json

// Listen (start app with node server.js)
var options = {
    key: fs.readFileSync('openvidukey.pem'),
    cert: fs.readFileSync('openviducert.pem')
};
//https.createServer(options, app).listen(5000);
app.listen(5000, ()=>console.log('listen port 5000'));

// Mock database

// Environment variable: URL where our OpenVidu server is listening
var OPENVIDU_URL = process.argv[2];
// Environment variable: secret shared with our OpenVidu server
var OPENVIDU_SECRET = process.argv[3];

// Entrypoint to OpenVidu Node Client SDK
var OV = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

// Collection to pair session names with OpenVidu Session objects
var mapSessions = {};
// Collection to pair session names with tokens
var mapSessionNamesTokens = {};



/* CONFIGURATION */

/* REST API */
app.get('/', function(req, res){
    console.log(req);
    res.status(200).send("Hello world!");
});

app.post('/user/join', function(req, res){
    console.log(req.body);
    var userId = req.body.userId;
    var pass = req.body.pass;
    var email = req.body.email;
    var name = req.body.name;
    var query = connection.query('Select * from user where email = ?', [email], function(err, rows){
        if(err) return console.log(err);

        if(rows.length){
            console.log('user existed')
            res.send({message : 'join fail'})
        } else{
            var sql = [userId, pass, email, name];
            var query = connection.query('Insert into user (Id, password, email, name) values (?,?,?,?) ', sql, function(err, rows){
                if(err) throw err;
                if(rows){
                    console.log(rows);

                    res.status(200).send({message : 'join success'});
                }
            })
        }
    })
})

// Login
app.post('/user/login', function (req, res) {

    // Retrieve params from POST body
    var user = req.body.user;
    var pass = req.body.pass;
    console.log("Logging in | {user, pass}={" + user + ", " + pass + "}");

     if (login(user, pass)) { // Correct user-pass
        // Validate session and return OK 
        // Value stored in req.session allows us to identify the user in future requests
        console.log("'" + user + "' has logged in");
        req.session.loggedUser = user;
        res.status(200).send({message : 'login success'});
    } else { // Wrong user-pass
        // Invalidate session and return error
        console.log("'" + user + "' invalid credentials");
        req.session.destroy();
        res.status(401).send({message : 'login fail'});
    } 
});

// Logout
app.post('/user/logout', function (req, res) {
    console.log("'" + req.session.loggedUser + "' has logged out");
    req.session.destroy();
    res.status(200).send({message : 'logout'});
});

app.get('/user/:id', function(req, res){
    let Id = req.params.id;
    console.log(Id);
    connection.query('Select * from user where Id = ?', [Id], function(err, rows) {
        if(err) return console.log(err);

        if(rows.length){
            console.log('user existed');
            res.send({message : 'existed'});
        }
        else{
            console.log('not exist')
            res.send({message : 'not exist'});
        }
    });
})

app.post('/user/files', upload.array('files'));
app.post('/user/files', function(req, res) {
	const title = req.body.fileName;	// 프론트에서 설정한 'title'
    const contents = req.body.contents;	// 프론트에서 설정한 'contents'
    const time=req.body.time; // 시험 시간
  	const files = req.files;	// 받은 파일들의 객체 배열
    
    console.log(title);
    console.log(contents);
    console.log(time);

      //이곳에 추가적인 기능 추가
    

    console.log(files)
});

/* REST API about exam*/

app.get('/exam/:sessionName', function(req, res){
    var nickname = req.body.nickname;
    // The video-call to connect
    //var sessionName = req.body.sessionName;
    var sessionName = req.params.sessionName;
    
    // Role associated to this user
    // var role = users.find(u => (u.user === req.session.loggedUser)).role;

    // Optional data to be passed to other users when this user connects to the video-call
    // In this case, a JSON with the value we stored in the req.session object on login
    var serverData = JSON.stringify({ serverData: req.session.loggedUser });

    console.log("Getting a token | {sessionName}={" + sessionName + "}");

    // Build tokenOptions object with the serverData and the role
    var tokenOptions = {
        data: serverData,
        role: OpenViduRole.PUBLISHER
    };

    if (mapSessions[sessionName]) {
        // Session already exists
        console.log('Existing session ' + sessionName);

        // Get the existing Session from the collection
        var mySession = mapSessions[sessionName];

        // Generate a new token asynchronously with the recently created tokenOptions
        mySession.generateToken(tokenOptions)
            .then(token => {
                // Store the new token in the collection of tokens
                mapSessionNamesTokens[sessionName].push(token);
                // Return the token to the client
                res.status(200).send({
                    0: token
                });
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        // New session
        console.log('New session ' + sessionName);
    }
})

app.post('/api-session/create', function(req, res){
    if (!isLogged(req.session)) {
        req.session.destroy();
        res.status(401).send('User not logged');
    } else {
        // The video-call to connect
        var sessionName = req.body.sessionName;

        // Role associated to this user
        // var role = users.find(u => (u.user === req.session.loggedUser)).role;

        // Optional data to be passed to other users when this user connects to the video-call
        // In this case, a JSON with the value we stored in the req.session object on login
        var serverData = JSON.stringify({ serverData: req.session.loggedUser });

        console.log("Getting a token | {sessionName}={" + sessionName + "}");

        // Build tokenOptions object with the serverData and the role
        var tokenOptions = {
            data: serverData,
            role: OpenViduRole.PUBLISHER
        };

        if (mapSessions[sessionName]) {
            // Session already exists
            console.log('Existing session ' + sessionName);
        } 
        
        // New session
        console.log('New session ' + sessionName);

        // Create a new OpenVidu Session asynchronously
        OV.createSession()
            .then(session => {
                // Store the new Session in the collection of Sessions
                mapSessions[sessionName] = session;
                // Store a new empty array in the collection of tokens
                mapSessionNamesTokens[sessionName] = [];

                // Generate a new token asynchronously with the recently created tokenOptions
                session.generateToken(tokenOptions)
                    .then(token => {

                        // Store the new token in the collection of tokens
                        mapSessionNamesTokens[sessionName].push(token);

                        // Return the Token to the client
                        res.status(200).send({
                            0: token
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                console.error(error);
            });
    }
})

// Get token (add new user to session)
app.post('/api-sessions/get-token', function (req, res) {
    if (!isLogged(req.session)) {
        req.session.destroy();
        res.status(401).send('User not logged');
    } else {
        // The video-call to connect
        var sessionName = req.body.sessionName;

        // Role associated to this user
        // var role = users.find(u => (u.user === req.session.loggedUser)).role;

        // Optional data to be passed to other users when this user connects to the video-call
        // In this case, a JSON with the value we stored in the req.session object on login
        var serverData = JSON.stringify({ serverData: req.session.loggedUser });

        console.log("Getting a token | {sessionName}={" + sessionName + "}");

        // Build tokenOptions object with the serverData and the role
        var tokenOptions = {
            data: serverData,
            role: OpenViduRole.PUBLISHER
        };

        if (mapSessions[sessionName]) {
            // Session already exists
            console.log('Existing session ' + sessionName);

            // Get the existing Session from the collection
            var mySession = mapSessions[sessionName];

            // Generate a new token asynchronously with the recently created tokenOptions
            mySession.generateToken(tokenOptions)
                .then(token => {

                    // Store the new token in the collection of tokens
                    mapSessionNamesTokens[sessionName].push(token);

                    // Return the token to the client
                    res.status(200).send({
                        0: token
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            // New session
            console.log('New session ' + sessionName);

            // Create a new OpenVidu Session asynchronously
            OV.createSession()
                .then(session => {
                    // Store the new Session in the collection of Sessions
                    mapSessions[sessionName] = session;
                    // Store a new empty array in the collection of tokens
                    mapSessionNamesTokens[sessionName] = [];

                    // Generate a new token asynchronously with the recently created tokenOptions
                    session.generateToken(tokenOptions)
                        .then(token => {

                            // Store the new token in the collection of tokens
                            mapSessionNamesTokens[sessionName].push(token);

                            // Return the Token to the client
                            res.status(200).send({
                                0: token
                            });
                        })
                        .catch(error => {
                            console.error(error);
                        });
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
});

// Remove user from session
app.post('/api-sessions/remove-user', function (req, res) {
    if (!isLogged(req.session)) {
        req.session.destroy();
        res.status(401).send('User not logged');
    } else {
        // Retrieve params from POST body
        var sessionName = req.body.sessionName;
        var token = req.body.token;
        console.log('Removing user | {sessionName, token}={' + sessionName + ', ' + token + '}');

        // If the session exists
        if (mapSessions[sessionName] && mapSessionNamesTokens[sessionName]) {
            var tokens = mapSessionNamesTokens[sessionName];
            var index = tokens.indexOf(token);

            // If the token exists
            if (index !== -1) {
                // Token removed
                tokens.splice(index, 1);
                console.log(sessionName + ': ' + tokens.toString());
            } else {
                var msg = 'Problems in the app server: the TOKEN wasn\'t valid';
                console.log(msg);
                res.status(500).send(msg);
            }
            if (tokens.length == 0) {
                // Last user left: session must be removed
                console.log(sessionName + ' empty!');
                delete mapSessions[sessionName];
            }
            res.status(200).send();
        } else {
            var msg = 'Problems in the app server: the SESSION does not exist';
            console.log(msg);
            res.status(500).send(msg);
        }
    }
});

/* AUXILIARY METHODS */

async function login (user, pass) {
    connection.query('Select * from user where Id = ? and password = ?', [user, pass], function(err, rows) {
        if(err) return console.log(err);
        if(rows.length){
            console.log('user existed');
            return true;
        }
        else{
            console.log('not exist')
            return false;
        }
    });
}

function isLogged(session) {
    return (session.loggedUser != null);
}

function getBasicAuth() {
    return 'Basic ' + (new Buffer('OPENVIDUAPP:' + OPENVIDU_SECRET).toString('base64'));
}

/* AUXILIARY METHODS */