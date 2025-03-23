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
      const res = await this.provider.request('S3', 'getBucketVersioning', this.bucketParams);
      if (res.Status && res.Status === 'Enabled') {
        return true;
      }
      return false;
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

  // check bucket tags changed compare with previous set
  async checkBucketTagsChanged(tags) {
    this.serverless.cli.log('Comparing bucket tags.');
    try {
      const res = await this.provider.request('S3', 'getBucketTagging', this.bucketParams);

      if (JSON.stringify(res.TagSet) === JSON.stringify(tags)) {
        return false;
      }
      return true;
    } catch (e) {
      return true;
    }
  }

  async updateBucketTags(tags) {
    if (tags.length) {
      const params = {
        ...this.bucketParams,
        Tagging: {
          TagSet: tags,
        },
      };

      await this.provider.request('S3', 'putBucketTagging', params);
      this.serverless.cli.log(`Tags: ${tags.map((elm) => elm.Key).join(',')} created`);
    } else {
      await this.provider.request('S3', 'deleteBucketTagging', this.bucketParams);
      this.serverless.cli.log('All tags removed');
    }
  }

  async createDeploymentBucket() {
    // Get bucket name from serverless.yml configuration
    const bucketName = this.serverless.service.provider.deploymentBucket || '';
    const bucketProperties = this.serverless.service.custom.deploymentBucket;
    const bucketVersioning = bucketProperties.versioning || false;
    const bucketTags = bucketProperties.tags || [];

    if (!bucketName) {
      this.serverless.cli.log('No deployment bucket provided.');
      return;
    }

    this.bucketParams = {
      Bucket: bucketName,
    }

    try {
      // check if bucket already exists
      if (await this.bucketExists(bucketName)) {
        this.serverless.cli.log(`Deployment bucket '${bucketName}' already exists.`);
      } else {
        // need to create the new bucket
        await this.createBucket(bucketName);
      }

      // add bucket versioning if needed
      if (await this.checkBucketVersionExists() !== bucketVersioning) {
        /// await this.createBucketVersioning(bucketVersioning);

        this.serverless.cli.log(`Versioning ${bucketVersioning ? 'Enabled' : 'Disabled'} on bucket ${bucketName}`);
      }

      // add encryption


      // add tags
      if (await this.checkBucketTagsChanged(bucketTags)) {
        await this.updateBucketTags(bucketTags);
      }
    } catch (error) {
      this.serverless.cli.log(`Error creating deployment bucket: ${error.message}`);
      throw error;
    }
  }




}

module.exports = MyPlugin;
