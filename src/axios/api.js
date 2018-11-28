import axios from 'axios'
// axios 配置
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
export default
function request (method, url, data) {
  /* const self = this */
  return new Promise((resolve, reject) => {
    if (method === 'get') {
      axios.get(url)
        .then(response => {
          if (response && response.status && response.status === 200) {
            resolve(response.data)
          } else {
            reject(response.data)
          }
        }, err => {
          reject(err)
        })
    } else {
      axios.post(url, data)
        .then(response => {
          if (response && response.status && response.status === 200) {
            resolve(response.data)
          } else {
            reject(response.data)
          }
        }, err => {
          reject(err)
        })
    }
  })
}
