import medicineModel from "../../models/medicines.model.js";
import mongoose from "mongoose";
import cloudinaryUrl from "../../utils/cloudinary.config.js";
const updateMedicines = async (id, update) => {
  try {

    if(update.images) {
       let cloudinary_url = await cloudinaryUrl(update.images);
        update.images = cloudinary_url;
    }

    console.log(update);
    

     if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid medicine ID format");
    }

    const updatedMedicine = await medicineModel.findOneAndUpdate(
      { _id: id },
      update,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMedicine) {
      throw new Error("Medicine not found");
    }

    return updatedMedicine;
  } catch (error) {
    throw new Error(`Error updating medicine: ${error}`);
  }
};

export default updateMedicines;
