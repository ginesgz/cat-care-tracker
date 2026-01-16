export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            households: {
                Row: {
                    id: string
                    name: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    role: 'admin' | 'user' | 'pending'
                    household_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    role?: 'admin' | 'user' | 'pending'
                    household_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    role?: 'admin' | 'user' | 'pending'
                    household_id?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            feeding_events: {
                Row: {
                    id: string
                    household_id: string
                    user_id: string
                    food_type: string
                    fed_by: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    household_id: string
                    user_id: string
                    food_type: string
                    fed_by: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    household_id?: string
                    user_id?: string
                    food_type?: string
                    fed_by?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            custom_events: {
                Row: {
                    id: string
                    household_id: string
                    user_id: string
                    event_type: string
                    performed_by: string
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    household_id: string
                    user_id: string
                    event_type: string
                    performed_by: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    household_id?: string
                    user_id?: string
                    event_type?: string
                    performed_by?: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            event_types: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    is_system_defined: boolean
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    is_system_defined?: boolean
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    is_system_defined?: boolean
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
