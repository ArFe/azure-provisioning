// npm install azure-iot-device azure-iot-device-mqtt azure-iot-provisioning-device-mqtt azure-iot-security-symmetric-key --save

"use strict";

// Use the Azure IoT device SDK for devices that connect to Azure IoT Central.
const iotHubTransport = require('azure-iot-device-mqtt').Mqtt;
const Client = require('azure-iot-device').Client;
const Message = require('azure-iot-device').Message;
const ProvisioningTransport = require('azure-iot-provisioning-device-mqtt').Mqtt;
const SymmetricKeySecurityClient = require('azure-iot-security-symmetric-key').SymmetricKeySecurityClient;
const ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;
const crypto = require('crypto');

const provisioningHost = 'global.azure-devices-provisioning.net';
const idScope = '{ID scope}';
const deviceId = '{Device ID}';
const symmetricKey = '{SAS Primary key}';
const expiration = 60 * 24 * 7; // 1 week in number of minutes
const provisioningSecurityClient = new SymmetricKeySecurityClient(deviceId, symmetricKey);
const provisioningClient = ProvisioningDeviceClient.create(provisioningHost, idScope, new ProvisioningTransport(), provisioningSecurityClient);

const generateSasToken = function(resourceUri, signingKey, policyName, expiresInMins) {
  resourceUri = encodeURIComponent(resourceUri);

  // Set expiration in seconds
  const expires = Math.ceil((Date.now() / 1000) + expiresInMins * 60);
  const toSign = resourceUri + '\n' + expires;

  // Use crypto
  const hmac = crypto.createHmac('sha256', Buffer.from(signingKey, 'base64'));
  hmac.update(toSign);
  const base64UriEncoded = encodeURIComponent(hmac.digest('base64'));

  // Construct authorization string
  const token = "SharedAccessSignature sr=" + resourceUri + "&sig="
  + base64UriEncoded + "&se=" + expires;
  if (policyName) token += "&skn="+policyName;
  return token;
};

provisioningClient.register((err, result) => {
    if (err) {
      console.log('Error registering device: ' + err);
    } else {
      console.log('Registration succeeded');
      console.log('Assigned hub=' + result.assignedHub);
      // console.log('DeviceId=' + result.deviceId);
      // const connectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';SharedAccessKey=' + symmetricKey;
      // console.log(connectionString);
      const endpoint = `${result.assignedHub}/devices/${result.deviceId}`;
      const token = generateSasToken(endpoint, symmetricKey, null, expiration);
      console.log("\n\nhost: " + result.assignedHub);
      console.log("clientid: " + result.deviceId);
      console.log("username: " + result.assignedHub + '/' + result.deviceId + '/api-version=2018-06-30');
      console.log("password: " + token);
    }
  });
