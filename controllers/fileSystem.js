const {
  parseLocalDriveIntoJson,
  checkIfDirExists,
} = require("../utils/fileSystem.js");

const { prisma } = require("../db/config");
const { driveFolderPath } = require("../utils/constants.js");

const createFileSystemToRemoteDb = async (_, res) => {
  const exists = await checkIfDirExists(driveFolderPath);
  if (exists) {
    const json = await parseLocalDriveIntoJson(driveFolderPath);
    // console.log(json);
    const data = await prisma.storage.create({ data: { fileSystem: json } });
    res.status(200).json({
      message: "File system pushed to remote database",
      repository: data,
    });
  } else {
    res.status(400).json({ message: "drive folder does not exists" });
  }
};

const updateFileSystemToRemoteDb = async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: "id not provided" });
  }
  const exists = await checkIfDirExists(driveFolderPath);
  if (exists) {
    const json = await parseLocalDriveIntoJson(driveFolderPath);
    const data = await prisma.storage.update({
      where: { id: parseInt(id) },
      data: { fileSystem: json },
    });
    res.status(200).json({
      message: "File system pushed to remote database",
      repository: data,
    });
  } else {
    res.status(400).json({ message: "drive folder does not exists" });
  }
};

module.exports = {
  createFileSystemToRemoteDb,
  updateFileSystemToRemoteDb,
};