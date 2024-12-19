import { useState, useCallback } from 'react'

export const useForm = (initialState = {}, validations = {}) => {
  const [values, setValues] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setValues(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setValues(prev => ({ ...prev, [name]: value }))
    }
  }, [])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    if (validations[name]) {
      const validation = validations[name](values[name])
      setErrors(prev => ({
        ...prev,
        [name]: validation.message
      }))
    }
  }, [values, validations])

  const reset = useCallback(() => {
    setValues(initialState)
    setErrors({})
    setTouched({})
  }, [initialState])

  const isValid = useCallback(() => {
    const validationResults = Object.keys(validations).map(key => {
      const validation = validations[key](values[key])
      return validation.isValid
    })
    return validationResults.every(Boolean)
  }, [values, validations])

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset,
    isValid,
    setValues
  }
} 