// Place your server entry point code here
const express = require('express')
const app = express()
const args = require('minimist')(process.argv.slice(2)) 
const morgan = require('morgan')
const database = require('./src/services/database.js')
const fs = require('fs')
const md5 = require('md5')

// Serve static HTML files
app.use(express.static('./public'));

// Add cors dependency
const cors = require('cors')
// Set up cors middleware on all endpoints
app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


args['port']
args['debug'] 
args['log']
args['help']
const port = args.port || process.env.port || 5555// add command line argument
const debug = args.debug || 'false'
const log = args.log || 'true'

const server = app.listen(port, () => {
  console.log('App is running on port %PORT%'.replace('%PORT%',port))
})

if(log=='true'){
  // Use morgan for logging to files
  // Create a write stream to append (flags: 'a') to a file
  const accessLogStrm = fs.createWriteStream('./data/log/access.log', { flags: 'a' })
  // Set up the access logging middleware
  app.use(morgan('combined', { stream: accessLogStrm }))
}

if (args.help) {
  console.log(`server.js [options]

  --port	Set the port number for the server to listen on. Must be an integer
              between 1 and 65535.

  --debug	If set to \`true\`, creates endlpoints /app/log/access/ which returns
              a JSON access log from the database and /app/error which throws 
              an error with the message "Error test successful." Defaults to 
			  \`false\`.

  --log		If set to false, no log files are written. Defaults to true.
			  Logs are always written to database.

  --help	Return this message and exit.`)
  process.exit(0)
  
}

app.use((req, res, next) => {
  // Your middleware goes here.
  let logdata = {
    remoteaddr: req.ip,
    remoteuser: req.user,
    time: Date.now(),
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    httpversion: req.httpVersion,
    status: res.statusCode,
    referer: req.headers['referer'],
    useragent: req.headers['user-agent']
  }



  const stmt = database.prepare(`INSERT INTO accesslog (remoteaddr, 
    remoteuser, time, method, url, protocol, httpversion, 
    status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)


  const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, 
    logdata.method, logdata.url, logdata.protocol, logdata.httpversion,
    logdata.status, logdata.referer, logdata.useragent)
  next()
  })





app.get('/app/', (req, res) => {
    //Respond w status 200
    res.statusCode = 200;
    //Respond w status message "OK"
    res.statusMessage = 'OK';
    res.writeHead( res.statusCode, {
        'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' + res.statusMessage)
});

if (debug){
  app.get('/app/log/access', (req, res) => {
    try {
      const stmt = database.prepare('SELECT * FROM accesslog').all()
      res.status(200).json(stmt)
    }catch{
      console.error(e)
    }
  });

  app.get('/app/error', (err, req, res, next) => {
    throw new Error('Error test successful')
  });
}

function coinFlip() {
    return(Math.floor(Math.random()*2)==0)? 'heads':'tails';
}

app.get('/app/flip/', (req, res) => {
  const flip = coinFlip()
	res.status(200).json({ 'flip' : flip })
  res.end()
});

function coinFlips(flips) {
    const results = []
    for(let i=0; i<flips; i++){
      results[i] = coinFlip()
    }
    return results;
}

  function countFlips(array) {
    var headcount = 0
    var tailcount = 0
    for(let i =0; i < array.length; i++){
      if(array[i] === "heads"){
        headcount++
      }else{
        tailcount++
      }
    }
    return{
      tails: tailcount,
      heads: headcount
    }
  
  }

app.post('/app/flip/coins', (req, res) => {
  var number = req.body.number
  var raw = coinFlips(number)
  var summary = countFlips(raw)
  res.status(200).json({ 'raw' : raw , 'summary' : summary })
});

app.get('/app/flips/:number', (req, res) => {
	var number = req.params.number
  var raw = coinFlips(number)
  var summary = countFlips(raw)
  res.status(200).json({ 'raw' : raw , 'summary' : summary })
});

function flipACoin(call) {
    var flips = coinFlip();
    var result;
    if (flips === call){
      result = "win"
    }else {
      result = "lose"
    }
    return{
      call: call,
      flip: flips,
      result: result
    }
  }
app.post('/app/flip/call/', (req, res) => {
	var call = flipACoin(req.body.guess)
    res.status(200).json(call)
});

app.get('/app/flip/call/heads', (req, res) => {
	var call = flipACoin('heads')
    res.status(200).json(call)
});
app.get('/app/flip/call/tails', (req, res) => {
	var call = flipACoin('tails')
    res.status(200).json(call)
});



app.use(function(req, res) {
  res.status(404).send("Endpoint does not exist")
  res.type("text/plain")

})