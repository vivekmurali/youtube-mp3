const fs = require("fs");

fs.readFile("count.txt", (err, data) => {
  if (err) throw err;
  console.log(Number(data));
});
