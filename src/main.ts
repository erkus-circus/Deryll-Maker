var app = require('express')();
var http = require('http').createServer(app);

app.get('/', function (req:any, res:any) {
    res.sendFile(__dirname + "/../web" + req.path);
});

http.listen(80, function () {
    console.log('listening on *:3000');
});