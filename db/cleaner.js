const cleaner = (data) => {
  if (isNaN(data[0]) || !data[0] || isNaN(data[1]) || !data[1]) {
    return;
  }
  data[0] = Number(data[0]);
  data[1] = Number(data[1]);
  data[2] = !!data[2] && !isNaN(data[2]) ? Number(data[2]) : null;
  data[3] =
    !!data[3] && new Date(data[3]) != "Invalid Date" ? new Date(data[3]) : null;
  data[4] = !!data[4] ? String(data[4]) : "";
  data[5] = !!data[5] ? String(data[5]) : "";
  data[6] = !isNaN(data[6]) ? Number(data[6]) : 0;
  data[7] = !isNaN(data[7]) ? Number(data[7]) : 0;
  data[8] = !!data[8] ? String(data[8]) : "";
  data[9] = !!data[9] ? String(data[9]) : "";
  data[10] = !!data[10] && data[10] !== "null" ? String(data[10]) : null;
  data[11] = !!data[11] && !isNaN(data[11]) ? Number(data[11]) : 0;
  return data;
};
