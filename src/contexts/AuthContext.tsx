import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type Session, type User, getSession, logout as authLogout, login as authLogin, signUp as authSignUp, getCurrentUser } from '../lib/auth'

interface AuthContextType {
    session: Session | null
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
    logout: () => void
    refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load session on mount
    useEffect(() => {
        const currentSession = getSession()
        const currentUser = getCurrentUser()
        setSession(currentSession)
        setUser(currentUser)
        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        const result = authLogin(email, password)
        if (result.success) {
            setSession(getSession())
            setUser(getCurrentUser())
        }
        return result
    }

    const signUp = async (email: string, password: string, name: string) => {
        const result = authSignUp(email, password, name)
        if (result.success) {
            setSession(getSession())
            setUser(getCurrentUser())
        }
        return result
    }

    const logout = () => {
        authLogout()
        setSession(null)
        setUser(null)
    }

    const refreshUser = () => {
        setUser(getCurrentUser())
    }

    return (
        <AuthContext.Provider
            value={{
                session,
                user,
                isLoading,
                isAuthenticated: !!session,
                login,
                signUp,
                logout,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
