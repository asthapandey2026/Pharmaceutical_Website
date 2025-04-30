import { userModel } from "../../models/user.model.js";

const updateUser = async (userId, update) => {
  try {
    const sanitizedUpdate = { ...update };
    // console.log(sanitizedUpdate);
    // console.log(update.role);

    const restrictedFields = ["password", "refreshToken"];
    restrictedFields.forEach((field) => delete sanitizedUpdate[field]);

    if (sanitizedUpdate.email) {
      const existingUser = await userModel.findOne({
        email: sanitizedUpdate.email,
        _id: { $ne: userId }, // Exclude current user from check
      });

      if (existingUser) {
        throw new Error("Email already in use");
      }
    }

    // Create update object based on what was provided
    const updateData = {};
    
    // Handle name if provided
    if (sanitizedUpdate.name) {
      if (sanitizedUpdate.name.firstName) {
        updateData['name.firstName'] = sanitizedUpdate.name.firstName;
      }
      if (sanitizedUpdate.name.lastName) {
        updateData['name.lastName'] = sanitizedUpdate.name.lastName;
      }
    }
    
    // Handle other fields
    if (sanitizedUpdate.email) updateData.email = sanitizedUpdate.email;
    if (sanitizedUpdate.phone) updateData.phone = sanitizedUpdate.phone;
    if (sanitizedUpdate.role) updateData.role = sanitizedUpdate.role;
    
    const updatedUser = await userModel
      .findOneAndUpdate(
        { _id: userId },
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      )
      .select("-password -refreshToken");
      
    if (!updatedUser) {
      throw new Error("User not found");
    }
    console.log(updatedUser);
    
    return updatedUser;
  } catch (err) {
    throw new Error(`Error updating user ` + err.message);
  }
};

const updateAddress = async (userId, address) => {
  try {
    // Create update object with proper MongoDB dot notation for nested fields
    const updateData = {};
    
    if (address.houseNo) updateData['address.houseNo'] = address.houseNo;
    if (address.street) updateData['address.street'] = address.street;
    if (address.state) updateData['address.state'] = address.state;
    if (address.pinCode) updateData['address.pinCode'] = address.pinCode;
    if (address.locality) updateData['address.locality'] = address.locality;
    if (address.city) updateData['address.city'] = address.city;
    
    const updatedUser = await userModel
      .findOneAndUpdate(
        { _id: userId },
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .select("-password -refreshToken");
      
    if (!updatedUser) {
      throw new Error("User not found");
    }
    console.log(updatedUser);
      
    return updatedUser;
  } catch (err) {
    throw new Error(`Error updating address: ${err.message}`);
  }
};

export { updateUser, updateAddress };
