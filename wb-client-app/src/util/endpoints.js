const WB_CLOUD_URL = "http://open.wb-lock.com:32100";
// const WB_CLOUD_URL = "http://localhost:5001";
const WB_NODE_PROTOCOL = "http://";
const WB_NODE_PORT = 3001;

const centralHost = (ipAddress, request) => {
  return `${WB_NODE_PROTOCOL}${ipAddress}:${WB_NODE_PORT}${request}`;
};

export const endpoints = {
  base: ipAddress => centralHost(ipAddress, "/"),
  auth: ipAddress => centralHost(ipAddress, "/auth"),
  findBridge: `${WB_CLOUD_URL}/get-bridge`,
  getBattery: ipAddress => centralHost(ipAddress, "/com/battery"),
  getBatteryCached: ipAddress => centralHost(ipAddress, "/com/batteryCached"),
  getLockState: ipAddress => centralHost(ipAddress, "/user/lockState"),
  getOccupied: ipAddress => centralHost(ipAddress, "/user/occupied"),
  getStatus: ipAddress => centralHost(ipAddress, "/status"),
  readFromLock: ipAddress => centralHost(ipAddress, "/com/read"),
  register: ipAddress => centralHost(ipAddress, "/user"),
  userInfo: ipAddress => centralHost(ipAddress, "/user/info"),
  sendToLock: ipAddress => centralHost(ipAddress, "/com/write")
};

export const wifiEndpoints = {
  connectWifi: ipAddress => `${WB_NODE_PROTOCOL}${ipAddress}/wifi`,
  getWifis: ipAddress => `${WB_NODE_PROTOCOL}${ipAddress}/`
};
