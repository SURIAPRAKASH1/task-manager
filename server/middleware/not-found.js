const notFoundMiddleware = (err, req, res) => {
  req.status(404).send("Route does not exit");
};

export default notFoundMiddleware;
