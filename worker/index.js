// const propertiesReader = require('properties-reader');
// const prop = PropertiesReader('worker.dev.properties');

// getProperty = (property) => {return prop.get(property);}

const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

redisClient.on('connect', function() {
  console.log('<Worker> connected');
});

redisClient.on("error", function(error) {
    console.error(error);
  });

// sample compute, using iterative method
function fibonacci_1(num) {
    var a = 1, b = 0, temp;
  
    while (num >= 0) {
      temp = a;
      a = a + b;
      b = temp;
      num--;
    }
  
    return b;
}
  
  // sample compute, using recursion
function fibonacci_2(num) {
    if (num <= 1) return 1;
    
    return fibonacci_2(num - 1) + fibonacci_2(num - 2);
}
  
// subscriber for message event, listening
const redisSubscriber = redisClient.duplicate();

redisSubscriber.on('message', (channel, message) => {
    // TODO: Validate message to be a number
    console.log('Got a message: ' + message);
    redisClient.hset('values', message, fibonacci_2(parseInt(message)));
});

// listen on insert message event
redisSubscriber.subscribe('insert');