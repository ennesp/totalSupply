const express = require('express');
const Web3 = require('web3');
const config = require('./config.js');

const app = express();

var web3 = new Web3(Web3.givenProvider || config.apiURL);

var contractInstance = new web3.eth.Contract(config.tokenAbi, config.contractAddress);
var bankInstance = new web3.eth.Contract(config.bankAbi, config.bankAddress);

var tokenDecimals = 4;
var decimals = (10 ** tokenDecimals);

app.get('/', function(req, res){
    bankInstance.methods.distributedTokens().call().then(function(distributedTokens) {
        contractInstance.methods.totalSupply().call().then(function(totalSupply) {
          //calculate
          var bankedSupply = totalSupply / 2; //how much tokens locked in bank, by design 50%
          var circulatingSupply = parseInt(totalSupply) - parseInt(bankedSupply) + parseInt(distributedTokens);
          var realSupply = circulatingSupply/decimals;
          var realTotalSupply = totalSupply/decimals;
          var value = {
              totalSupply: realTotalSupply,
              circulatingSupply: realSupply
          }

          res.send(value)
        });
      });
});

app.get('/totalSupply', function(req, res){
    contractInstance.methods.totalSupply().call().then(function(value) {
        var realTotalSupply = value/decimals;
        res.send(realTotalSupply.toString());
    });
});

app.get('/circulatingSupply', function(req, res){
    bankInstance.methods.distributedTokens().call().then(function(distributedTokens) {
        contractInstance.methods.totalSupply().call().then(function(totalSupply) {
          //calculate
          var bankedSupply = totalSupply / 2; //how much tokens locked in bank, by design 50%
          var circulatingSupply = parseInt(totalSupply) - parseInt(bankedSupply) + parseInt(distributedTokens);
          var realSupply = circulatingSupply/decimals;
          res.send(realSupply.toString());
        });
      });
});

const port = process.env.PORT || 5000;

app.listen(port, function(){
    console.log('Server started on port: ' + port);
});