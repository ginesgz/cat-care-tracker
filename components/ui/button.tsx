import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
}

/**
 * Reusable Button Component
 * 
 * This is a customizable button that maintains consistent styling across the app.
 * 
 * Props:
 * - variant: Changes the button's appearance (primary = blue, secondary = gray, outline = border only)
 * - size: Controls button size (sm, md, lg)
 * - All standard HTML button props (onClick, disabled, type, etc.)
 * 
 * Example usage:
 * <Button variant="primary" onClick={handleClick}>Click Me</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    // Base styles - applied to all buttons
                    'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',

                    // Variant styles - different colors for different button types
                    {
                        'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
                        'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500': variant === 'secondary',
                        'border-2 border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500': variant === 'outline',
                    },

                    // Size styles - different padding for different sizes
                    {
                        'px-3 py-1.5 text-sm': size === 'sm',
                        'px-4 py-2 text-base': size === 'md',
                        'px-6 py-3 text-lg': size === 'lg',
                    },

                    // Allow custom classes to be passed in
                    className
                )}
                {...props}
            />
        )
    }
)

Button.displayName = 'Button'
