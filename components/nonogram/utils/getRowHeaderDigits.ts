const getRowHeaderDigits = (row: boolean[]) => {
  const allDigits = row.reduce(
    (digits, value) => {
      if (value) {
        digits[digits.length - 1] += 1;
      } else {
        digits.push(0);
      }

      return digits;
    },
    [0],
  );

  return allDigits.filter((digit) => digit !== 0);
};

export default getRowHeaderDigits;
