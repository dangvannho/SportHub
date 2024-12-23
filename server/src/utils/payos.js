const PayOS = require("@payos/node");
require('dotenv').config();
const Owner = require("../models/Owner");   
module.exports = new PayOS(
    Owner.schema.paths['payment_keys.client_id'].options.default,
    Owner.schema.paths['payment_keys.api_key'].options.default,
    Owner.schema.paths['payment_keys.checksum_key'].options.default
);




// module.exports = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY);