const responseValidator = (req, res, next, error, value) => {
  if (error != null) {
    const ob = {
      message: "",
      data: {},
    };
    ob.message = "Something wrong with yout request";
    ob.data = error?.details[0]?.message;
    res.status(400).json(ob);
    return;
  } else {
    req.validated = value;
    next();
  }
};

const response = (res, { code, message, data }) => {
  code = code || 200;
  message = message || "";
  data = data || null;

  const ob = {
    code,
    message,
    data,
  };

  res.status(code).json(ob);
};
module.exports = {
  responseValidator,
  response,
};
