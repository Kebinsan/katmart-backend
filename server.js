const express = require("express");
//DEPENDENCIES
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");

//DB FILES
const { getUserByEmail, createNewUser } = require("./db/usersdb");
const { getAllProducts } = require("./db/productsdb");

const app = express();

const PORT = process.env.PORT || 8080;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//generates a JWT token with username and token secret
function generateAccessToken(username) {
  return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1800s" });
}

//authenticates the token when post/get requires it
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", async (req, res) => {
  try {
    const products = await getAllProducts();
    console.log(products);
    res.send(products);
  } catch (err) {
    throw err;
  }
});

/**
 * Endpoint /api/users/register
 */
app.post("/users/register", async (req, res) => {
  console.log(req.body);
  let { username, email, password, password2 } = req.body;

  console.log();
  let message = [];
  if (!username || !email || !password || !password2) {
    message.push("Please enter all fields.");
  }
  if (password.length < 6) {
    message.push("Password should be at least 6 characters.");
  }
  if (password != password2) {
    message.push("Passwords do not match.");
  }
  if (message.length > 0) {
    res.send({ success: false, message });
  } else {
    //Form validation passed
    let hashedPassword = await bcrypt.hash(password, 10);

    //get user by email from db
    const user = await getUserByEmail(email);

    if (user.rows.length > 0) {
      message.push("That email is already registered.");
      res.send({ success: false, message });
    } else {
      //creates a new user with username, email, and an encrypted password
      createNewUser(username, email, hashedPassword);

      res.send({
        success: true,
        message: "Account registration successful, please login.",
      });
    }
  }
});

app.post("/users/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  //get user by email from db
  const user = await getUserByEmail(email);

  if (user.rows.length > 0) {
    bcrypt.compare(password, user.rows[0].password, (error, isMatch) => {
      if (error) {
        throw error;
      }

      if (isMatch) {
        let token;
        try {
          //Creating jwt token
          token = generateAccessToken({
            username: user.rows[0].username,
          });
        } catch (error) {
          console.error(error);
        }

        res.send({
          success: true,
          message: "You have successfully logged in",
          token: token,
        });
      } else {
        res.send({
          success: false,
          message: "Email or password is incorrect.",
        });
      }
    });
  } else {
    res.send({
      success: false,
      message: "Email or password is incorrect.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
