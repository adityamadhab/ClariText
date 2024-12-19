export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    message: password.length < 6 ? 'Password must be at least 6 characters' : ''
  }
}

export const validateUsername = (username) => {
  const re = /^[a-zA-Z0-9_]{3,20}$/
  return {
    isValid: re.test(username),
    message: !re.test(username) 
      ? 'Username must be 3-20 characters and can only contain letters, numbers, and underscores'
      : ''
  }
}

export const validatePostTitle = (title) => {
  return {
    isValid: title.length >= 3 && title.length <= 100,
    message: title.length < 3 
      ? 'Title must be at least 3 characters'
      : title.length > 100 
      ? 'Title must be less than 100 characters'
      : ''
  }
}

export const validatePostContent = (content) => {
  return {
    isValid: content.length >= 10,
    message: content.length < 10 ? 'Content must be at least 10 characters' : ''
  }
} 