{/*const pool = require('../db'); // Your PostgreSQL pool connection

const getProfile = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await pool.query(
      'SELECT name, email, skills, education, enable FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // Parse education array if not null
    const education = user.education ? user.education : [];

    res.json({
      name: user.name || '',
      email: user.email || '',
      skills: user.skills || '',
      education,
      enable: user.enable
    });

  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};const updateProfile = async (req, res) => {
  const userId = req.user?.id;
  const userEmail = req.user?.email;
  let { name, skills, education , enable} = req.body;

  if (!userId || !userEmail) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Filter out empty education entries
  education = education.filter(
    (edu) =>
      edu.major?.trim() !== '' ||
      edu.university?.trim() !== '' ||
      edu.graduationYear?.trim() !== ''
  );

  try {
    const result = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    const educationArray = education.map(item => JSON.stringify(item));

    if (result.rows.length > 0) {
      await pool.query(
        'UPDATE users SET name = $1, skills = $2, education = $3, enable=$4  WHERE id = $4',
        [name, skills, educationArray, enable, userId]
      );
      return res.json({ message: 'Profile updated successfully' });
    } else {
      await pool.query(
        'INSERT INTO users (id, email, name, skills, education, enable) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, userEmail, name, skills, educationArray, enable]
      );
      return res.json({ message: 'Profile created successfully' });
    }

  } catch (err) {
    console.error('Error updating/creating profile:', err);
    res.status(500).json({ error: 'Failed to update or create profile' });
  }
};


module.exports = { getProfile, updateProfile };







*/}



const pool = require('../db'); // Your PostgreSQL pool connection

const getProfile = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await pool.query(
      'SELECT name, email, skills, education, enable FROM users WHERE id = $1',
      [userId]
    );
    

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // Parse education array if not null
    const education = user.education ? user.education : [];

    res.json({
      name: user.name || '',
      email: user.email || '',
      skills: user.skills || '',
      education,
      enable: user.enable ?? true
    });
    

  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};const updateProfile = async (req, res) => {
  const userId = req.user?.id;
  const userEmail = req.user?.email;
  let { name, skills, education, enable } = req.body;

  if (!userId || !userEmail) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Filter out empty education entries
  education = (education || []).filter(
    (edu) =>
      edu.major?.trim() !== '' ||
      edu.university?.trim() !== '' ||
      edu.graduationYear?.trim() !== ''
  );

  // Default enable to true if undefined
  enable = typeof enable === 'boolean' ? enable : true;

  try {
    const result = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    const educationArray = education.map(item => JSON.stringify(item));

    if (result.rows.length > 0) {
      // Update user
      await pool.query(
        'UPDATE users SET name = $1, skills = $2, education = $3, enable = $4 WHERE id = $5',
        [name, skills, educationArray, enable, userId]
      );
      return res.json({ message: 'Profile updated successfully' });
    } else {
      // Create new user
      await pool.query(
        'INSERT INTO users (id, email, name, skills, education, enable) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, userEmail, name, skills, educationArray, enable]
      );
      return res.json({ message: 'Profile created successfully' });
    }

  } catch (err) {
    console.error('Error updating/creating profile:', err);
    res.status(500).json({ error: 'Failed to update or create profile' });
  }
};



module.exports = { getProfile, updateProfile };