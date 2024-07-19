import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#e66465", // Default color if not specified
  },
  tags: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 9; // Maximum of 9 tags
      },
      message: (props) => `${props.value} exceeds the limit of 9 tags!`,
    },
  },
  archived: {
    type: Boolean,
    default: false,
  },
  trashed: {
    type: Boolean,
    default: false,
  },
  trashedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("notes", noteSchema);
