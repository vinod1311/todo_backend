const moment = require("moment");
const { randomBytes } = require("crypto");

// Create a new enquiry
exports.formatDate = async (date) => {
  try {
    const dateToSend = moment(date);
    const dateFormat = dateToSend.format("DD/MM/YYYY");
    if (dateFormat === "Invalid date") {
      return "-";
    } else {
      return dateFormat;
    }
  } catch (err) {
    console.error(err);
    return "-";
  }
};

// Function to generate a random password
exports.generateRandomPassword = () => {
  const randomBytesLength = 8; // Adjust the length of the random password as needed
  return randomBytes(randomBytesLength).toString("hex");
};
