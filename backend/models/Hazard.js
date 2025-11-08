import mongoose from 'mongoose';

const hazardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    category: { type: String, enum: ['pothole', 'drain', 'streetlight', 'other'], required: true },
    imageUrl: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
    severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Hazard = mongoose.model('Hazard', hazardSchema);
export default Hazard;



