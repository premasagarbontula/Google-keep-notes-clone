import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  let saltRounds = 10;
  let hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
