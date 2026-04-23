import { cn } from '@/lib/utils/cn'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900': variant === 'primary',
            'border border-gray-200 text-gray-900 hover:border-gray-400 bg-white': variant === 'outline',
            'text-gray-600 hover:text-gray-900 hover:bg-gray-50': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600': variant === 'danger',
          },
          {
            'text-xs px-3 py-1.5': size === 'sm',
            'text-sm px-4 py-2.5': size === 'md',
            'text-base px-6 py-3': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Chargement...
          </span>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
