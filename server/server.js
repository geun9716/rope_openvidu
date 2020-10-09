/* CONFIGURATION */

// var OpenVidu = require('openvidu-node-client').OpenVidu;
// var OpenViduRole = require('openvidu-node-client').OpenViduRole;

// // Check launch arguments: must receive openvidu-server URL and the secret
// if (process.argv.length != 4) {
//     console.log("Usage: node " + __filename + " OPENVIDU_URL OPENVIDU_SECRET");
//     process.exit(-1);
// }
// // For demo purposes we ignore self-signed certificate
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

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
const path = require('path');

/* const storage = multer.diskStorage({
    destination: function(req, res, callback) {
      callback(null, "../public/uploads/");
  },
});
 */
const upload_pdf = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, '../src/uploads/pdfs');
        },
        filename: function (req, file, callback) {
            callback(null, new Date().valueOf() + path.extname(file.originalname));
        }
    }),
});

const upload_answers = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, '../src/uploads/answers');
        },
        filename: function (req, file, callback) {
            callback(null, new Date().valueOf() + path.extname(file.originalname));
        }
    }),
});




//connect DataBase server
var connection = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:"wndjs1212",
    //password:"",
    database:'rope',
});
connection.connect();

app.use(cors({
    origin: true,
    credentials: true
}));



// Server configuration
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'MY_SECRET',
}));

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
//https.createServer(options, app).listen(5000, ()=> console.log('listen port 5000'));
app.listen(5000, ()=>console.log('listen port 5000'));

// Mock database

// Environment variable: URL where our OpenVidu server is listening
// var OPENVIDU_URL = process.argv[2];
// // Environment variable: secret shared with our OpenVidu server
// var OPENVIDU_SECRET = process.argv[3];

// // Entrypoint to OpenVidu Node Client SDK
// var OV = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

// // Collection to pair session names with OpenVidu Session objects
// var mapSessions = {};
// // Collection to pair session names with tokens
// var mapSessionNamesTokens = {};

connection.query('show tables like \'user\'', function(err, rows){
    if(err) return console.log(err);
    if(rows.length){
        console.log('Existed user table');
    }
    else{
        connection.query(
            'CREATE TABLE user ('
                +'uid int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,'
                +'Id varchar(30) NOT NULL,'
                +'password varchar(30) NOT NULL,'
                +'email varchar(30) DEFAULT NULL,'
                +'name varchar(30) DEFAULT NULL);', function(err, rows){
            if(err) return console.log(err);
            if(rows.length){
                console.log(rows);
            }
        })
    }
})
connection.query('show tables like \'exam\'', function(err, rows){
    if(err) return console.log(err);
    if(rows.length){
        console.log('Existed exam table');
    }
    else{
        connection.query(
            'create table exam ('
                +'eid int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,'
                +'uid int(11) NOT NULL,'
                +'title varchar(30),'
                +'content varchar(300),'
                +'time int(5),'
                +'file varchar(20),'
		+'sessionID varchar(32)'
                +'foreign key (uid) REFERENCES user(uid));'
                , function(err, rows){
            if(err) return console.log(err);
            if(rows.length){
                console.log(rows);
            }
        })
    }
})
connection.query('show tables like \'student\'', function(err, rows){
    if(err) return console.log(err);
    if(rows.length){
        console.log('Existed student table');
    }
    else{
        connection.query(
            'create table student ('
            +'sNum int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,'
            +'  eid int(11) ,'
            +'  sid varchar(10),'
            +'  sName varchar(20),'
            +'  cam_file varchar(50),'
            +'  result_file varchar(50),'
            +'  foreign key (eid) REFERENCES exam(eid));'
            , function(err, rows){
            if(err) return console.log(err);
            if(rows.length){
                console.log(rows);
            }
        })
    }
})

/* CONFIGURATION */

/* REST API */
app.get('/', function (req, res) {
    console.log(req);
    res.status(200).send("Hello world!");
});


app.post('/user/join', function (req, res) {
    console.log(req.body);
    var userId = req.body.userId;
    var pass = req.body.pass;
    var email = req.body.email;
    var name = req.body.name;
    var query = connection.query('Select * from user where email = ?', [email], function (err, rows) {
        if (err) return console.log(err);

        if (rows.length) {
            console.log('user existed')
            res.send({ message: 'join fail' })
        } else {
            var sql = [userId, pass, email, name];
            var query = connection.query('Insert into user (Id, password, email, name) values (?,?,?,?) ', sql, function (err, rows) {
                if (err) throw err;
                if (rows) {
                    console.log(rows);

                    res.status(200).send({ message: 'join success' });
                }
            })
        }
    })
})

// Login
app.post('/user/login', function (req, res) {
    console.log(req);

    // Retrieve params from POST body
    var user = req.body.user;
    var pass = req.body.pass;
    var uid = 0;
    console.log("Logging in | {user, pass}={" + user + ", " + pass + "}");

    if (uid = login(user, pass)) { // Correct user-pass
        // Validate session and return OK 
        // Value stored in req.session allows us to identify the user in future requests
        console.log(uid + "'" + user + "' has logged in");
        req.session.loggedUser = user;
        res.status(200).send({ sessionID: req.sessionID, userId: user, isLogged: true, message: 'login success' });
    } else { // Wrong user-pass
        // Invalidate session and return error
        console.log("'" + user + "' invalid credentials");
        req.session.destroy();
        res.status(401).send({ message: 'login fail' });
    }
});

