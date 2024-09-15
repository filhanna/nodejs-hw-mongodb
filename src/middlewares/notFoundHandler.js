const notFoundHeandler = (req, res) => {
  res.status(404).json({
    message: `${req.url} not found`,
  });
};

export default notFoundHeandler;
