class MyPlugin {
  constructor(serverless, options) {
    // service configuration at runtime
    this.serverless = serverless;
    // example --verbose like options via cli (options.verbose)
    this.options = options;
    // bind to specific provider
    this.provider = this.serverless.getProvider('aws');

    this.bucketParams = {};

    this.commands = {
      'testDeploymentBucket': {
        lifecycleEvents: ['create'],
      },
    }
    this.hooks = {
      'before:package:initialize': this.createDeploymentBucket.bind(this),
      'deploy:deploy': this.createDeploymentBucket.bind(this),
      'testDeploymentBucket:create': this.createDeploymentBucket.bind(this),
    };
  }

  async bucketExists() {
    try {
      await this.provider.request('S3', 'headBucket', this.bucketParams);
      return true;
    } catch (e) {
      if (e.code !== 'AWS_S3_HEAD_BUCKET_NOT_FOUND') {
        throw e;
      }

      return false;
    }
  }

  async createBucket() {
    const params = {
      ...this.bucketParams,
      ACL: 'private',
      // region: this.serverless.service.provider.region || 'us-east-1',
    };

    // create a new bucket
    await this.provider.request('S3', 'createBucket', params);

    this.serverless.cli.log(`Deployment bucket '${this.bucketParams.Bucket}' created.`);
  }

  async bucketEncryptionExists() {
    try {
      await this.provider.request('S3', 'getBucketEncryption', this.bucketParams);
      return true;
    } catch (e) {
      return false;
    }
  }

  async createBucketEncryption(encyptionAlgorithm, kmsKey) {
    const params = {
      ...this.bucketParams.name,
      ServerSideEncryptionConfiguration: {
        Rules: [{
          ApplyServerSideEncryptionByDefault: {
            SSEAlgorithm: encyptionAlgorithm,
            KMSMasterKeyID: kmsKey,
          },
        }],
      },
    };

    await this.provider.request('S3', 'putBucketEncryption', params);
    this.serverless.cli.log(`Deployment bucket '${this.bucketParams.Bucket}' encryption created.`);
  }

  async checkBucketVersionExists() {
    try {
      await this.provider.request('S3', 'getBucketVersioning', this.bucketParams);
      return true;
    } catch (e) {
      return false;
    }
  }

  async createBucketVersioning(status) {
    const params = {
      ...this.bucketParams,
      VersioningConfiguration: {
        Status: status ? 'Enabled' : 'Suspended',
      },
    };

    await this.provider.request('S3', 'putBucketVersioning', params);
    this.serverless.cli.log(`Deployment bucket '${this.bucketParams.Bucket}' versioning updated.`);
  }

  async createDeploymentBucket() {
    // Get bucket name from serverless.yml configuration
    const bucketName = this.serverless.service.provider.deploymentBucket || '';
    const bucketProperties = this.serverless.service.custom.deploymentBucket;
    const bucketVersioning = bucketProperties.versioning || false;

    if (!bucketName) {
      this.serverless.cli.log('No deployment bucket provided.');
      return;
    }

    this.bucketParams = {
      Bucket: bucketName,
    }

    try {
      this.serverless.cli.log(`Checkign if the deployment bucket ${bucketName} exists`);

      // check if bucket already exists
      if (await this.bucketExists(bucketName)) {
        this.serverless.cli.log(`Deployment bucket '${bucketName}' already exists.`);
      } else {
        // need to create the new bucket
        await this.createBucket(bucketName);
      }

      // add bucket versioning if needed
      if (bucketVersioning) {
        const hasVersioning = await this.checkBucketVersionExists();
        console.log('com', hasVersioning);

        if (!hasVersioning) {
          console.log('inside');
          await this.createBucketVersioning(bucketVersioning);
        }

        this.serverless.cli.log(`Versioning ${bucketVersioning ? 'Enabled' : 'Disabled'} on bucket ${bucketName}`);
      }



    } catch (error) {
      this.serverless.cli.log(`Error creating deployment bucket: ${error.message}`);
      throw error;
    }
  }




}

module.exports = MyPlugin;
