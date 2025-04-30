import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  offerBanners: [
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
  ],
  userRole: "guest", // 'guest', 'user', 'admin'
};

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {

    updateAdminBanner: (state, action) => {
      state.banner.adminBanner = action.payload;
    },
  },
});

export const { setUserRole, updateAdminBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
