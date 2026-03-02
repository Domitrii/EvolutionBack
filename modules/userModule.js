// Mongoose-like user schema (exported as userSchema)

const userSchema = {
  name: {
    type: String,
    default: "User",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  token: {
    type: String,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: null,
  },
};

// Additional schema options (like versionKey, timestamps)
const schemaOptions = {
  versionKey: false,
  timestamps: true,
};

export { userSchema, schemaOptions };


