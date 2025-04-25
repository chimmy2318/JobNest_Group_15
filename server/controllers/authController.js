const bcrypt = require("bcrypt");
const pool = require("../db");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM accounts WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    req.login(user, (err) => {
      if (err) return next(err);

      // On successful login, return the user data
      return res.json({ message: 'Logged in successfully', user });
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM accounts WHERE email = $1", [email]);
    if (result.rows.length > 0) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    // 🔍 Debug log before inserting
    console.log("Creating new user with:");
    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Hashed Password:", hash);


    const newUser = await pool.query(
      "INSERT INTO accounts (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hash]
    );
    req.login(newUser.rows[0], (err) => {
      if (err) {
        return res.status(500).json({ message: "Error during login after signup" });
      }
      // Return the user information in the response
      res.status(201).json({ message: "Signup successful", user: newUser.rows[0] });
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
/*
exports.loginSuccess = (req, res) => {
  if (req.user || req.session.user) {
    return res.status(200).json({ message: "Login successful", user: req.user || req.session.user });
  }
  res.status(401).json({ message: "Not authorized" });
};*/

exports.loginSuccess = (req, res) => {
try{
  // Check for user in session or via passport (Google OAuth)
  if (req.user || req.session.user) {
    const user = req.user || req.session.user;
    console.log('User session:', user);
    res.status(200).json({ message: "User Login", user });
  } else {
      console.log('Noooo user in session'); 
    res.status(401).json({ message: "Not Authorized" });
  }}
  catch{
    console.log(error);
  }
};

exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("http://localhost:3000");
  });
};