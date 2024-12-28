require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.json());


const port = process.env.PORT || 8080;
const dbURL = process.env.DB_URL;

const loginRouter = require("./login/login.route");
const resourceRouter = require("./resources/resources.route");
const reservationRouter = require("./reservation/reservation.route");
app.use("/login", loginRouter);
app.use("/resources", resourceRouter);
app.use("/reservation", reservationRouter);

main()
  .then(() => console.log("Mongodb connect successfully!"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);
}


app.listen(
  port,
  () => {
    console.log(`pokrenuta je espress app na portu ${port}`);
  }
)