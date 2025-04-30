import { userModel } from "../../models/user.model.js";

const logoutUser = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(
        // console.log(req.user._id), 
      req.user._id,
      {
        $unset: {
          refreshToken: "",
        },
      },
        { new: true }
    );

  } catch (err) {
    res.status(500).send(`Internal server error: ${err.message}`);
  }
};

export default logoutUser;
