const Admin = require("../Models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

export const addAdmin = async (req, res, next) => {
  const { emial, passworld } = req.body;

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email });
  } catch (e) {
    return console.log(e);
  }
  if (existingAdmin) {
    return res.status(400).json({ Message: "Admin Already Existing" });
  }
  let admin;
  const hashedPassword = bcrypt.hashSync(passworld);
  try {
    admin = new Admin({ email, password: hashedPassword });
    admin = await admin.save();
  } catch (e) {
    return console.log(e);
  }
  if (!admin) {
    return res.status(400).json({ Message: "Unable to create admin" });
  }
  return res.status(201).json({ Message: "Admin created", admin: admin });
};

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(400).json({ message: "Invalid Inputs" });
  }
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ emial });
  } catch (e) {
    return console.log(e);
  }
  if (!existingAdmin) {
    return res.status(401).json({ message: "Admin not found" });
  }
  const isPasswordCorrect = bcrypt.compareSync(
    password,
    existingAdmin.password
  );
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }
  const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  return res.status(200).json({
    message: "Authentication Successful",
    token,
    id: existingAdmin._id,
  });
};
export const getAdmins = async (req, res) => {
  let admins;
  try {
    admins = await Admin.find();
  } catch (e) {
    return res.send(e.message);
  }
  if (!admins) {
    return res.status(400).json({ message: "cannot get admin" });
  }
  return res.status(200).json({ admins });
};

export const getAdminByID = async (req, res, next) => {
  const id = req.params.id;
  let admin;
  try {
    admin = await Admin.findById(id).populate("addedMovies");
  } catch (err) {
    return console.log(err);
  }
  if (!admin) {
    return console.log("Cannot find Admin");
  }
  return res.status(200).json({ admin });
};
