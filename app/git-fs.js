export default class GitFS {
  constructor () {
    this.branch = 'master'
  }

  async treeFromBranch () {
    const ref = await this.makeRequest(`/git/refs/heads/${this.branch}`)
    const commit = await this.makeRequest(`/git/commits/${ref.object.sha}`)
    const tree = await this.makeRequest(`/git/trees/${commit.sha}`)
    return tree
  }

  async makeRequest (url) {
    const res = await fetch(url)
    return await res.json()
  }
}
