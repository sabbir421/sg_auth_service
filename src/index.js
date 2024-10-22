const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const routes = require("./routes/routes");


const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors("*"));

app.use(routes);

// Start server
app.listen(8001, () => {
  console.log(`API server listening on port 8001`);
});
