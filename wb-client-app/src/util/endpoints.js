const WB_CLOUD_URL = "http://open.wb-lock.com:32100";
// const WB_CLOUD_URL = "http://localhost:5001";
const WB_NODE_PROTOCOL = "http://";

export const endpoints = {
  connectWifi: ipAddress => `${WB_NODE_PROTOCOL}${ipAddress}/wifi`,
  getBridge: `${WB_CLOUD_URL}/get-bridge`,
  getWifis: ipAddress => `${WB_NODE_PROTOCOL}${ipAddress}/`
};
