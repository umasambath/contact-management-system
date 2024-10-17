/**
 * Author: Uma Sambathkumar
 * Date: 2024-10-16
 * Description: Establishing Connection to Mongoose DB & retriving the 
 *               secret from AWS secret Manager
 */
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");


require("dotenv").config();
const mongoose = require("mongoose");

/* Retriving the Mongoose DB Connection URL from AWS Secret Manager */
const getSecret = async () => {
  const secret_name = "MongooseDB-ConnectionURL";
  const client = new SecretsManagerClient({
    region: "us-east-1",
  });
  let response;
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT",
      })
    );
  } catch (error) {
    throw error;
  }
  const secret = JSON.parse(response.SecretString)
  return secret.MONGODB_URI;
}

/* Connection of Mongoose Database */
const connectDB = async () => {
  try {
    const connectionUri = await getSecret()
    await mongoose.connect(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
