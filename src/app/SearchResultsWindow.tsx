import type { CSSProperties } from 'react'
import { ProjectsIcon } from './icons'
import type { PortfolioData } from '../data/portfolioData'

type SearchResultsWindowProps = {
    query: string
    normalizedQuery: string
    searchWindowStyle: CSSProperties
    setQuery: (query: string) => void
    filteredProjectCards: PortfolioData['projects']
    filteredBlogPosts: PortfolioData['blogs']
    searchedJobs: PortfolioData['jobs']
    filteredFullTimeJobs: PortfolioData['jobs']
    filteredInternshipJobs: PortfolioData['jobs']
}

export function SearchResultsWindow({
    query,
    normalizedQuery,
    searchWindowStyle,
    setQuery,
    filteredProjectCards,
    filteredBlogPosts,
    searchedJobs,
    filteredFullTimeJobs,
    filteredInternshipJobs,
}: SearchResultsWindowProps) {
    if (!normalizedQuery) return null

    return (
        <section className="window active search-results-window" style={searchWindowStyle} onMouseDown={(e) => e.stopPropagation()}>
            <header className="window-titlebar">
                <div className="window-title">
                    <span className="app-icon small projects" aria-hidden="true">
                        <ProjectsIcon className="icon" />
                    </span>
                    <span>Search Results</span>
                </div>
                <div className="window-controls">
                    <button className="win-btn close" type="button" aria-label="Close search" onClick={() => setQuery('')}>
                        <span className="win-glyph">×</span>
                    </button>
                </div>
            </header>

            <div className="window-content">
                <div className="panel cards-panel">
                    <h2 className="section-heading">Results for "{query}"</h2>
                    <p className="muted">
                        {filteredProjectCards.length} project matches · {filteredBlogPosts.length} blog matches · {searchedJobs.length} work matches
                    </p>

                    <h3 className="section-heading panel-block">Projects</h3>
                    {filteredProjectCards.length > 0 ? (
                        <div className="cards">
                            {filteredProjectCards.map((project) => (
                                <article key={`search-${project.title}`} className="wcard">
                                    <h3 className="wcard-title">{project.title}</h3>
                                    <p className="muted">{project.subtitle}</p>
                                    <p className="wcard-text">{project.description}</p>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="muted">No matching projects.</p>
                    )}

                    <h3 className="section-heading panel-block">Blogs</h3>
                    {filteredBlogPosts.length > 0 ? (
                        <div className="cards">
                            {filteredBlogPosts.map((post) => (
                                <article key={`search-blog-${post.link}`} className="wcard">
                                    <h3 className="wcard-title">{post.title}</h3>
                                    <p className="muted">{post.date}</p>
                                    <p className="wcard-text">{post.summary}</p>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="muted">No matching blogs.</p>
                    )}

                    <h3 className="section-heading panel-block">Work</h3>
                    {searchedJobs.length > 0 ? (
                        <div className="jobs-list">
                            {filteredFullTimeJobs.length > 0 && <p className="muted">Full-time</p>}
                            {filteredFullTimeJobs.map((job) => (
                                <article key={`search-ft-${job.company}`} className="wcard job-card">
                                    <h3 className="wcard-title">{job.company}</h3>
                                    <p className="job-meta">
                                        {job.role}
                                        {job.period ? ` · ${job.period}` : ''}
                                    </p>
                                </article>
                            ))}

                            {filteredInternshipJobs.length > 0 && <p className="muted">Internships</p>}
                            {filteredInternshipJobs.map((job) => (
                                <article key={`search-int-${job.company}`} className="wcard job-card">
                                    <h3 className="wcard-title">{job.company}</h3>
                                    <p className="job-meta">
                                        {job.role}
                                        {job.period ? ` · ${job.period}` : ''}
                                    </p>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="muted">No matching work experience.</p>
                    )}
                </div>
            </div>
        </section>
    )
}
