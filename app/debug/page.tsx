'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'

/**
 * Debug Page
 * 
 * This page helps diagnose authentication and database issues.
 * Visit /debug to see detailed information about your auth state.
 */
export default function DebugPage() {
    const [authUser, setAuthUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient()

            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError) {
                setError(`Auth error: ${userError.message}`)
                setLoading(false)
                return
            }

            setAuthUser(user)

            if (user) {
                // Try to fetch profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profileError) {
                    setError(`Profile error: ${profileError.message}`)
                } else {
                    setProfile(profileData)
                }
            }

            setLoading(false)
        }

        checkAuth()
    }, [])

    if (loading) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Debug Information</h1>

                {/* Auth User */}
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Authentication User</h2>
                    {authUser ? (
                        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                            {JSON.stringify(authUser, null, 2)}
                        </pre>
                    ) : (
                        <p className="text-red-600">No authenticated user found</p>
                    )}
                </Card>

                {/* Profile */}
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Profile Data</h2>
                    {profile ? (
                        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                            {JSON.stringify(profile, null, 2)}
                        </pre>
                    ) : (
                        <div>
                            <p className="text-red-600 mb-2">No profile found in database</p>
                            <p className="text-sm text-gray-600">
                                This means the database trigger didn't create your profile automatically.
                                You may need to create it manually.
                            </p>
                        </div>
                    )}
                </Card>

                {/* Errors */}
                {error && (
                    <Card>
                        <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
                        <p className="text-red-600">{error}</p>
                    </Card>
                )}

                {/* Instructions */}
                <Card>
                    <h2 className="text-xl font-semibold mb-4">What to check:</h2>
                    <ul className="space-y-2 text-sm">
                        <li>✅ If you see auth user data above, authentication is working</li>
                        <li>✅ If you see profile data, the database trigger worked correctly</li>
                        <li>❌ If profile is missing, check Supabase Table Editor → profiles table</li>
                        <li>❌ If profile is missing, the database trigger may not have run</li>
                    </ul>
                </Card>
            </div>
        </div>
    )
}
