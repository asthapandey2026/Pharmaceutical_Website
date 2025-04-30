import medicineModel from "../../models/medicines.model.js"

const deleteMedicine = async (id) => {
    try {
        if (!id) {
            throw new Error("Please provide all details");
        }
        const medicine = await medicineModel.findByIdAndDelete(id);
        return medicine;
    } catch (error) {
        throw new Error(error);
    }
}


export default deleteMedicine;
