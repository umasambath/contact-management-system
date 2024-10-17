const { Stack, Duration } = require('aws-cdk-lib');
const { Bucket, BlockPublicAccess } = require('aws-cdk-lib/aws-s3');
const { CfnOutput, RemovalPolicy } = require('aws-cdk-lib');
const { Distribution, ViewerProtocolPolicy } = require('aws-cdk-lib/aws-cloudfront');
const { S3Origin } = require('aws-cdk-lib/aws-cloudfront-origins');
const { Function, Runtime, Code } = require('aws-cdk-lib/aws-lambda');
const { Secret } = require('aws-cdk-lib/aws-secretsmanager');
const { HttpApi, HttpMethod } = require('aws-cdk-lib/aws-apigatewayv2');
const { HttpLambdaIntegration } = require('aws-cdk-lib/aws-apigatewayv2-integrations');
const { NodejsBuild } = require('deploy-time-build');

class InfraStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create the S3 bucket for the frontend
    const hostingBucket = new Bucket(this, 'FrontendBucket', {
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create the Lambda function
    const backendLambda = new Function(this, 'backendLambda', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset('../backendShell/backendShell'),
      handler: 'lambda.handler',
      memorySize: 512,
      timeout: Duration.seconds(30),
    });

    // Create the API Gateway
    const api = new HttpApi(this, 'HttpApi', {
      apiName: 'CMSBackendAPI',
      corsPreflight: {
        allowHeaders: ['*'],
        allowMethods: [HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE],
        allowOrigins: ['*'],
        maxAge: Duration.days(10),
      },
    });

    // Add the backend lambda as proxy integration (i.e all routes are forwarded to the lambda)
    api.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: new HttpLambdaIntegration('fn-integration', backendLambda, {}),
    });

    // Grant Lambda permission to read from Secrets Manager
    const secretName = "MongooseDB-ConnectionURL";
    const secret = Secret.fromSecretNameV2(this, 'MySecret', secretName);
    secret.grantRead(backendLambda);


    // Create the CloudFront distribution with behaviors defined
    const distribution = new Distribution(this, 'CloudfrontDistribution', {
      defaultBehavior: {
        origin: new S3Origin(hostingBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });


    // Build the frontend in codebuild - and deploy it to the S3 Bucket
    // Also replace the environment variable in the frontend with the API Gateway URL
    new NodejsBuild(this, 'ReactBuild', {
      assets: [
        {
          path: '../frontendShell',
          exclude: ['node_modules', 'build'],
          commands: ['npm i'],
        },
      ],
      buildCommands: ['npm run build'],
      buildEnvironment: {
        REACT_APP_CONNECTION_URL: api.apiEndpoint,
      },
      destinationBucket: hostingBucket,
      distribution,
      outputSourceDirectory: 'build',
    });

    // Outputs
    new CfnOutput(this, 'CloudFrontURL', {
      value: distribution.domainName,
      description: 'The distribution URL',
      exportName: 'CloudfrontURL',
    });

    new CfnOutput(this, 'BucketName', {
      value: hostingBucket.bucketName,
      description: 'The name of the S3 bucket',
      exportName: 'BucketName',
    });

    new CfnOutput(this, 'API Gateway URL', {
      value: api.url,
    });

  }
}

module.exports = { InfraStack };
