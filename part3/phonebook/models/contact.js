const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
console.log("connecting to mongodb");
console.error(url)
mongoose
  .connect(url)
  .then((result) => console.log("connected to mongodb"))
  .catch((error) => console.log("error connecting to mongodb", error.message));

const contactScheme = new mongoose.Schema({
  name: String,
  number: String,
});

contactScheme.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("contact", contactScheme);
