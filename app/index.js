import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Treebeard } from 'react-treebeard'
import GitFS from './git-fs'



const fs = new GitFS()

fs.init('master')

const data = {
  name: '{project name}',
  toggled: true,
  children: [{
    name: 'parent',
    children: [
      { name: 'child1' },
      { name: 'child2' }
    ]
  }, {
    name: 'loading parent',
    loading: true,
    children: []
  }, {
    name: 'parent',
    children: [{
      name: 'nested parent',
      children: [
        { name: 'nested child 1' },
        { name: 'nested child 2' }
      ]
    }]
  }]
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.onToggle = this.onToggle.bind(this)
  }
  onToggle (node, toggled) {
    if (this.state.cursor) {
      this.state.cursor.active = false
    }
    node.active = true
    if (node.children) {
      node.toggled = toggled
    }
    this.setState({ cursor: node })
  }
  render () {
    return (
      <div className='filetree'>
        <Treebeard
          data={data}
          onToggle={this.onToggle}
        />
      </div>
    )
  }
}

const content = document.getElementById('App')
ReactDOM.render(<App />, content)
