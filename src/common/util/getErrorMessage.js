function getErrorMessage(error) {
  let errorMessage = error.message;

  if (error.response) {
    errorMessage = error.response.data.errorMessage;
  }

  return errorMessage;
}

export default getErrorMessage;
