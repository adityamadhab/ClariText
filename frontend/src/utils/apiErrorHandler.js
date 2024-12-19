export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data.message || 'An error occurred with the server'
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response received from server. Please check your internet connection'
  } else {
    // Something happened in setting up the request that triggered an Error
    return 'An error occurred while processing your request'
  }
}

export const isAuthError = (error) => {
  return error.response && error.response.status === 401
} 