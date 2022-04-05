const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
  createUser: async (args) => {
    // to not store 2 user with same email;
    //find one input - findOne where email from database = email from input
    console.log(args);
    try {
      const existingUser = await User.findOne({
        email: args.userInput.email,
      });

      if (existingUser) {
        throw new Error("User exists alreaady!");
      }
      //we won't store password as plain string
      // will use a package bcrypt to hashing password and salting = 12 ~ (12 levels )
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await user.save();

      //as at events to receive information and distructuring id
      // to not return the password , password will be null  when i will return from database
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // destructuring the object args => ({ email, password })
  login: async ({ email, password }) => {
    console.log(email, password);
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("User does not exist");
    }
    //compare the password typed with the password from database
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect");
    }
    //generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      //key to hash the token
      "somesupersecretkey",
      { expiresIn: "1h" }
    );
    return {
      token: token,
      tokenExpiration: 1,
    };
  },
  auth: async ({ email, password }) => {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("User does not exist");
    }
    //compare the password typed with the password from database
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect");
    }
    //generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      //key to hash the token
      "somesupersecretkey",
      { expiresIn: "1h" }
    );
    return {
      // userId: user.id,
      token: token,
      tokenExpiration: 1,
      // isAdmin: isAdmin,
      // email: email,
    };
  },
};
