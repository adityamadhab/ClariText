import { useState, useEffect } from 'react'

const FormTextarea = ({
  label,
  id,
  name,
  value,
  onChange,
  validate,
  required = false,
  placeholder = '',
  rows = 4,
  className = '',
  ...props
}) => {
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (touched && validate) {
      const validation = validate(value)
      setError(validation.message)
    }
  }, [value, touched, validate])

  const handleBlur = () => {
    setTouched(true)
    if (validate) {
      const validation = validate(value)
      setError(validation.message)
    }
  }

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        rows={rows}
        placeholder={placeholder}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && touched && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}

export default FormTextarea 