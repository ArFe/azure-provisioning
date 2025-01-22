## Provisioning Azure devices for IoT Central ##

This repository contains a set of scripts to provision devices in Azure IoT Central.

run npm install to install the required packages.

```bash
npm install
```

Set these on the index.js file:

```javascript
const idScope = '{ID scope}';
const deviceId = '{Device ID}';
const symmetricKey = '{SAS Primary key}';
```

Run the script:

```bash
npm run start
```

The script will provision the device in Azure IoT Central and will output the connection parameters.

This script is based on [this](https://stackoverflow.com/a/63035230) code by [Peter Bons](https://stackoverflow.com/users/932728/peter-bons)