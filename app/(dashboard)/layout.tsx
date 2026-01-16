'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'

/**
 * Protected Layout
 * 
 * This layout wraps all protected pages (the main app).
 * It ensures only authenticated users can access these pages.
 * 
 * Features:
 * - Checks if user is logged in
 * - Shows loading state while checking
 * - Redirects to login if not authenticated
 * - Provides a logout button in the header
 */
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { user, profile, loading, signOut } = useAuth()

    /**
     * Redirect to login if not authenticated
     */
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    /**
     * Handle logout
     */
    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
    }

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // Don't render anything if not authenticated (will redirect)
    if (!user) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with logout button */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Cat Care Tracker
                            </h1>
                            {profile && (
                                <p className="text-sm text-gray-600">
                                    Welcome, {profile.full_name || profile.email}
                                </p>
                            )}
                        </div>
                        <Button variant="outline" onClick={handleSignOut}>
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    )
}
