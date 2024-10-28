const sql = require("mssql");
const { connectToDatabase } = require("../config/dbConfig");
const userSchema = require("../schema/userSchema");

const insertUser = async (userData) => {
  let pool;
  try {
    pool = await connectToDatabase();

    const query = `
    INSERT INTO dbo.AbpUsers (Id, TenantId, UserName, NormalizedUserName, Name, Surname, Email, NormalizedEmail, 
    EmailConfirmed, PasswordHash, SecurityStamp, IsExternal, PhoneNumber, PhoneNumberConfirmed, 
    TwoFactorEnabled, LockoutEnd, LockoutEnabled, AccessFailedCount, ExtraProperties, ConcurrencyStamp, CreationTime, CreatorId,LastModificationTime, LastModifierId, IsDeleted, DeleterId, DeletionTime)
    OUTPUT inserted.*
    VALUES (@Id, @TenantId, @UserName, @NormalizedUserName, @Name, @Surname, @Email, @NormalizedEmail, 
    @EmailConfirmed, @PasswordHash, @SecurityStamp, @IsExternal, @PhoneNumber, @PhoneNumberConfirmed,
    @TwoFactorEnabled, @LockoutEnd, @LockoutEnabled, @AccessFailedCount, 
    @ExtraProperties, @ConcurrencyStamp, @CreationTime, @CreatorId, 
    @LastModificationTime, @LastModifierId, @IsDeleted, @DeleterId, @DeletionTime)
`;

    const result = await pool
      .request()
      .input("Id", sql.UniqueIdentifier, userData.Id)
      .input("TenantId", sql.UniqueIdentifier, userData.tenantId)
      .input("UserName", sql.VarChar, userData.userName)
      .input("NormalizedUserName", sql.VarChar, userData.normalizedUserName)
      .input("Name", sql.VarChar, userData.name)
      .input("Surname", sql.VarChar, userData.surname)
      .input("Email", sql.VarChar, userData.email)
      .input("NormalizedEmail", sql.VarChar, userData.normalizedEmail)
      .input("EmailConfirmed", sql.Bit, userData.emailConfirmed)
      .input("PasswordHash", sql.VarChar, userData.PasswordHash)
      .input("SecurityStamp", sql.VarChar, userData.securityStamp)
      .input("IsExternal", sql.Bit, userData.isExternal)
      .input("PhoneNumber", sql.VarChar, userData.phoneNumber)
      .input("PhoneNumberConfirmed", sql.Bit, userData.phoneNumberConfirmed)
      // .input("IsActive", sql.Bit, userData.isActive)
      .input("TwoFactorEnabled", sql.Bit, userData.twoFactorEnabled)
      .input("LockoutEnd", sql.DateTime, userData.lockoutEnd)
      .input("LockoutEnabled", sql.Bit, userData.lockoutEnabled)
      .input("AccessFailedCount", sql.Int, userData.accessFailedCount)
      .input("ExtraProperties", sql.VarChar, userData.extraProperties)
      .input("ConcurrencyStamp", sql.VarChar, userData.concurrencyStamp)
      .input("CreationTime", sql.DateTime, userData.creationTime)
      .input("CreatorId", sql.UniqueIdentifier, userData.creatorId)
      .input(
        "LastModificationTime",
        sql.DateTime,
        userData.lastModificationTime
      )
      .input("LastModifierId", sql.UniqueIdentifier, userData.lastModifierId)
      .input("IsDeleted", sql.Bit, userData.isDeleted)
      .input("DeleterId", sql.UniqueIdentifier, userData.deleterId)
      .input("DeletionTime", sql.DateTime, userData.deletionTime)
      .query(query);

    // Returning the inserted data
    return result.recordset[0]; // This returns the newly inserted user data
  } catch (err) {
    console.error("Error inserting user:", err);
    throw err;
  } finally {
    if (pool) {
      pool.close();
    }
  }
};

const findUserById = async ({ userName }) => {
  let pool;
  try {
    pool = await connectToDatabase();
    let result = await pool.request().input("userName", userName).query(`
          SELECT TOP 1 * FROM dbo.AbpUsers
          WHERE UserName = @userName
        `);

    // Directly return the first (and only) result if found
    return result.recordset[0] || null; // Return null if no user found
  } catch (error) {
    console.error("error from model", error);
    throw error;
  }
};
const findRole = async (role) => {
  let pool;
  try {
    pool = await connectToDatabase();
    let result = await pool.request().input("role", role).query(`
          SELECT TOP 1 * FROM dbo.AbpRoles
          WHERE Name = @role
        `);

    // Directly return the first (and only) result if found
    return result.recordset[0] || null; // Return null if no user found
  } catch (error) {
    console.error("error from role model", error);
  }
};

const userRoleSet = async (data) => {
  let pool;
  try {
    pool = await connectToDatabase();

    const query = `
              INSERT INTO dbo.AbpUserRoles (
                  UserId,RoleId,TenantId
              ) VALUES (
                  @UserId, @RoleId,@TenantId
              )
          `;

    const result = await pool
      .request()
      .input("UserId", sql.UniqueIdentifier, data.UserId)
      .input("RoleId", sql.UniqueIdentifier, data.RoleId)
      .input("TenantId", sql.UniqueIdentifier, data.TanentId)

      .query(query);

    return result;
  } catch (err) {
    console.error("Error inserting user role:", err);
    throw err;
  } finally {
    if (pool) {
      pool.close();
    }
  }
};

const getUserRole = async (userId) => {
  try {
    pool = await connectToDatabase();
    let result = await pool.request().input("userId", userId).query(`
              SELECT TOP 1 * FROM dbo.AbpUserRoles
              WHERE UserId = @userId
            `);

    // Directly return the first (and only) result if found
    return result.recordset[0] || null; // Return null if no user found
  } catch (error) {
    console.error("error from role model", error);
  }
};

const getAllApointment = async () => {
  let pool;
  try {
    pool = await connectToDatabase();
    let result = await pool.request().query(`
          SELECT * FROM dbo.SgAppointments
          ORDER BY Id DESC
        `); // Adjust the column name (e.g., `CreationDate`) to match your table's structure.

    console.log("------------result----------", result.recordset);

    // Return all results
    return result.recordset;
  } catch (error) {
    console.error("Error retrieving appointments:", error);
  }
};
const findRoleById = async (roleId) => {
  let pool;
  try {
    pool = await connectToDatabase();
    let result = await pool.request().input("roleId", roleId).query(`
            SELECT TOP 1 * FROM dbo.AbpRoles
            WHERE  Id= @roleId
          `);

    // Directly return the first (and only) result if found
    return result.recordset[0] || null; // Return null if no user found
  } catch (error) {
    console.error("error from role model", error);
  }
};

const changeUserPassword = async (userId, PasswordHash) => {
  let pool;
  try {
    pool = await connectToDatabase();
    const query = `
        UPDATE dbo.AbpUsers
        SET PasswordHash = @PasswordHash
        WHERE Id = @userId
      `;

    const result = await pool
      .request()
      .input("userId", sql.UniqueIdentifier, userId)
      .input("PasswordHash", sql.VarChar, PasswordHash)
      .query(query);

    console.log("Password updated successfully");
    return result.rowsAffected[0];
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  } finally {
    if (pool) {
      pool.close();
    }
  }
};

module.exports = {
  insertUser,
  findUserById,
  findRole,
  userRoleSet,
  getAllApointment,
  getUserRole,
  findRoleById,
  changeUserPassword,
};
