import { customRedisRateLimiter } from './middlewares/rateLimiter.js';

import express from 'express';
import config from 'config';
const app = express();

app.use(customRedisRateLimiter);

const port = config.get('port.no') || process.env.PORT;

let len = config.get('car.slot_size');
let slotavailable = config.get('car.slot_size');

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
  const i=1;
  if (carDetails[no].carNum == 0) {
      return "Slot is already empty";
  }else if(i<=no && no<=len)
  {
    console.log('Emptying...');
    carDetails[no].carNum = 0;
    slotavailable += 1;
    return `Car removed succesfully from slot ${no}`;
  }else
  {
    return 'No such slot exist';
  }
}

function getDetails(no) {
  const i=1;
  const found = 0;
  if(i<=no && no <=len)
  {
    console.log(`${carDetails[no].carNum} is parked at slot ${carDetails[no].slotNum}`);
    return `${carDetails[no].carNum} is parked at slot ${carDetails[no].slotNum}`
  }
  else{
    for (var i = 0; i < len; i++) {
      if (carDetails[i].carNum == no) {
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
  console.log(`Server started on port ${port}.`);
});
