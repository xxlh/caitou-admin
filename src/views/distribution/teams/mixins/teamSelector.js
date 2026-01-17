import { fetchAgents } from '@/api/distribution/index'
import {
  buildTeamOption,
  getStoredTeamLeaderId,
  normalizeTeamLeaderId,
  setStoredTeamLeaderId
} from '@/utils/distributionTeam'

export default {
  data () {
    return {
      teamLeaderId: getStoredTeamLeaderId(),
      teamOptions: [],
      teamLoading: false,
      teamKeyword: '',
      teamInitialized: false
    }
  },
  created () {
    this.loadTeamOptions('')
  },
  watch: {
    teamLeaderId (value) {
      const normalized = normalizeTeamLeaderId(value)
      if (!normalized) return
      setStoredTeamLeaderId(normalized)
      if (typeof this.onTeamChange === 'function') {
        this.onTeamChange(normalized)
      }
    }
  },
  methods: {
    async loadTeamOptions (keyword) {
      this.teamLoading = true
      this.teamKeyword = keyword || ''
      try {
        const res = await fetchAgents({
          keyword: keyword || undefined,
          top_level_only: 1,
          per_page: 50,
          page: 1
        })
        this.teamOptions = (res.data || [])
          .map(item => buildTeamOption(item))
          .filter(Boolean)
        const currentId = normalizeTeamLeaderId(this.teamLeaderId)
        if (!this.teamInitialized) {
          const exists = currentId && this.teamOptions.some(option => option.value === currentId)
          if (!exists && this.teamOptions.length) {
            this.teamLeaderId = this.teamOptions[0].value
          } else if (exists && typeof this.onTeamChange === 'function') {
            this.onTeamChange(currentId)
          }
          this.teamInitialized = true
        }
      } catch (error) {
        this.$message.error(error?.msg || '加载团队失败')
      } finally {
        this.teamLoading = false
      }
    },
    handleTeamSearch (keyword) {
      this.loadTeamOptions(keyword)
    },
    handleTeamChange (value) {
      this.teamLeaderId = normalizeTeamLeaderId(value)
    }
  }
}
