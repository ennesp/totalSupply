const express = require('express');
const Web3 = require('web3');
const config = require('./config.js');

const app = express();

var web3 = new Web3(Web3.givenProvider || config.apiURL);

var contractInstance = new web3.eth.Contract(config.tokenAbi, config.contractAddress);

app.get('/', function(req, res){
    contractInstance.methods.totalSupply().call().then(function(value) {
        const total = {totalSupply: value};
        res.send(total)
    }); 
});

const port = process.env.PORT || 5000;

app.listen(port, function(){
    console.log('Server started on port: ' + port);
});