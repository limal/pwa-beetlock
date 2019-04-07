const WB_CLOUD_URL = "http://open.wb-lock.com:32100";
// const WB_CLOUD_URL = "http://localhost:5001";
const WB_NODE_PROTOCOL = "http://";
const WB_NODE_PORT = 3001;

const centralHost = (ipAddress, request) => {
  console.log(`${WB_NODE_PROTOCOL}${ipAddress}:${WB_NODE_PORT}${request}`);
  return `${WB_NODE_PROTOCOL}${ipAddress}:${WB_NODE_PORT}${request}`;
};

export const endpoints = {
  findBridge: `${WB_CLOUD_URL}/get-bridge`,
  getStatus: ipAddress => centralHost(ipAddress, "/status")
};

export const wifiEndpoints = {
  connectWifi: ipAddress => `${WB_NODE_PROTOCOL}${ipAddress}/wifi`,
  getWifis: ipAddress => `${WB_NODE_PROTOCOL}${ipAddress}/`
};
