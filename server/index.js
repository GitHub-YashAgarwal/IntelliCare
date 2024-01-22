const express = require("express");
const mongoose = require("mongoose");
const UserModel = require("./models/users");

require("dotenv").config();

const app = express();

const connectDb = async () =>
  await mongoose
    .connect(process.env.DB)
    .then(() => console.log("connected"))
    .catch((err) => console.log(err));

connectDb();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  console.log(req.body);

  const user = new UserModel({
    name,
    email,
    password,
  });

  console.log(user);

  await user.save();

  res.cookie("name", name);
  res.cookie("email", email).redirect(process.env.ACCESS_URL);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user) {
    if (user.password == password) {
      res.cookie("name", user.name);
      res.cookie("email", user.email).redirect(process.env.ACCESS_URL);
    } else {
      res.send("Password is not correct");
    }
  } else {
    res.send("No such user exists");
  }
});

app.listen(5000, () => {
  console.log("running server");
});
