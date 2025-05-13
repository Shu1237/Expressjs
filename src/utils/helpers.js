import bcrypt from 'bcrypt';

const saltRounds = 10; // Độ mạnh của hash

export const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  // console.log(salt); 
  return bcrypt.hashSync(password, salt);
};

export const comparedPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};