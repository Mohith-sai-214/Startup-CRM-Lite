import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Override default DNS servers to bypass ISP DNS resolution issues with SRV records
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Load environment variables
dotenv.config();

/**
 * Connect to MongoDB Atlas.
 * Configures database connection with explicit options and a fallback for newer Mongoose versions.
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    let conn;
    try {
      // Connect to MongoDB using the required useNewUrlParser and useUnifiedTopology options.
      conn = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    } catch (optionsError) {
      // Fallback: newer versions of Mongoose (v6+) throw when unsupported options are passed.
      if (
        optionsError.message.includes('usenewurlparser') ||
        optionsError.message.includes('useunifiedtopology')
      ) {
        conn = await mongoose.connect(mongoUri);
      } else {
        throw optionsError;
      }
    }

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Terminate process with failure code
    process.exit(1);
  }
};
