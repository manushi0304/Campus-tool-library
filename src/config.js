import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_tool_library',
  dbName: process.env.DB_NAME || 'campus_tool_library',
  nodeEnv: process.env.NODE_ENV || 'development'
};
