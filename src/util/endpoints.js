const WB_CLOUD_URL = "http://open.wb-lock.com:5001";
const WB_NODE_PROTOCOL = "http://";

export const endpoints = {
  getBridge: `${WB_CLOUD_URL}/get-bridge`,
  getWifis: ipAddress => `${WB_NODE_PROTOCOL}${ipAddress}/`
};
