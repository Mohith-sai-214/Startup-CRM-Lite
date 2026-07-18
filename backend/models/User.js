import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Regular expression to validate standard email formats
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Mongoose Schema for the User model.
 * Contains user account details, roles, and password comparison functionality.
 */
export const userSchema = new mongoose.Schema(
  {
    /**
     * The full name of the user.
     * Must be between 2 and 50 characters.
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    /**
     * The unique email address of the user, stored in lowercase.
     * Validated using a regular expression for correct email formats.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Email must be a valid email address']
    },
    /**
     * The hashed password of the user.
     * Validated for a minimum length of 6 characters on input before hashing.
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    /**
     * The system role of the user.
     * Restrained to 'admin' and 'user'. Defaults to 'user'.
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be either admin or user'
      },
      default: 'user'
    },
    /**
     * Flag indicating whether the user account is active.
     * Defaults to true.
     */
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Pre-save middleware to hash the password before committing to MongoDB.
 * Salts the password with 10 rounds using bcryptjs.
 */
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares a candidate plain-text password with the hashed password in the database.
 * @param {string} candidatePassword - The plain-text password to verify.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Overrides the default serialization method to omit the password hash.
 * This guarantees password hashes are never leaked in API responses.
 * @returns {Object} Raw JavaScript object representing the user with password deleted.
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);
export default User;
