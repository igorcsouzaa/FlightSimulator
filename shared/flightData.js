const path = require('path')

const DATA_PATH = 'C:\\MFSIM DADOS\\dados.json'

function buildData(airspeed, vs) {
  return {
    airspeed,
    vs
  }
}

module.exports = { DATA_PATH, buildData }