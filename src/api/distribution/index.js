import { axios } from '@/utils/request'

const api = {
  agents: '/agents',
  agentDetail: '/agents/{id}',
  agentStats: '/agents/{id}/stats',
  createAgent: '/agents',
  updateAgent: '/agents/{id}',
  managerAgents: '/members/{id}/agents',
  assignAgents: '/members/{id}/assign_agents',
  managers: '/members', // 改用通用的 members 接口，通过 role 参数筛选
  rebates: '/rebates',
  rebateApprove: '/rebates/{id}/approve',
  rebateReject: '/rebates/{id}/reject',
  withdrawals: '/withdrawals',
  withdrawalApprove: '/withdrawals/{id}/approve',
  withdrawalReject: '/withdrawals/{id}/reject',
  withdrawalMarkPaid: '/withdrawals/{id}/mark_paid',
  withdrawalConfig: '/settings/withdrawal',
  withdrawalStats: '/withdrawals/stats',
  withdrawalExport: '/withdrawals/export',
  withdrawalBatchApprove: '/withdrawals/batch_approve',
  withdrawalBatchMarkPaid: '/withdrawals/batch_mark_paid',
  statsDaily: '/agents/stats/daily',
  statsRanking: '/agents/stats/ranking',
  statsOverall: '/agents/stats/overall',
  statsTeam: '/agents/stats/team',
  statsDetail: '/agents/stats/detail'
}

export function fetchAgents (params) {
  return axios({
    url: api.agents,
    method: 'get',
    params
  })
}

export function createAgent (data) {
  return axios({
    url: api.createAgent,
    method: 'post',
    data
  })
}

export function updateAgent (id, data) {
  return axios({
    url: api.updateAgent.replace('{id}', id),
    method: 'patch',
    data
  })
}

export function fetchAgentStats (id, params) {
  return axios({
    url: api.agentStats.replace('{id}', id),
    method: 'get',
    params
  })
}

export function fetchManagers (params) {
  return axios({
    url: api.managers,
    method: 'get',
    params: {
      ...params,
      role: '分销管理员' // 筛选分销管理员角色
    }
  })
}

export function assignAgentsToManager (memberId, data) {
  return axios({
    url: api.assignAgents.replace('{id}', memberId),
    method: 'post',
    data
  })
}

export function fetchManagerAgents (memberId, params) {
  return axios({
    url: api.managerAgents.replace('{id}', memberId),
    method: 'get',
    params
  })
}

export function fetchRebates (params) {
  return axios({
    url: api.rebates,
    method: 'get',
    params
  })
}

export function approveRebate (id, data) {
  return axios({
    url: api.rebateApprove.replace('{id}', id),
    method: 'patch',
    data
  })
}

export function rejectRebate (id, data) {
  return axios({
    url: api.rebateReject.replace('{id}', id),
    method: 'patch',
    data
  })
}

export function fetchWithdrawals (params) {
  return axios({
    url: api.withdrawals,
    method: 'get',
    params
  })
}

export function approveWithdrawal (id, data) {
  return axios({
    url: api.withdrawalApprove.replace('{id}', id),
    method: 'patch',
    data
  })
}

export function rejectWithdrawal (id, data) {
  return axios({
    url: api.withdrawalReject.replace('{id}', id),
    method: 'patch',
    data
  })
}

export function markWithdrawalPaid (id, data) {
  return axios({
    url: api.withdrawalMarkPaid.replace('{id}', id),
    method: 'patch',
    data
  })
}

export function fetchAgentStatsDaily (params) {
  return axios({
    url: api.statsDaily,
    method: 'get',
    params
  })
}

export function fetchAgentStatsRanking (params) {
  return axios({
    url: api.statsRanking,
    method: 'get',
    params
  })
}

export function fetchAgentStatsOverall (params) {
  return axios({
    url: api.statsOverall,
    method: 'get',
    params
  })
}

export function fetchAgentTeamStats (params) {
  return axios({
    url: api.statsTeam,
    method: 'get',
    params
  })
}

export function fetchAgentDetailStats (params) {
  return axios({
    url: api.statsDetail,
    method: 'get',
    params
  })
}

// 提现配置相关
export function fetchWithdrawalConfig () {
  return axios({
    url: api.withdrawalConfig,
    method: 'get'
  })
}

export function updateWithdrawalConfig (data) {
  return axios({
    url: api.withdrawalConfig,
    method: 'put',
    data: { values: data }
  })
}

export function fetchWithdrawalStats (params) {
  return axios({
    url: api.withdrawalStats,
    method: 'get',
    params
  })
}

export function exportWithdrawals (params) {
  return axios({
    url: api.withdrawalExport,
    method: 'get',
    params
  })
}

export function batchApproveWithdrawals (ids) {
  return axios({
    url: api.withdrawalBatchApprove,
    method: 'post',
    data: { ids }
  })
}

export function batchMarkWithdrawalsPaid (ids) {
  return axios({
    url: api.withdrawalBatchMarkPaid,
    method: 'post',
    data: { ids }
  })
}
