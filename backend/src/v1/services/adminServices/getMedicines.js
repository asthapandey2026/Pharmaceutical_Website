import medicineModel from "../../models/medicines.model.js";

const getMedicines = async () => {
    try {
        const medicines = await medicineModel.find({isActive: true}).populate("category", "name").populate("manufacturer", "name").sort({createdAt: -1});
        return medicines;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

const getMedicineByID = async (id) => {
    try {
        const medicine = await medicineModel.findById(id);
        return medicine;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

const isActive = async () => {
    try{
        const inActive =  await medicineModel.find({isActive:false});
        return inActive;
    }
    catch(error){
        console.log(error);
        throw new Error(error);
    }

}

export {getMedicines , getMedicineByID ,  isActive};