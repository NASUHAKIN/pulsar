import { awardBadge } from './gamification'
import { createNotification } from './notifications'

// Comprehensive demo data seed function
export function seedDemoData() {
    // Clear all existing data
    localStorage.clear()

    const now = new Date()
    const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString()

    // Create Teams
    const teams = [
        {
            id: 't1',
            name: 'Product Engineering',
            managerId: 'sarah',
            sector: 'engineering' as const,
            createdAt: daysAgo(90),
            description: 'Building the next generation of our product platform with cutting-edge technology',
            defaultTemplate: 'engineering' as const,
            checkInFrequency: 'weekly' as const,
            isPublic: true
        },
        {
            id: 't2',
            name: 'Growth Team',
            managerId: 'mike',
            sector: 'product' as const,
            createdAt: daysAgo(60),
            description: 'Driving user acquisition and engagement through data-driven product decisions',
            defaultTemplate: 'product' as const,
            checkInFrequency: 'weekly' as const,
            isPublic: true
        },
        {
            id: 't3',
            name: 'Enterprise Sales',
            managerId: 'jessica',
            sector: 'sales' as const,
            createdAt: daysAgo(45),
            description: 'Closing enterprise deals and building long-term customer relationships',
            defaultTemplate: 'sales' as const,
            checkInFrequency: 'weekly' as const,
            isPublic: false
        }
    ]

    // Create Members
    const members = [
        // Product Engineering Team
        { id: 'sarah', name: 'Sarah Chen', email: 'sarah@pulsar.app', teamId: 't1', role: 'leader' as const, createdAt: daysAgo(90), preferences: { theme: 'dark' as const, language: 'en' as const, emailNotifications: true, emailDigest: 'weekly' as const } },
        { id: 'alex', name: 'Alex Kumar', email: 'alex@pulsar.app', teamId: 't1', role: 'member' as const, createdAt: daysAgo(85), preferences: { theme: 'dark' as const, language: 'en' as const, emailNotifications: true, emailDigest: 'weekly' as const } },
        { id: 'emma', name: 'Emma Wilson', email: 'emma@pulsar.app', teamId: 't1', role: 'member' as const, createdAt: daysAgo(80), preferences: { theme: 'light' as const, language: 'en' as const, emailNotifications: false, emailDigest: 'none' as const } },
        { id: 'david', name: 'David Park', email: 'david@pulsar.app', teamId: 't1', role: 'member' as const, createdAt: daysAgo(75), preferences: { theme: 'dark' as const, language: 'en' as const, emailNotifications: true, emailDigest: 'daily' as const } },

        // Growth Team
        { id: 'mike', name: 'Mike Rodriguez', email: 'mike@pulsar.app', teamId: 't2', role: 'leader' as const, createdAt: daysAgo(60), preferences: { theme: 'dark' as const, language: 'en' as const, emailNotifications: true, emailDigest: 'weekly' as const } },
        { id: 'sophia', name: 'Sophia Martinez', email: 'sophia@pulsar.app', teamId: 't2', role: 'member' as const, createdAt: daysAgo(55), preferences: { theme: 'dark' as const, language: 'tr' as const, emailNotifications: true, emailDigest: 'weekly' as const } },
        { id: 'james', name: 'James Taylor', email: 'james@pulsar.app', teamId: 't2', role: 'member' as const, createdAt: daysAgo(50), preferences: { theme: 'light' as const, language: 'en' as const, emailNotifications: false, emailDigest: 'none' as const } },

        // Enterprise Sales Team
        { id: 'jessica', name: 'Jessica Anderson', email: 'jessica@pulsar.app', teamId: 't3', role: 'leader' as const, createdAt: daysAgo(45), preferences: { theme: 'dark' as const, language: 'en' as const, emailNotifications: true, emailDigest: 'weekly' as const } },
        { id: 'ryan', name: 'Ryan Thompson', email: 'ryan@pulsar.app', teamId: 't3', role: 'member' as const, createdAt: daysAgo(40), preferences: { theme: 'dark' as const, language: 'en' as const, emailNotifications: true, emailDigest: 'weekly' as const } },
        { id: 'rachel', name: 'Rachel Kim', email: 'rachel@pulsar.app', teamId: 't3', role: 'member' as const, createdAt: daysAgo(35), preferences: { theme: 'light' as const, language: 'tr' as const, emailNotifications: true, emailDigest: 'daily' as const } }
    ]

    // Create Check-ins (last 4 weeks)
    const checkIns = [
        // Sarah's engineering check-ins
        { id: 'ci1', memberId: 'sarah', teamId: 't1', date: daysAgo(7), templateType: 'engineering' as const, accomplishments: 'Shipped new API authentication system with OAuth2 support', codeChanges: 'Refactored auth middleware, added JWT validation', prs: '3 PRs merged: #234, #235, #236', technicalDebt: 'Need to update deprecated dependencies', deploymentStatus: 'Production deployment successful', blockers: '' },
        { id: 'ci2', memberId: 'sarah', teamId: 't1', date: daysAgo(14), templateType: 'engineering' as const, accomplishments: 'Completed database migration to PostgreSQL 15', codeChanges: 'Updated all ORM models and queries', prs: '2 PRs merged: #230, #231', technicalDebt: 'Legacy SQL queries need optimization', deploymentStatus: 'Staged for production', blockers: 'Waiting for DBA approval' },

        // Alex's engineering check-ins
        { id: 'ci3', memberId: 'alex', teamId: 't1', date: daysAgo(7), templateType: 'engineering' as const, accomplishments: 'Implemented real-time websocket notifications', codeChanges: 'Added Socket.io integration, built notification service', prs: '4 PRs merged this week', technicalDebt: 'Need better error handling', deploymentStatus: 'Deployed to staging', blockers: 'Redis connection issues on staging' },
        { id: 'ci4', memberId: 'alex', teamId: 't1', date: daysAgo(14), templateType: 'engineering' as const, accomplishments: 'Code review and performance optimization', codeChanges: 'Reduced API response time by 40%', prs: '3 PRs reviewed', technicalDebt: '', deploymentStatus: 'Production ready', blockers: '' },

        // Emma's engineering check-ins
        { id: 'ci5', memberId: 'emma', teamId: 't1', date: daysAgo(7), templateType: 'engineering' as const, accomplishments: 'Built new dashboard analytics widgets', codeChanges: 'React components with D3.js visualizations', prs: '2 PRs merged', technicalDebt: 'Component testing coverage at 60%', deploymentStatus: 'In code review', blockers: '' },
        { id: 'ci6', memberId: 'emma', teamId: 't1', date: daysAgo(14), templateType: 'engineering' as const, accomplishments: 'Fixed critical UI rendering bug', codeChanges: 'Optimized React rendering with useMemo', prs: '5 PRs merged', technicalDebt: '', deploymentStatus: 'Deployed hotfix to production', blockers: '' },

        // Mike's product check-ins
        { id: 'ci7', memberId: 'mike', teamId: 't2', date: daysAgo(7), templateType: 'product' as const, accomplishments: 'Launched A/B test for new onboarding flow', featureUpdates: 'Simplified signup from 5 steps to 3', userFeedback: 'Early data shows 25% improvement in completion rate', productMetrics: 'DAU up 12%, conversion up 18%', roadmap: 'Planning mobile app beta for Q1' },
        { id: 'ci8', memberId: 'mike', teamId: 't2', date: daysAgo(14), templateType: 'product' as const, accomplishments: 'Completed user research interviews with 15 customers', featureUpdates: 'Prioritized top 3 feature requests', userFeedback: 'Users want better collaboration tools', productMetrics: 'NPS score: 42', roadmap: 'Starting design sprint next week' },

        // Sophia's product check-ins
        { id: 'ci9', memberId: 'sophia', teamId: 't2', date: daysAgo(7), templateType: 'product' as const, accomplishments: 'Released new dashboard customization feature', featureUpdates: 'Users can now drag  drop widgets', userFeedback: '89% positive feedback on feature', productMetrics: 'Feature adoption: 45% in first week', roadmap: 'Planning advanced filters next' },
        { id: 'ci10', memberId: 'sophia', teamId: 't2', date: daysAgo(14), templateType: 'product' as const, accomplishments: 'Analyzed competitor features and market trends', featureUpdates: 'Built product roadmap for Q1', userFeedback: 'Customers want better mobile experience', productMetrics: 'Retention improved to 82%', roadmap: 'Mobile-first redesign planned' },

        // Jessica's sales check-ins
        { id: 'ci11', memberId: 'jessica', teamId: 't3', date: daysAgo(7), templateType: 'sales' as const, accomplishments: 'Closed $500K enterprise deal with TechCorp', dealsClosed: '3 deals: $500K, $150K, $80K', pipeline: '$2.3M in active pipeline, 12 opportunities', customerFeedback: 'TechCorp loves the security features', targets: 'Q4 target: $3M (currently at $2.1M)', blockers: 'Need legal approval for custom contract' },
        { id: 'ci12', memberId: 'jessica', teamId: 't3', date: daysAgo(14), templateType: 'sales' as const, accomplishments: 'Secured 5 new enterprise demos', dealsClosed: '2 deals: $200K, $95K', pipeline: '$2.8M in pipeline', customerFeedback: 'Pricing is competitive', targets: 'On track for Q4 goals', blockers: '' },

        // Ryan's sales check-ins
        { id: 'ci13', memberId: 'ryan', teamId: 't3', date: daysAgo(7), templateType: 'sales' as const, accomplishments: 'Expanded relationship with existing client, upsold premium tier', dealsClosed: '1 upsell: $120K ARR increase', pipeline: '$1.2M in opportunities', customerFeedback: 'Client wants better reporting', targets: 'Monthly quota: $400K (at $380K)', blockers: 'Competitor offering lower price' },
        { id: 'ci14', memberId: 'ryan', teamId: 't3', date: daysAgo(14), templateType: 'sales' as const, accomplishments: 'Closed 2 mid-market deals', dealsClosed: '$180K total revenue', pipeline: '$950K in active deals', customerFeedback: 'Positive reviews on G2', targets: 'Exceeded monthly target', blockers: '' }
    ]

    // Create Kudos
    const kudos = [
        { id: 'k1', fromMemberId: 'alex', toMemberId: 'sarah', teamId: 't1', message: 'Thanks for the quick code review! Your feedback really improved the architecture.', date: daysAgo(5) },
        { id: 'k2', fromMemberId: 'emma', toMemberId: 'alex', teamId: 't1', message: 'Amazing work on the websocket implementation! Super clean code.', date: daysAgo(6) },
        { id: 'k3', fromMemberId: 'sarah', toMemberId: 'emma', teamId: 't1', message: 'The new dashboard looks incredible! Great UX design.', date: daysAgo(8) },
        { id: 'k4', fromMemberId: 'david', toMemberId: 'sarah', teamId: 't1', message: 'Thank you for mentoring me on the auth system. Learned so much!', date: daysAgo(10) },
        { id: 'k5', fromMemberId: 'sophia', toMemberId: 'mike', teamId: 't2', message: 'Great job leading the A/B test! Results are impressive.', date: daysAgo(7) },
        { id: 'k6', fromMemberId: 'mike', toMemberId: 'sophia', teamId: 't2', message: 'The dashboard customization feature is a hit! Users love it.', date: daysAgo(9) },
        { id: 'k7', fromMemberId: 'ryan', toMemberId: 'jessica', teamId: 't3', message: 'Congrats on the huge TechCorp deal! That\'s a game changer.', date: daysAgo(6) },
        { id: 'k8', fromMemberId: 'jessica', toMemberId: 'ryan', teamId: 't3', message: 'Excellent upsell strategy! Keep up the great work.', date: daysAgo(8) },
        { id: 'k9', fromMemberId: 'rachel', toMemberId: 'jessica', teamId: 't3', message: 'Thanks for the contract negotiation tips!', date: daysAgo(12) },
        { id: 'k10', fromMemberId: 'alex', toMemberId: 'david', teamId: 't1', message: 'Great collaboration on the API refactor!', date: daysAgo(15) }
    ]

    // Create Action Items
    const actionItems = [
        { id: 'ai1', teamId: 't1', title: 'Update deprecated npm dependencies', description: 'Several packages are 2+ versions behind', priority: 'high' as const, status: 'open' as const, assignee: 'alex', createdAt: daysAgo(7), sourceType: 'blocker' as const, sourceId: 'ci1' },
        { id: 'ai2', teamId: 't1', title: 'Fix Redis connection issues on staging', description: 'Websocket notifications failing intermittently', priority: 'high' as const, status: 'in_progress' as const, assignee: 'alex', createdAt: daysAgo(7), sourceType: 'blocker' as const, sourceId: 'ci3' },
        { id: 'ai3', teamId: 't1', title: 'Improve component test coverage', description: 'Currently at 60%, target is 80%', priority: 'medium' as const, status: 'open' as const, assignee: 'emma', createdAt: daysAgo(7), sourceType: 'blocker' as const, sourceId: 'ci5' },
        { id: 'ai4', teamId: 't2', title: 'Design advanced filtering for dashboard', description: 'Users requesting more granular control', priority: 'medium' as const, status: 'open' as const, assignee: 'sophia', createdAt: daysAgo(7), sourceType: 'manual' as const },
        { id: 'ai5', teamId: 't3', title: 'Get legal approval for TechCorp contract', description: 'Custom terms need review', priority: 'high' as const, status: 'in_progress' as const, assignee: 'jessica', createdAt: daysAgo(7), sourceType: 'blocker' as const, sourceId: 'ci11' },
        { id: 'ai6', teamId: 't3', title: 'Prepare competitor analysis doc', description: 'Compare pricing and features', priority: 'medium' as const, status: 'open' as const, assignee: 'ryan', createdAt: daysAgo(7), sourceType: 'blocker' as const, sourceId: 'ci13' },
        { id: 'ai7', teamId: 't1', title: 'Optimize legacy SQL queries', description: 'Performance improvement needed', priority: 'low' as const, status: 'completed' as const, assignee: 'sarah', createdAt: daysAgo(14), completedAt: daysAgo(10), sourceType: 'blocker' as const, sourceId: 'ci2' }
    ]

    // Save to localStorage
    localStorage.setItem('antigravity_teams', JSON.stringify(teams))
    localStorage.setItem('antigravity_members', JSON.stringify(members))
    localStorage.setItem('antigravity_checkins', JSON.stringify(checkIns))
    localStorage.setItem('antigravity_kudos', JSON.stringify(kudos))
    localStorage.setItem('antigravity_action_items', JSON.stringify(actionItems))

    // Award badges to active members
    awardBadge('sarah', 'streak_7')
    awardBadge('sarah', 'helpful')
    awardBadge('sarah', 'wordsmith')
    awardBadge('alex', 'streak_7')
    awardBadge('alex', 'problem_solver')
    awardBadge('emma', 'early_bird')
    awardBadge('mike', 'streak_7')
    awardBadge('jessica', 'streak_7')
    awardBadge('jessica', 'wordsmith')

    // Create sample notifications
    createNotification({ userId: 'sarah', type: 'kudos', title: '🎉 New Kudos Received!', message: 'Alex appreciated your code review', read: false })
    createNotification({ userId: 'alex', type: 'badge', title: '🏆 Badge Earned!', message: 'You earned the "Problem Solver" badge!', read: false })
    createNotification({ userId: 'sarah', type: 'risk', title: '⚠️ Action Item Assigned', message: 'High priority: Update deprecated dependencies', read: true })
    createNotification({ userId: 'mike', type: 'system', title: '📊 Weekly Report Ready', message: 'Your team report is available', read: true })
    createNotification({ userId: 'jessica', type: 'reminder', title: '⏰ Check-in Reminder', message: 'Submit your weekly check-in', read: false })

    console.log('✅ Demo data loaded successfully!')
    console.log('📊 Created:', {
        teams: teams.length,
        members: members.length,
        checkIns: checkIns.length,
        kudos: kudos.length,
        actionItems: actionItems.length
    })
}
