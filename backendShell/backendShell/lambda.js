/**
 * Author: Uma Sambathkumar
 * Date: 2024-10-16
 * Description: Starting File of Backend Service
 */

const serverlessExpress = require('@codegenie/serverless-express')
const app = require('./src/handler');


exports.handler = serverlessExpress({ app })