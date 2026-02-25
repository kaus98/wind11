import portfolioJson from './portfolio-content.json?raw'

type EmploymentType = 'full-time' | 'internship'

type SocialKey = 'instagram' | 'github' | 'linkedin' | 'kaggle'

export type PortfolioData = {
  about: {
    name: string
    rolesLine: string
    location: string
    summaryParagraphs: string[]
    technologies: string[]
    programming: string[]
    education: string[]
    interests: string[]
    achievements: string[]
  }
  socialLinks: Array<{
    key: SocialKey
    label: string
    href: string
  }>
  contact: {
    email: string
    phone: string
    links: Array<{
      label: string
      href: string
      download?: boolean
    }>
    responsibilities: string[]
  }
  jobs: Array<{
    company: string
    role: string
    employmentType: EmploymentType
    sortOrder: number
    period?: string
    highlights: string[]
  }>
  blogs: Array<{
    title: string
    date: string
    summary: string
    link: string
  }>
  projects: Array<{
    title: string
    subtitle: string
    description: string
    website?: string
    github?: string
  }>
  certifications: string[]
}

function parsePortfolioData(): PortfolioData {
  return JSON.parse(portfolioJson) as PortfolioData
}

export const portfolioData = parsePortfolioData()
