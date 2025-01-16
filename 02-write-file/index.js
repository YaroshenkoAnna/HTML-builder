const fs = require('fs');
const path = require('path');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});
fs.createWriteStream(path.join(__dirname, 'text.txt'));
console.log('Hi! Print something: ');
rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    sayGoodbye();
    return;
  }
  fs.appendFile(path.join(__dirname, 'text.txt'), input + '\n', (err) => {
    if (err) {
      console.error('Error!');
    }
  });
});

rl.on('SIGINT', sayGoodbye);

function sayGoodbye() {
  console.log('\nGoodbye! 👋');
  rl.close();
}
