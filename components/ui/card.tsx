import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

/**
 * Card Component
 * 
 * A simple container with a white background, shadow, and rounded corners.
 * Used to group related content together visually.
 * 
 * Example usage:
 * <Card>
 *   <h2>Title</h2>
 *   <p>Content goes here</p>
 * </Card>
 */
export function Card({ children, className, ...props }: CardProps) {
    return (
        <div
            className={clsx(
                'bg-white rounded-lg shadow-md p-6',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}
