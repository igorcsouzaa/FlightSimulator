const { ipcRenderer } = require('electron')

// Elementos dos sliders e displays de valor no html
const sliderAS = document.querySelector('.input-box:nth-child(1) input[type="range"]')
const sliderVS = document.querySelector('.input-box:nth-child(2) input[type="range"]')

const valueAS = document.querySelector('.input-box:nth-child(1) .number')
const valueVS = document.querySelector('.input-box:nth-child(2) .number')

// Formata o airspeed com 3 dígitos — ex: 5 → "005", 120 → "120"
function padAS(n) {
    return String(Math.abs(n)).padStart(3, '0')
}

// Formata o vertical speed com sinal e 4 dígitos — ex: 500 → "+0500", -1000 → "-1000"
function fmtVS(n) {
    n = parseInt(n)
    return (n >= 0 ? '+' : '-') + String(Math.abs(n)).padStart(4, '0')
}

// Envia os valores atuais dos dois sliders pro main.js via IPC
// O main.js recebe e grava no dados.json
function sendData() {
    ipcRenderer.send('save-data', {
        airspeed: parseInt(sliderAS.value),
        vs: parseInt(sliderVS.value)
    })
}

// atualiza o display numérico AS e envia os dados
sliderAS.addEventListener('input', () => {
    valueAS.textContent = padAS(sliderAS.value)
    sendData()
})

// atualiza o display numérico VS e envia os dados
sliderVS.addEventListener('input', () => {
    valueVS.textContent = fmtVS(sliderVS.value)
    sendData()
})

ipcRenderer.on('data-path', (event, path) => {
    document.querySelector('.footer-output-text').textContent = 
        `ARQUIVO DE SAÍDA: ${path}`
})