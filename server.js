const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');
const port = process.env.PORT || 3000;
const viewPath = __dirname + '/views/';

var sockets = [];

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public/"));

app.get('/', (req, res) => {
  res.render(viewPath + "index");
  res.end();
});

io.on('connection', (socket) => {
  console.log("Socket connected");

  socket.on("recieveHighScore", (data) => {
    let dataArray = data.split("-");

    console.log(dataArray[0] + " added their score of " + dataArray[dataArray.length - 1]);

    let score = {
      name: dataArray[0],
      score: dataArray[dataArray.length - 1],
      time: new Date().toLocaleString()
    };

    let jsonData = JSON.stringify(score, null, 2);

    fs.appendFile("score-list.json", "-\n" + jsonData , function (err) {
       if (err) throw err;
       console.log('Score added!');
    });
  });

  sockets.push(socket);

  fs.readFile('score-list.json', (err, data) => {
      if (err) throw err;

      var strLines = String(data).split("-");
      //console.log(strLines[0]);

      let newData = "Recent scores<hr/>";

      for (let i = 0; i < strLines.length; i++)
      {
        let score = JSON.parse(strLines[i].replace('-', ''));
        newData += score.time + " - " + score.name + ": " + score.score + "<br/>";
      }

      socket.emit("getRecentActivity", newData);
  });
});

server.listen(port, () => {
  console.log("Using port: " + port);
});
