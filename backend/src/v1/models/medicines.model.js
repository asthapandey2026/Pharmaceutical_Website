import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true,
    min: 0
  },
  stock: {
    type: String,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    // enum: ['tablets', 'capsules', 'syrups', 'spraies', 'ointments', 'hair-and-skinCare' ,'others']
  },
  manufacturer: {
    type: String,
    required: true,
    unique : true,
  },
  expiryDate: {
    type: Date,
    required: true
  },
  images:{
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  ingredients: {
    type: String,
    required: true
  },
  howToUse: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

medicineSchema.index({name : 1, manufacturer : 1}, {unique : true});

const medicineModel = mongoose.model('Medicines', medicineSchema);

export default medicineModel;

