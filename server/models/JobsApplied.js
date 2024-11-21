const mongoose = require("mongoose");
const { Schema } = mongoose;

const appliedCandidatesSchema = new Schema({
  userProfile: {
    type: Schema.Types.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  appliedDate: { type: Date },
  currentStage: {
    type: String,
    enum: [
      "Applied",
      "Profile Screening",
      "Shortlisted",
      "Interview 1",
      "Interview 2",
      "Final Interview",
    ],
    default: "Applied",
  },
  stage: {
    applied: { type: Boolean, default: true },
    profileScreening: { type: Boolean, default: false },
    shortlisted: { type: Boolean, default: false },
    interview1: { type: Boolean, default: false },
    interview2: { type: Boolean, default: false },
    finalInterview: { type: Boolean, default: false },
  },
  notes: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
      },
      note: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Application = mongoose.model("Application", appliedCandidatesSchema);
module.exports = Application;
