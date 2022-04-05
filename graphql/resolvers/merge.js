const Partner = require("../../models/partner");

const transformPartner = (partner) => {
  return {
    ...partner._doc,
    _id: partner.id,
  };
};

exports.transformPartner = transformPartner;
