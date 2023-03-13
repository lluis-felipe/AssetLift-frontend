# AssetLift

This is the frontend to AssetLift application.
Using React and Carbon Design System para desig.

### Deploying 

Make sure you are logged into the IBM Cloud using the IBM Cloud CLI and have access 
to you development cluster. If you are using OpenShift make sure you have logged into OpenShift CLI on the command line.

```$bash
npm install --location=global @ibmgaragecloud/cloud-native-toolkit-cli
```

Use the IBM Garage for Cloud CLI to register the GIT Repo with Tekton or Jenkins, using `--tekton` flag if using Tekton:

```$bash
oc sync <project> [--tekton]
oc pipeline
```

Ensure you have the Cloud-Native Toolkit installed in your cluster to make this method of pipeline registry quick and easy [Cloud-Native Toolkit](https://cloudnativetoolkit.dev/)

#### Native Application Development

Install the latest [Node.js](https://nodejs.org/en/download/) 6+ LTS version.

Once the Node toolchain has been installed, you can download the project dependencies with:

```bash
npm install -g yarn
yarn install
```

##### Local development

To run application for local development and get live updates on code changes:

```sh
yarn start:dev
```

##### Test

To run unit tests:

```sh
yarn test
```

##### Run production build

To try a production build, run:

```sh
yarn build
yarn start
```

## Next Steps

* Learn more about augmenting your Node.js applications on IBM Cloud with the [Node Programming Guide](https://cloud.ibm.com/docs/node?topic=nodejs-getting-started).
* Explore other [sample applications](https://cloud.ibm.com/developer/appservice/starter-kits) on IBM Cloud.

## License

This sample application is licensed under the Apache License, Version 2. Separate third-party code objects invoked within this code pattern are licensed by their respective providers pursuant to their own separate licenses. Contributions are subject to the [Developer Certificate of Origin, Version 1.1](https://developercertificate.org/) and the [Apache License, Version 2](https://www.apache.org/licenses/LICENSE-2.0.txt).

[Apache License FAQ](https://www.apache.org/foundation/license-faq.html#WhatDoesItMEAN)
