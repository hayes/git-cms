export default class BaseFS {
  exists () {
    return Promise.reject(new Error('FS.exists not implemented'))
  }
  mkdir () {
    return Promise.reject(new Error('FS.mkdir not implemented'))
  }
  readdir () {
    return Promise.reject(new Error('FS.readdir not implemented'))
  }
  readFile () {
    return Promise.reject(new Error('FS.readFile not implemented'))
  }
  rename () {
    return Promise.reject(new Error('FS.rename not implemented'))
  }
  rmdir () {
    return Promise.reject(new Error('FS.rmdir not implemented'))
  }
  stat () {
    return Promise.reject(new Error('FS.stat not implemented'))
  }
  writeFile () {
    return Promise.reject(new Error('FS.writeFile not implemented'))
  }
}
