import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import GitFS from './git-fs'
import FileTree from './containers/filetree'

const fs = new GitFS()
fs.loadBranch('master')

class App extends React.Component {
  static propTypes = {
    fs: React.PropTypes.object.isRequired,
    branch: React.PropTypes.string
  }

  render () {
    return (
      <FileTree fs={this.props.fs} />
    )
  }
}

const content = document.getElementById('App')
ReactDOM.render(<App fs={fs} />, content)
