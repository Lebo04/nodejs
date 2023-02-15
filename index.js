// // let {addition} = require("./addition");

// // addition(3, 7);
// // addition(7, 7);

// const http = require("http");

// //---------Port----------//
// const port = parseInt(process.env.port) || 4000;

// //--------Web server------//
// http
//   .createServer((req, res) => {
//     const currUrl = req.url;
//     console.log("Url: ", currUrl, "\nMethod: ", req.method);
//     res.writeHead(200, { "Content-type": "text/html" });

//     switch (currUrl) {
//       case "/":
//         res.end("You are home");
//         break;
//       case "/about":
//         res.end("About me page");
//         break;
//       case "/data":
//         res.end("Page data");
//         break;
//       default:
//         res.end("Page / content was not found");
//     }
//   })
//   .listen(port, () => {
//     console.log(`server is running on port ${port}`);
//   });



//---------EXPRESS--------//

const express = require('express');
//--------Path--------//
const path = require('path');
//--------DB--------//
const db = require('./config');
//--------Body-parser--------//
const bodyParser = require('body-parser');
//-------Port-------//
const port = parseInt(process.env.port) || 4000;
//------Express app--------//
const app = express();
//------Router-------//
const route = express.Router();

app.use(
    route,
    express.json,
    bodyParser.urlencoded({extended: false})
    );

//-----Home page or / --------//
route.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname,"./view/index.html"));
})

route.get('/users', (req, res) => {
    const strQry = 
    `
    SELECT firstName, lastName, emailAdd, country
    FROM Users;
    `

    //---db---//
    db.query(strQry, (err, data) => {
        if (err) throw err;
        res.status(200).json( {result: data});
    })
})

//-----Register-------//
route.post('/register', bodyParser.json(), (req, res) => {
    let detail = req.body;
    console.log(detail);
    //------sql query-------//
    const strQry = 
    `
    INSERT INTO Users
    SET ?;
    `
    db.query(strQry, [detail], (err) => {
        if (err) {
            res.status(400).json({err});
        } else {
            res.status(200).json({msg: "A user record was saved"})
        }
    })

})

route.put('/update', (req, res) => {
    let detail = req.body;
    const strQry = 
    `UPDATE Users 
    SET firstName = 'Kelebogile' 
    WHERE firstName = 'Lebo';
    `
    db.query(strQry, [detail], (err) => {
        if (err) {
            res.status(400).json({err});
        } else {
            res.status(200).json({msg: "A record has been updated"})
        }
    })
})

route.delete('/destroy', (req, res) => {
    let detail = req.body;
    const strQry = 
    `DELETE FROM Users
    WHERE firstName = 'Kelebogile';
    `
    db.query(strQry, [detail], (err) => {
        if (err) {
            res.status(400).json({err});
        } else {
            res.status(200).json({msg: "A record has been deleted"})
        }
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})