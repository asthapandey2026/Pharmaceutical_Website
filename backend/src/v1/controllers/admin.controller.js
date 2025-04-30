import addMedicine from "../services/adminServices/addMedicine.js";
import deleteMedicine from "../services/adminServices/deleteMedicine.js";
import {
  getMedicines,
  getMedicineByID,
  isActive,
} from "../services/adminServices/getMedicines.js";
import updateMedicine from "../services/adminServices/updateMedicines.js";
import getAllQuries from "../services/adminServices/getAllQuries.js";
import answerQuery from "../services/adminServices/responseQuery.js";
import getUserQuery from "../services/adminServices/getUserQuery.js";
import {
  getAllOrders,
  getOrderById,
} from "../services/adminServices/orders.js";
const addMedicineController = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      manufacturer,
      expiryDate,
      caption,
      discount,
      ingredients,
      howToUse,
    } = req.body;
    const images = req.file?.path;
    const medicine = await addMedicine({
      name,
      description,
      price,
      stock,
      category,
      manufacturer,
      expiryDate,
      images,
      caption,
      discount,
      ingredients,
      howToUse,
    });
    res.status(201).json({ medicine, success: true });
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: `${error.message}` });
  }
};

const deleteMedicineController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const medicine = await deleteMedicine(id);
    res.status(200).json(medicine);
  } catch (error) {
    res.status(400).json({ message: `${error.message}` });
  }
};

const getMedicinesController = async (req, res) => {
  try {
    const medicines = await getMedicines();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(400).json({ message: `${error.message}` });
  }
};

const getMedicineByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await getMedicineByID(id);
    console.log(medicine);

    res.status(200).json(medicine);
  } catch (error) {
    res.status(400).json({ message: `${error.message}` });
  }
};

const updateMedicineController = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);

    const {
      name,
      description,
      price,
      stock,
      category,
      manufacturer,
      expiryDate,
      caption,
      discount,
      ingredients,
      howToUse,
      isActive,
    } = req.body;
    const images = req.file?.path;
    const medicine = await updateMedicine(id, {
      name,
      description,
      price,
      stock,
      category,
      manufacturer,
      expiryDate,
      images,
      caption,
      discount,
      ingredients,
      howToUse,
      isActive,
    });
    res.status(200).json(medicine);
  } catch (error) {
    res.status(400).json({ message: `${error.message}` });
  }
};

const getUserQueries = async (req, res) => {
  try {
    const queries = await getAllQuries();
    res.status(200).json(queries);
  } catch (error) {
    res.status(400).json({ message: `${error.message}` });
  }
};

const answerQueries = async (req, res) => {
  try {
    const { id } = req.params;
    const { response, responseIndex } = req.body;
    console.log(response, responseIndex);
    console.log(req.body);

    const adminId = req.user._id;

    const query = await answerQuery(id, response, responseIndex, adminId);

    res.status(200).json({
      success: true,
      data: query,
      message: "Query answered successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserQueryById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = await getUserQuery(id);
    res.status(200).json(query);
  } catch (error) {
    res.status(400).json({ message: `${error.message}` });
  }
};

const getAllOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: `${error.message}` });
  }
};

const inActiveMeds = async (req, res) => {
  try {
    const inActiveMedicince = await isActive();
    res.status(200).json(inActiveMedicince);
  } catch (error) {
    res.status(400).json({
      message: `${error.message}`,
    });
  }
};

export {
  addMedicineController,
  deleteMedicineController,
  getMedicinesController,
  updateMedicineController,
  getMedicineByIdController,
  getUserQueries,
  answerQueries,
  getUserQueryById,
  getAllOrdersController,
  inActiveMeds
};
