const STORAGE_KEY = 'distribution.team_leader_id'

export function normalizeTeamLeaderId (value) {
  if (value === null || value === undefined || value === '') return null
  const id = Number(value)
  return Number.isFinite(id) && id > 0 ? id : null
}

export function getStoredTeamLeaderId () {
  if (typeof window === 'undefined' || !window.localStorage) return null
  return normalizeTeamLeaderId(window.localStorage.getItem(STORAGE_KEY))
}

export function setStoredTeamLeaderId (id) {
  if (typeof window === 'undefined' || !window.localStorage) return
  const normalized = normalizeTeamLeaderId(id)
  if (!normalized) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }
  window.localStorage.setItem(STORAGE_KEY, String(normalized))
}

export function buildTeamOption (agent) {
  if (!agent) return null
  const id = normalizeTeamLeaderId(agent.user_id ?? agent.id)
  if (!id) return null
  const nickname = agent.user_nickname || agent.nickname || agent.name || agent.username || ''
  const label = nickname ? `#${id} ${nickname}` : `#${id}`
  return { value: id, label, data: agent }
}
