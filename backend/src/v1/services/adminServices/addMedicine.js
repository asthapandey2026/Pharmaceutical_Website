import medicineModel from "../../models/medicines.model.js";
import cloudinaryUrl from "../../utils/cloudinary.config.js";
import fs from 'fs';


const addMedicine = async ({name , description,price , stock , category , manufacturer,expiryDate , images ,caption , ingredients ,howToUse,discount}) => {
    // console.log({name , description,price , stock , category , manufacturer,expiryDate , images});
  try {
    if([name, description, price, stock, category, manufacturer, expiryDate, images].some((arg) => arg === undefined || arg === null || arg === "")) {
      throw new error.json({ message: "Please provide all details" });
    }

    const medicineExists = await medicineModel.findOne({ name, manufacturer });
    if (medicineExists) {
      fs.unlinkSync(images);
      throw new Error("Medicine already exists");
    }

    let cloudinary_url = await cloudinaryUrl(images);
    
    const medicine = await medicineModel.create({
      name,
      description,
      price,
      stock,
      category,
      manufacturer,
      expiryDate,
      images : cloudinary_url,
      caption,
      discount,
      ingredients,
      howToUse,
    });
    
    return medicine;
  } catch (error) {
    throw new Error(error);
  }
};

export default addMedicine;
