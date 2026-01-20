/**
 * Sigil Toolbar - Linear API Integration
 * Creates issues from feedback with physics context
 */

import type { FeedbackRequest, ToolbarSettings } from '../shared/types'

const LINEAR_API_URL = 'https://api.linear.app/graphql'

interface LinearIssueResponse {
  data?: {
    issueCreate?: {
      success: boolean
      issue?: {
        id: string
        identifier: string
        url: string
      }
    }
  }
  errors?: Array<{ message: string }>
}

/**
 * Create a Linear issue from feedback
 */
export async function createLinearIssue(
  feedback: FeedbackRequest,
  settings: ToolbarSettings
): Promise<{ success: boolean; issueUrl?: string; error?: string }> {
  if (!settings.linearApiKey) {
    return { success: false, error: 'Linear API key not configured' }
  }

  if (!settings.linearTeamId) {
    return { success: false, error: 'Linear team ID not configured' }
  }

  // Build issue title
  const title = buildIssueTitle(feedback)

  // Build issue description with physics context
  const description = buildIssueDescription(feedback)

  // GraphQL mutation
  const mutation = `
    mutation CreateIssue($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue {
          id
          identifier
          url
        }
      }
    }
  `

  const variables = {
    input: {
      teamId: settings.linearTeamId,
      title,
      description,
      // Add labels if configured
      ...(settings.linearLabelIds && { labelIds: settings.linearLabelIds }),
    },
  }

  try {
    const response = await fetch(LINEAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: settings.linearApiKey,
      },
      body: JSON.stringify({ query: mutation, variables }),
    })

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` }
    }

    const result: LinearIssueResponse = await response.json()

    if (result.errors && result.errors.length > 0) {
      return { success: false, error: result.errors[0].message }
    }

    if (result.data?.issueCreate?.success && result.data.issueCreate.issue) {
      return {
        success: true,
        issueUrl: result.data.issueCreate.issue.url,
      }
    }

    return { success: false, error: 'Unknown error creating issue' }
  } catch (error) {
    console.error('[Sigil] Linear API error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Build issue title from feedback
 */
function buildIssueTitle(feedback: FeedbackRequest): string {
  const typePrefix = feedback.type === 'bug' ? '🐛' : feedback.type === 'friction' ? '⚡' : '💡'

  // Try to extract a meaningful title
  let title = feedback.note.split('\n')[0].slice(0, 80)

  // If note is too short, use element context
  if (title.length < 10 && feedback.annotation?.element) {
    const el = feedback.annotation.element
    title = `${el.tagName} element${el.textContent ? `: "${el.textContent.slice(0, 40)}"` : ''}`
  }

  return `${typePrefix} [Sigil] ${title}`
}

/**
 * Build issue description with full physics context
 */
function buildIssueDescription(feedback: FeedbackRequest): string {
  const sections: string[] = []

  // User note
  sections.push(`## Feedback\n\n${feedback.note}`)

  // Page context
  sections.push(`## Context\n\n- **URL**: ${feedback.url}\n- **Viewport**: ${feedback.viewport.width}×${feedback.viewport.height}`)

  // Physics analysis
  if (feedback.annotation?.physics) {
    const p = feedback.annotation.physics
    sections.push(`## Physics Analysis\n
| Property | Value |
|----------|-------|
| Effect | ${p.effect} |
| Sync | ${p.sync} |
| Timing | ${p.timing}ms |
| Confirmation | ${p.confirmation ? 'Required' : 'None'} |
${p.easing ? `| Easing | ${p.easing} |` : ''}
${p.interruptible !== undefined ? `| Interruptible | ${p.interruptible ? 'Yes' : 'No'} |` : ''}`)
  }

  // Element details
  if (feedback.annotation?.element) {
    const el = feedback.annotation.element
    sections.push(`## Element\n
\`\`\`
Selector: ${el.selector}
Tag: ${el.tagName}
${el.textContent ? `Content: "${el.textContent}"` : ''}
\`\`\``)
  }

  // Violations
  if (feedback.violations && feedback.violations.length > 0) {
    const violationList = feedback.violations
      .map(v => `- **${v.rule}** (${v.severity}): ${v.message}`)
      .join('\n')
    sections.push(`## Physics Violations\n\n${violationList}`)
  }

  // Screenshot reference
  if (feedback.annotation?.screenshot) {
    sections.push(`## Screenshot\n\nRef: \`${feedback.annotation.screenshot}\`\n\n_(Screenshot stored in extension storage)_`)
  }

  // Footer
  sections.push(`---\n\n_Created via Sigil Toolbar at ${new Date().toISOString()}_`)

  return sections.join('\n\n')
}

/**
 * Verify Linear API credentials
 */
export async function verifyLinearCredentials(
  apiKey: string,
  teamId: string
): Promise<{ valid: boolean; error?: string; teamName?: string }> {
  const query = `
    query VerifyTeam($teamId: String!) {
      team(id: $teamId) {
        id
        name
      }
    }
  `

  try {
    const response = await fetch(LINEAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({ query, variables: { teamId } }),
    })

    if (!response.ok) {
      if (response.status === 401) {
        return { valid: false, error: 'Invalid API key' }
      }
      return { valid: false, error: `HTTP ${response.status}` }
    }

    const result = await response.json()

    if (result.errors) {
      return { valid: false, error: result.errors[0]?.message || 'API error' }
    }

    if (result.data?.team) {
      return { valid: true, teamName: result.data.team.name }
    }

    return { valid: false, error: 'Team not found' }
  } catch (error) {
    return { valid: false, error: String(error) }
  }
}

/**
 * Get available labels for a team
 */
export async function getTeamLabels(
  apiKey: string,
  teamId: string
): Promise<Array<{ id: string; name: string; color: string }>> {
  const query = `
    query TeamLabels($teamId: String!) {
      team(id: $teamId) {
        labels {
          nodes {
            id
            name
            color
          }
        }
      }
    }
  `

  try {
    const response = await fetch(LINEAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({ query, variables: { teamId } }),
    })

    if (!response.ok) return []

    const result = await response.json()
    return result.data?.team?.labels?.nodes || []
  } catch {
    return []
  }
}