// Logout
app.post('/user/logout', function (req, res) {
    console.log("'" + req.body.userID + "' has logged out");
    req.session.destroy();
    res.status(200).send({ message: 'logout' });
});

app.get('/user/:id', function (req, res) {
    let Id = req.params.id;
    console.log(Id);
    connection.query('Select * from user where Id = ?', [Id], function (err, rows) {
        if (err) return console.log(err);

        if (rows.length) {
            console.log('user existed');
            res.send({ message: 'existed' });
        }
        else {
            console.log('not exist')
            res.send({ message: 'not exist' });
        }
    });
})



app.post('/api-session/create', upload_pdf.array('files'), function (req, res) {

    const sessionID = req.body.sessionID;
    const userID = req.body.userID;
    const title = req.body.fileName;	// 프론트에서 설정한 'title'
    const contents = req.body.contents;	// 프론트에서 설정한 'contents'
    const time = req.body.time; // 시험 시간
    const files = req.files;	// 받은 파일들의 객체 배열

    let uid = 0;
    //이곳에 추가적인 기능 추가
    connection.query('Select * from user where Id = ?', [userID], function (err, rows) {
        if (err) return console.log(err);
        if (rows.length) {
            console.log('Id = ' + rows[0].uid);
            uid = rows[0].uid;
        }
        else {
            return console.log('Error : User is not exist');
        }
    });

    connection.query('Select * from exam where sessionID = ?', [sessionID], function (err, rows) {
        if (err) return console.log(err);

        if (rows.length) {
            console.log('exam existed')
            res.status(200).send({ message: 'create exam fail' });
        }
        else {
            var sql = [uid, title, contents, time, files[0].filename, sessionID];
            connection.query('Insert into exam (uid, title, content, time, file, sessionID) values (?,?,?,?,?,?) ', sql, function (err, rows) {
                if (err) throw err;
                if (rows) {
                    console.log('Insert Exam DB success');
                    res.status(200).send({ message: 'create_success' });
                }
            })
        }
    })
})

app.get('/exam/lists', function (req, res) {
    console.log('api exam list');
    connection.query('Select * from exam', function (err, rows) {
        if (err) return console.log(err);
        if (rows.length) {
            console.log(rows);
            res.status(200).send(rows);
        }
        else {
            return console.log('Error : User is not exist');
        }
    })
})

app.get('/exam/get/:sessionID', function (req, res) {
    console.log('api exam list');
    const sessionID = req.params.sessionID;
    connection.query('Select * from exam where sessionID = ?', [sessionID], function (err, rows) {
        if (err) return console.log(err);
        if (rows.length) {
            console.log(rows);
            res.status(200).send(rows);
        }
        else {
            return console.log('Error : User is not exist');
        }
    })
})


app.delete('/exam/:sessionID', function (req, res) {
    console.log('api exam list');
    const sessionID = req.params.sessionID;
    connection.query('Select * from exam where sessionID = ?', [sessionID], function (err, rows) {
        if (err) return console.log(err);
        if (rows.length) {
            connection.query('delete from exam where sessionID = ?', [sessionID], function (err, rows) {
                if (err) return console.log(err);
                res.status(200).send({ message: 'delete exam success' });
            })
        }
        else {
            return console.log('Error : User is not exist');
        }
    })
})



app.post('/exam/student', upload_answers.array('answer'), function (req, res) {
    console.log(req);
    console.log(req.files[0].filename);
    console.log(req.files[1].filename);
    const eid = req.body.eid;
    const sid = req.body.sid;
    const sName = req.body.sName;

    var sql = [eid, sid, sName, req.files[0].filename, req.files[1].filename];
    var query = connection.query('Select * from student where sid = ?', [sid], function (err, rows) {
        if (rows.length) {
            res.send({ message: 'already sibmit' })
        } else {
            connection.query('Insert into student (eid, sid, sName, cam_file,result_file) values(?,?,?,?,?)', sql, function (err, rows) {
                if (err) return console.log(err);
                res.status(200).send({ message: 'Create_success' });
                console.log("success");
            })
        }

    })

})


app.get('/exam/result/:eid', function (req, res) {
    console.log(req.params.eid);

    connection.query('select * from student where eid = ?', req.params.eid, function (err, rows) {
        if (err) return console.log(err);

        if (rows.length) {
            res.status(200).send(rows);
        }
        else {
            res.status(200).send({ message: 'there is no student' });
        }
    })
})




/* AUXILIARY METHODS */

async function login(user, pass) {
    var result = -1;
    connection.query('Select uid from user where Id = ? and password = ?', [user, pass], function (err, rows) {
        if (err) return console.log(err);
        if (rows != null) {
            console.log(rows[0].uid);

            result = rows[0].uid;
            return result;
        }
        else {
            console.log('not exist')
            return result;
        }
    });
}


/* AUXILIARY METHODS */
