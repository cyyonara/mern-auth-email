const generateOTP = (): string => {
  let randomNumbers = '';

  for (let i = 1; i <= 6; i++) {
    randomNumbers += Math.floor(Math.random() * 9 + 1).toString();
  }
  return randomNumbers;
};

export default generateOTP;
