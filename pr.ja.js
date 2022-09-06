// const a = require('./prueba')
console.log(__dirname);
console.log(__filename);
let x = [1,2]
let y = [3,4]
// x.pop()
// x.push(4,5)
console.log([...x, ...y]);
console.log({...x, ...y});

// const person = { name: "dave", x: "lo se"}
// console.log(Object.keys(person).map(x=> x.toUpperCase()));