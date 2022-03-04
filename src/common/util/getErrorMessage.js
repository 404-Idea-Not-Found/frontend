function getErrorMessage(error) {
  let errorMessage = error.message;

  if (error.response) {
    errorMessage = error.response.data.errorMessage;
  }

  if (error.data) {
    errorMessage = error.data;
  }

  return errorMessage;
}

export default getErrorMessage;
