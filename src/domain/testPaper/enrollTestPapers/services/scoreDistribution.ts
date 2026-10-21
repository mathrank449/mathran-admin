/** 총점을 문항 수로 나눠 배분한다. 나머지는 앞 문항부터 1점씩 더한다. */
export const distributeScores = <T extends { score: number }>(
  items: T[],
  total = 100
): T[] => {
  if (items.length === 0) return items;
  const quotient = Math.floor(total / items.length);
  return items.map((item, index) => ({
    ...item,
    score: quotient + (index < total % items.length ? 1 : 0),
  }));
};
