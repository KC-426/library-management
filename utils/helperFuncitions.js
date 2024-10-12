const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");
const app = require("../config/firebaseConfig");
const { v4: uuidv4 } = require("uuid");

const storage = getStorage(app);

async function uploadBookImageToFirebaseStorage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "Image file is required." });
    }

    const dateTime = giveCurrentDateTime();
    const uniqueFilename = `${uuidv4()}_${req.file.originalname}_${dateTime}`;
    const storageRef = ref(storage, `book-images/${uniqueFilename}`);
    const metadata = { contentType: req.file.mimetype };

    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded");

    return {
      name: req.file.originalname,
      path: storageRef.fullPath,
      url: downloadURL,
    };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while uploading the file.");
  }
}

async function deleteImageFromFirebaseStorage(imagePath) {
  try {
    const storageRef = ref(storage, imagePath);

    await deleteObject(storageRef);
  } catch (error) {
    if (error.code === "storage/object-not-found") {
      console.warn("Image not found in Firebase Storage, nothing to delete.");
    } else {
      console.error(error.message);
      throw new Error("An error occurred while deleting the image.");
    }
  }
}

function giveCurrentDateTime() {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
}

module.exports = {
  uploadBookImageToFirebaseStorage,
  deleteImageFromFirebaseStorage,
};
