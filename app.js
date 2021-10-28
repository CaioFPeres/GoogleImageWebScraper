const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');

const hostname = 'localhost';
const port = 3000;

function GETRequest(query, start) {

    let options = {
        hostname: "www.google.com",
        port: 443,
        path: "/search?tbm=isch&q=" + query + "&start=" + start,
        method: 'GET'
    }
    
    
    return new Promise(function(resolve, reject) {
        
        let data = "";

        
        let req = https.request(options, res => {

            res.on("data", datachunk => {
                data = data + datachunk;
            });

            res.on("end", () => {
                resolve(data);
            });
            
            
        });
        

        req.on('error', error => {
            console.error(error)
        });
    

        req.end();

    });

}


function saveToFile(data, name){
    fs.writeFile(name + ".html", data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}


setInterval( () => {

    GETRequest("batman", 10).then( data =>{
        saveToFile(data, "response");
    });


},5000);



const server = http.createServer( async (req, res) => {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    const requestUrl = url.parse(req.url);
    let completePath = requestUrl.pathname;
    let path = completePath.split('/').slice(1)[0];

    let fileContent;

    if(path == "")
        path = "index.html";

    try{
        fileContent = fs.readFileSync(path);
        res.end(fileContent, 'utf-8');
    }
    catch(err){
        console.log("Arquivo não encontrado: " + path);
        if(path != "favicon.ico"){
            res.statusCode = 404;
            fileContent = fs.readFileSync("404.html");
            res.end(fileContent);
        }
    }


});


function cleanup(){
    process.exit();
}
  
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});