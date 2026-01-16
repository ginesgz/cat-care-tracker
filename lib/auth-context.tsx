'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types'

/**
 * Authentication Context
 * 
 * This context manages the authentication state for the entire application.
 * It provides:
 * - Current user information
 * - User profile data (from our profiles table)
 * - Loading state
 * - Sign in, sign up, and sign out functions
 * 
 * How it works:
 * 1. When the app loads, it checks if there's a logged-in user
 * 2. If yes, it fetches their profile from the database
 * 3. It listens for auth changes (login, logout) and updates accordingly
 * 4. All components can access this data via useAuth() hook
 */

interface AuthContextType {
    user: User | null              // Supabase auth user
    profile: Profile | null        // Our custom profile data
    loading: boolean               // True while checking auth status
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, fullName: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    /**
     * Fetch user profile from database
     * Called after successful authentication
     */
    const fetchProfile = async (userId: string) => {
        try {
            console.log('Fetching profile for user:', userId)
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Supabase error fetching profile:', error)
                throw error
            }

            if (!data) {
                console.error('No profile data returned for user:', userId)
                setProfile(null)
                return
            }

            console.log('Profile fetched successfully:', data)
            setProfile(data)
        } catch (error: any) {
            console.error('Error fetching profile:', error)
            console.error('Error details:', error.message, error.code)
            setProfile(null)
        }
    }

    /**
     * Check authentication status on mount
     * This runs once when the app first loads
     */
    useEffect(() => {
        // Get current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            }
            setLoading(false)
        })

        // Listen for auth changes (login, logout, token refresh)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user.id)
            } else {
                setProfile(null)
            }
            setLoading(false)
        })

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe()
    }, [])

    /**
     * Sign in with email and password
     */
    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
    }

    /**
     * Sign up new user
     * The database trigger will automatically create their profile and household
     */
    const signUp = async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        })
        if (error) throw error
    }

    /**
     * Sign out current user
     */
    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }

    const value = {
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to use auth context
 * 
 * Usage in any component:
 * const { user, profile, signIn, signOut } = useAuth()
 */
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
