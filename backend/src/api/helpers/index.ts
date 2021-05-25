export default {
  notFound(message) {
    const error = new Error(message);
    error["status"] = 404;
    throw error;
  },
};
