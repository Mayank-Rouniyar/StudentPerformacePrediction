export const handleResponse = (res, status, message, success, data) => {
  return res.status(status).json({
    message,
    success,
    ...data
  });
};
