  import inquiryModel from "../../models/inquiry.model.js";

  const getUserQuery = async (id) => {
    try{
        const query = await inquiryModel.findById(id).select(["response","query"])
        console.log(query);

        return query;
    }
    catch(error){
        throw new Error(error.message);
    }
  }

  export default getUserQuery;