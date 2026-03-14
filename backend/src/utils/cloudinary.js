const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper to upload a Base64 string to Cloudinary.
 * @param {string} base64String - The data URI string.
 * @param {string} folder - The folder to upload into (e.g. "civic/reports").
 * @returns {Promise<string>} The secure_url returned by Cloudinary.
 */
async function uploadBase64Image(base64String, folder = "civic/reports") {
  if (!base64String) return null;
  // If we already get passed a valid https url, just pass it through 
  if (base64String.startsWith("http")) return base64String;

  try {
    const uploadResponse = await cloudinary.uploader.upload(base64String, {
      folder,
      resource_type: "image",
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
}

module.exports = {
  uploadBase64Image,
};
