// LocalStorage-based authentication system

export interface User {
    id: string
    email: string
    password: string // In production, this would be hashed
    name: string
    createdAt: string
}

export interface Session {
    userId: string
    email: string
    name: string
    createdAt: string
}

const USERS_KEY = 'antigravity_users'
const SESSION_KEY = 'antigravity_session'

// Get all users
export function getUsers(): User[] {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
}

// Save users
function saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Sign up a new user
export function signUp(email: string, password: string, name: string): { success: boolean; error?: string; user?: User } {
    const users = getUsers()

    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'This email is already registered' }
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, error: 'Please enter a valid email address' }
    }

    // Validate password
    if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' }
    }

    // Validate name
    if (!name || name.trim().length < 2) {
        return { success: false, error: 'Name must be at least 2 characters' }
    }

    const newUser: User = {
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        password, // In production, hash this!
        name: name.trim(),
        createdAt: new Date().toISOString()
    }

    users.push(newUser)
    saveUsers(users)

    // Auto-login after signup
    createSession(newUser)

    return { success: true, user: newUser }
}

// Login
export function login(email: string, password: string): { success: boolean; error?: string; user?: User } {
    const users = getUsers()

    const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!user) {
        return { success: false, error: 'Invalid email or password' }
    }

    createSession(user)
    return { success: true, user }
}

// Create session
function createSession(user: User): void {
    const session: Session = {
        userId: user.id,
        email: user.email,
        name: user.name,
        createdAt: new Date().toISOString()
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

// Get current session
export function getSession(): Session | null {
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (!sessionData) return null

    try {
        return JSON.parse(sessionData)
    } catch {
        return null
    }
}

// Get current user
export function getCurrentUser(): User | null {
    const session = getSession()
    if (!session) return null

    const users = getUsers()
    return users.find(u => u.id === session.userId) || null
}

// Logout
export function logout(): void {
    localStorage.removeItem(SESSION_KEY)
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
    return getSession() !== null
}

// Update user profile
export function updateUser(userId: string, updates: Partial<Pick<User, 'name' | 'email'>>): { success: boolean; error?: string } {
    const users = getUsers()
    const index = users.findIndex(u => u.id === userId)

    if (index === -1) {
        return { success: false, error: 'User not found' }
    }

    // Check email uniqueness if changing
    if (updates.email && updates.email !== users[index].email) {
        if (users.find(u => u.email.toLowerCase() === updates.email!.toLowerCase())) {
            return { success: false, error: 'This email is already registered' }
        }
    }

    users[index] = { ...users[index], ...updates }
    saveUsers(users)

    // Update session if current user
    const session = getSession()
    if (session && session.userId === userId) {
        createSession(users[index])
    }

    return { success: true }
}

// Change password
export function changePassword(userId: string, currentPassword: string, newPassword: string): { success: boolean; error?: string } {
    const users = getUsers()
    const user = users.find(u => u.id === userId)

    if (!user) {
        return { success: false, error: 'User not found' }
    }

    if (user.password !== currentPassword) {
        return { success: false, error: 'Current password is incorrect' }
    }

    if (newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters' }
    }

    user.password = newPassword
    saveUsers(users)

    return { success: true }
}
