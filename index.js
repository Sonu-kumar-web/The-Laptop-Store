const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

const laptopData = JSON.parse(json);
// console.log(laptopData);

// Creating a server
const server = http.createServer((req, res) => {
    // console.log(req.url);

    const pathName = url.parse(req.url, true).pathname;
    // console.log(pathName);

    // const query = url.parse(req.url, true).query;
    // console.log(url.parse(req.url, true));

    const id = url.parse(req.url, true).query.id;
    // console.log(id);
    
    // PRODUCTS OVERVIEW
    if(pathName === '/products' || pathName === '/'){
        res.writeHead(200, {'content-type': 'text/html'});
        // res.end('This is PRODUCT page');
        
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {

                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                // console.log(cardsOutput);
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                res.end(overviewOutput);
            });

        });
        
    }
    
    // LAPTOP DETAIL
    else if(pathName === '/laptop' && id<laptopData.length){
        res.writeHead(200, {'content-type': 'text/html'});
        // res.end(`This is the LAPTOP page for laptop id ${id}`);
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });
    }
    
    // IMAGE (Regular Expression for recognize the image --> (/\.(jpg|jpeg|png|gif)$/i).test(pathName))
    else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){
        fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
            res.writeHead(200, {'content-type': 'image/jpg'});
            res.end(data);
        });
    }

    // URL NOT FOUND
    else{
        res.writeHead(404, {'content-type': 'text/html'});
        res.end('URL was not found on the server'); 
    }

});

const INR = (price) => price*76;

// Listening the specific port and specific IP address
// 127.0.0.1 --> localhost://8000 or http://127.0.0.1:8000/
server.listen(8000, '127.0.0.1', (err) => {
    if(err){
        console.log('Error in running the server');
    }
    console.log('Server is running !!!');
    
});

function replaceTemplate(originalHtml, laptop){
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, INR(laptop.price));
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}


