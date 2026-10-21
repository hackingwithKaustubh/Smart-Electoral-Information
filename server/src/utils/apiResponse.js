function success(res, data = {}, message = 'Operation successful', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
}

function fail(res, message, statusCode = 400, errorCode = 'BAD_REQUEST') {
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
  });
}

module.exports = { success, fail };
