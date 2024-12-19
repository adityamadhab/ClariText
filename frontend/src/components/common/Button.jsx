const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = 'rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const classes = [
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    props.className
  ].join(' ')

  return (
    <button
      {...props}
      className={classes}
    >
      {children}
    </button>
  )
}

export default Button 