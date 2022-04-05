const moongoose = require("mongoose");
const Partner = require("../../models/partner");

const { transformPartner } = require("./merge");

module.exports = {
  partners: async () => {
    try {
      const partners = await Partner.find();
      return partners?.map((partner) => {
        return transformPartner(partner);
      });
    } catch (err) {
      throw err;
    }
  },
  createPartner: async (args, { file }) => {
    console.log(args);

    const { createReadStream, filename, mimetype, encoding } = await file;
    const stream = createReadStream();

    const pathName = path.join(__dirname, `public/images${filename}`);
    await stream.pipe(fs.createWriteStream(pathName));

    const partner = new Partner({
      name: args.partnerInput.name,
      email: args.partnerInput.email,
      description: args.partnerInput.description,
      partnerImage: `http://localhost:4000/images/${filename}`,
    });

    let createdPartner;

    try {
      const result = await partner.save();
      createdPartner = transformPartner(result);

      return createdPartner;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  deletePartner: async (args) => {
    try {
      await Partner.deleteOne({ _id: args.partnerId });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  editPartner: async (args) => {
    try {
      console.log(args.partnerId);
      return Partner.findByIdAndUpdate(
        { _id: args.partnerId },
        {
          name: args.partnerInput.name,
          email: args.partnerInput.email,
          description: args.partnerInput.description,
          partnerImage: args.partnerInput.partnerImage,
        }
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
