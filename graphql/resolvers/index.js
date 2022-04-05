const partnerResolver = require("./partner");
const authResolver = require("./auth");

const rootResolver = {
  ...partnerResolver,
  ...authResolver,
};

module.exports = rootResolver;
