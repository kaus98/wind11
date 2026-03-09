import { useEffect, useState } from 'react'

interface GithubUser {
    login: string
    avatar_url: string
    html_url: string
    name: string
    bio: string
    public_repos: number
    followers: number
    following: number
}



export function GithubProfileCard({ username }: { username: string }) {
    const [user, setUser] = useState<GithubUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`https://api.github.com/users/${username}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch')
                return res.json()
            })
            .then((data: GithubUser) => setUser(data))
            .catch((err) => console.error('Error fetching basic github user data', err))
            .finally(() => setLoading(false))
    }, [username])

    if (loading) {
        return (
            <div className="github-profile-card loading-skeleton">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-lines">
                    <div className="skeleton-line" style={{ width: '60%' }}></div>
                    <div className="skeleton-line" style={{ width: '80%' }}></div>
                    <div className="skeleton-line" style={{ width: '40%' }}></div>
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <a href={user.html_url} target="_blank" rel="noreferrer" className="github-profile-card">
            <img src={user.avatar_url} alt={`${user.name}'s avatar`} className="github-avatar" />
            <div className="github-info">
                <h3 className="github-name">{user.name || user.login}</h3>
                <span className="github-handle">@{user.login}</span>
                {user.bio && <p className="github-bio">{user.bio}</p>}
                <div className="github-stats">
                    <div className="github-stat">
                        <strong>{user.public_repos}</strong> Repos
                    </div>
                    <div className="github-stat">
                        <strong>{user.followers}</strong> Followers
                    </div>
                    <div className="github-stat">
                        <strong>{user.following}</strong> Following
                    </div>
                </div>
            </div>
        </a>
    )
}


