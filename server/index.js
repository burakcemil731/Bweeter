const express = require('express'); // für npm express reinbringen
const cors = require('cors'); // npm cors reinbringen
const monk = require('monk');

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/bweeter');
const bweets = db.get('bweets'); //collection in der Database

app.use(cors()); //cors als mittelmann, automatisch cors header einfügen
app.use(express.json()); //json body parser für alles was content-type ist

//get request und response
app.get('/', (req, res) =>{
    res.json({
        message: 'Bwitter!! ..!!!!😌' //test ob req und res funzt im localhost mit nodemon
            });
});

app.get('/bweets', (req, res) =>{
    bweets
    .find()
    .then(bweets => {
        res.json(bweets);
    });
});

function isValidBweet(bweet){
    return bweet.name && bweet.name.toString().trim() !== '' && //hat name geschickt
    bweet.content && bweet.content.toString().trim() !==''; //hat content gesendet
}

//post route um client anfragen an server zu senden

app.post('/bweets', (req, res) =>{
//console.log(req.body);
if(isValidBweet(req.body)){
    //insert in DB

    const bweet ={
        name: req.body.name.toString(),         //injection vermeiden und validieren
        content: req.body.content.toString(),
        created: new Date()
    };

bweets      // die bweets in DB reinschallern
.insert(bweet)
.then(createdBweet =>{
    res.json(createdBweet); //antworten mit was gerade inseriert wurde
});
//console.log(bweet);
} else{
    res.status(422);
    res.json({
        message: 'Name und Bweet sind fehlen, bitte eingeben, keine leeren Felder.'
    });
}
});

app.listen(5000, () =>{
    console.log('Listening on http://localhost:5000');
});