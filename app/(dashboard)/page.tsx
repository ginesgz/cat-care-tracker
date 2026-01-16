'use client'

import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'

/**
 * Home Page (Dashboard)
 * 
 * This is the main page users see after logging in.
 * For now, it's a simple welcome page that confirms authentication is working.
 * 
 * Next steps will add:
 * - Feeding status (time since last feeding, daily count)
 * - Quick feeding log button
 * - Recent events list
 */
export default function HomePage() {
    const { user, profile } = useAuth()

    return (
        <div className="space-y-6">
            {/* Welcome Card */}
            <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome to Cat Care Tracker! 🐱
                </h2>
                <p className="text-gray-600">
                    Your authentication is working correctly. You're logged in as{' '}
                    <span className="font-medium">{profile?.email}</span>
                </p>

                {/* Display user info for debugging */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Your Profile:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>Name: {profile?.full_name || 'Not set'}</li>
                        <li>Email: {profile?.email}</li>
                        <li>Role: {profile?.role}</li>
                        <li>Household ID: {profile?.household_id}</li>
                    </ul>
                </div>
            </Card>

            {/* Placeholder for future features */}
            <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Coming Soon
                </h3>
                <ul className="text-gray-600 space-y-2">
                    <li>✅ Authentication system (complete!)</li>
                    <li>⏳ Feeding event tracking</li>
                    <li>⏳ Time since last feeding</li>
                    <li>⏳ Daily feeding count</li>
                    <li>⏳ Custom event logging</li>
                    <li>⏳ Event history</li>
                </ul>
            </Card>
        </div>
    )
}
