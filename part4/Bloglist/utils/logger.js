const info = (...params) => {
  console.log(...params)
}

const error = (...error) => {
  console.error(...params)
}

module.exports = { info, error }
