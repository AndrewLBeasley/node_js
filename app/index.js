//this is the entry to the API


//dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");
const _data = require("./lib/data");

//TESTING

_data.read('test', 'newFile', (err, data)=>{
    console.log('server call')
    console.log('test failed', err);
    console.log('this was the data', data);
})

//instantiating http server
const httpServer = http.createServer((req, res)=>{
    unifiedServer(req, res);  
});

//start the server, and have it listen
httpServer.listen(config.httpPort, ()=>{
    console.log(`the server is listening on port: ${config.httpPort}`);
});

//instantiating https server
//creating https server options
let httpsServerOptions = 
{
    'key':fs.readFileSync('./https/key.pem'),
    'cert':fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsServerOptions,(req,res)=>{
    unifiedServer(req, res);
})

httpsServer.listen(config.httpsPort, ()=>{
    console.log(`the server is listening on port: ${config.httpsPort}`);
});

//all the server logic for both http/https
const unifiedServer = function(req, res){
     //get the url and parse it, also parses query string data
     let parsedUrl = url.parse(req.url, true);

     //get the path from the url
     let path = parsedUrl.pathname;
     let trimmedPath = path.replace(/^\/+|\/+$/g,'')
 
     //get query string as an object 
     let qsObj = parsedUrl.query;
 
     //get the http method
     let method = req.method.toUpperCase();
 
     //get the headers as an object
     let headers = req.headers;
 
     //log the path request
     console.log(trimmedPath);
     trimmedPath.length>0?null:trimmedPath = '" "';
     console.log(`request received on path: ${trimmedPath} with ${method}`, qsObj);
     
 
     //get the payload
     let decoder = new StringDecoder('utf-8');
     let buffer = "";
     req.on('data', (data)=>{
         buffer += decoder.write(data);
     });
     req.on('end', ()=>{
         buffer +=decoder.end();
 
         //choose the handler this request should go to
         //if one is not found use the notfound handler
         let chosenHandler = typeof(router[trimmedPath]) !==         'undefined'? router[trimmedPath]: handlers.notFound
 
         //construct data object to send to handler
         let data = {
             'trimmedPath': trimmedPath,
             'queryString':  qsObj,
             'method' : method,
             'headers' : headers,
             'payload' : buffer
         };
 
         //route the request to the chosen handler
         chosenHandler(data, function(statusCode, payload){
             //use the status code called back by the handler or     default to 200
             //use the payload called back by the handler or         default to an empty object
 
             statusCode = typeof(statusCode) == 'number'?            statusCode : 200;
 
             payload = typeof(payload) == 'object' ? 
                 payload : {};
 
             let payloadString = JSON.stringify(payload);
 
              //send the response
             res.setHeader('Content-Type','application/JSON')
             res.writeHead(statusCode);
             res.end(payloadString);
             console.log(`Returning this response: ${statusCode},    ${payloadString}`);
         })      
     })
}


//define handlers
let handlers = {};

//ping handler
handlers.ping = function(data, callback){
    callback(200, {'message':'success'})
}
//not found handler
handlers.notFound =  function(data, callback){
    callback(406);
};

//Define a request route
let router = { 
    'ping' : handlers.ping
};