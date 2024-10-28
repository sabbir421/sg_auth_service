const sql = require("mssql");

// Configuration object
const config = {
  user: "sa",
  password: "Admin@123",
  server: "103.125.253.240",
  database: "SG.Identity",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Database connection function
const connectToDatabase = async () => {
  try {
    // Connect to the SQL server
    const pool = await sql.connect(config);
    console.log("Database connection established");
    return pool;
  } catch (err) {
    console.error("Error establishing database connection:", err);
    throw err;
  }
};

module.exports = {
  connectToDatabase,
};
