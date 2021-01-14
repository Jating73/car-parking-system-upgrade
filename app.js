const express = require('express');
const config = require('config');
const redis = require('ioredis');
const app = express();

const redisPort=config.get('redisinfo.port');
const redisHost=config.get('redisinfo.host');

const client = redis.createClient({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || 'localhost',
});
client.on('connect', function () {
  console.log('connected');
});

let len = config.get('car.slot_size');
let slotavailable = config.get('car.slot_size');
let port = config.get('port.no') || process.env.port;

let carDetails = [];

function initial() {
  for (var i = 0; i < len; i++) {
    carDetails.push({
      carNum: 0,
      slotNum: i + 1
    });
  }
}

function parkCar(no) {
  if (slotavailable > 0) {
    for (i = 0; i < len; i++) {
      if (carDetails[i].carNum === 0) {
        carDetails[i].carNum = no;
        slotavailable -= 1;
        break;
      }
    }
    return "Car Parked Successfully";
  }
  else {
    return "No Slot available";
  }
}

function unparkCar(no) {
  found = 0;
  for (i = 0; i < len; i++) {
    if (carDetails[i].slotNum == no) {
      if (carDetails[i].carNum == 0) {
        return "Slot is already empty";
      } else {
        console.log('Emptying...');
        carDetails[i].carNum = 0;
        console.log(carDetails[i].carNum);
        slotavailable += 1;
      }
      found = 1;
      break;
    }
  }
  if (found == 1) {
    return `Car removed succesfully from slot ${no}`;
  } else {
    return 'No such slot exist';
  }
}

function getDetails(no) {
  found = 0;
  for (var i = 0; i < len; i++) {
    if (carDetails[i].carNum == no || carDetails[i].slotNum == no) {
      console.log(`${carDetails[i].carNum} is parked at slot ${carDetails[i].slotNum}`);
      found = 1;
      break;
    }
  }
  if (found == 1) {
    return `${carDetails[i].carNum} is parked at slot ${carDetails[i].slotNum}`
  } else {
    return "Car Details Doesn't exist";
  }
}

initial();

app.get("/", function (req, res) {
  res.send("Hello");
});

app.get("/park/:number", (req, res) => {
  result = parkCar(req.params.number);
  return res.json({
    message: result
  });
});

app.get("/unpark/:slot", (req, res) => {
  result = unparkCar(req.params.slot);
  res.json({
    message: result
  });
});

app.get("/getdetails/:number", (req, res) => {
  const number = Number(req.params.number);
  result = getDetails(number);
  res.json({
    message: result
  });
});


app.get('/getdetails', (req, res) => {
  res.json({ message: carDetails });
});

app.listen(port, function () {
  console.log("Server started on port 3000.");
});
