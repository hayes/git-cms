import React from 'react'
import { Treebeard } from 'react-treebeard'

export default class FileTree extends React.Component {
  static propTypes = {
    fs: React.PropTypes.object.isRequired
  }

  stateMap = new WeakMap()

  constructor () {
    super()
    this.state = {}
  }

  componentWillMount () {
    this.props.fs.on('update-tree', this.onTreeUpdate)
    this.onTreeUpdate()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.fs !== this.prop.fs) {
      this.props.fs.removeListener('update-tree', this.onTreeUpdate)
      nextProps.fs.on('update-tree', this.onTreeUpdate)
    }
    return nextProps
  }

  componentWillUnmount () {
    this.props.fs.removeListener('update-tree', this.onTreeUpdate)
  }

  onTreeUpdate = () => {
    this.setState({root: this.renderNode(this.props.fs.root)})
  }

  loadNode (node) {
    return node.load()
  }

  renderNode (node, depth = 0) {
    if (!node) {
      return {
        name: name,
        children: []
      }
    }
    if (node.type === 'blob') {
      return {
        name: node.name
      }
    }

    return {
      ...this.stateMap.get(node) || {
        toggled: !depth
      },
      loading: node.loading,
      name: node.name,
      id: node.sha,
      tree: node,
      children: node.children.sort(dirsFisrt).map(child => this.renderNode(child, depth + 1))
    }
  }

  toggleNode = (node) => {
    if (this.stateMap.has(node.tree)) {
      const state = this.stateMap.get(node.tree)
      state.toggled = !state.toggled
    } else {
      this.stateMap.set(node.tree, {
        toggled: true
      })
    }

    if (!node.tree.loaded && !node.tree.loading) {
      node.tree.load()
    }

    this.onTreeUpdate()
  }

  render = () => {
    return (
      <div className='filetree'>
        <Treebeard data={this.state.root} onToggle={this.toggleNode} />
      </div>
    )
  }
}

function dirsFisrt (a, b) {
  if (a.type === 'tree' && b.type !== 'tree') {
    return -1
  } else if (a.type !== 'tree' && b.type === 'tree') {
    return 1
  } else {
    return a.name > b.name ? 1 : -1
  }
}
