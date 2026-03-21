const { ipcRenderer } = require('electron')

const sliderAS = document.querySelector('.input-box:nth-child(1) input[type="range"]')
const sliderVS = document.querySelector('.input-box:nth-child(2) input[type="range"]')

const valueAS = document.querySelector('.input-box:nth-child(1) .number')
const valueVS = document.querySelector('.input-box:nth-child(2) .number')

function padAS(n) {
    return String(Math.abs(n)).padStart(3, '0')
}

function fmtVS(n) {
    n = parseInt(n)
    return (n >= 0 ? '+' : '-') + String(Math.abs(n)).padStart(4, '0')
}

function sendData() {
    ipcRenderer.send('save-data', {
        airspeed: parseInt(sliderAS.value),
        vs: parseInt(sliderVS.value)
    })
}

sliderAS.addEventListener('input', () => {
    valueAS.textContent = padAS(sliderAS.value)
    sendData()
})

sliderVS.addEventListener('input', () => {
    valueVS.textContent = fmtVS(sliderVS.value)
    sendData()
})