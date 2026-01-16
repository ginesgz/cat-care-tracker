import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

/**
 * Reusable Input Component
 * 
 * A text input field with optional label and error message display.
 * 
 * Props:
 * - label: Optional label text displayed above the input
 * - error: Optional error message displayed below the input in red
 * - All standard HTML input props (type, placeholder, value, onChange, etc.)
 * 
 * Example usage:
 * <Input 
 *   label="Email" 
 *   type="email" 
 *   value={email} 
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={emailError}
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {/* Label - only shown if label prop is provided */}
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}

                {/* Input field */}
                <input
                    ref={ref}
                    className={clsx(
                        // Base styles
                        'w-full px-3 py-2 border rounded-lg',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        'disabled:bg-gray-100 disabled:cursor-not-allowed',

                        // Error state - red border if there's an error
                        {
                            'border-red-500 focus:ring-red-500': error,
                            'border-gray-300': !error,
                        },

                        className
                    )}
                    {...props}
                />

                {/* Error message - only shown if error prop is provided */}
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
