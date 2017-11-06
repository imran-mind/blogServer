
var passwordHash = require('password-hash');

var hashedPassword = passwordHash.generate('imran');

console.log(hashedPassword); // sha1$3I7HRwy7$cbfdac6008f9cab4083784cbd1874f76618d2a97

console.log(passwordHash.verify('Password0', hashedPassword));