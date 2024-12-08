const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, unique: true },
    user_role: { type: String, enum: ["user", "admin"], default: "user" },
    profile_picture: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual('bills', {
  ref: 'Bill',
  localField: '_id',
  foreignField: 'user_id'
});

module.exports = mongoose.model("User", UserSchema);
