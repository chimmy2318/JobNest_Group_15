const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const pool = require("../db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:6005/api/auth/google/callback",
      scope: ["profile", "email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id: googleId, displayName, emails } = profile;
        const email = emails[0].value;

        const userResult = await pool.query("SELECT * FROM accounts WHERE google_id = $1", [googleId]);

        let user;
        if (userResult.rows.length === 0) {
          const insertResult = await pool.query(
            "INSERT INTO accounts (google_id, username, email) VALUES ($1, $2, $3) RETURNING *",
            [googleId, displayName, email]
          );
          user = insertResult.rows[0];
        } else {
          user = userResult.rows[0];
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
/*
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
*/
passport.serializeUser((user, done) => {
  done(null, user.id); // only store the user ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM accounts WHERE id = $1", [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});