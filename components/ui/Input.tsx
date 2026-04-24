import { cn } from '@/lib/utils/cn'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-semibold text-gray-900">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2.5 text-sm bg-gray-50 border rounded-lg transition-colors outline-none',
            'focus:bg-white focus:border-gray-900',
            error ? 'border-red-400 bg-red-50' : 'border-gray-200',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input
