const { ipcRenderer } = require('electron')

// Elementos da agulha no html
const needleAS = document.getElementById('needleAS')
const needleVS = document.getElementById('needleVS')

// Tabela de calibração do airspeed
const asCalibration = [
    { kt: 0,   deg: 0   },
    { kt: 40,  deg: 31  },
    { kt: 60,  deg: 72  },
    { kt: 80,  deg: 115 },
    { kt: 100, deg: 163 },
    { kt: 120, deg: 205 },
    { kt: 140, deg: 236 },
    { kt: 160, deg: 268 },
    { kt: 180, deg: 290 },
    { kt: 200, deg: 318 }
]

// Retorna o ângulo de rotação da agulha para um valor de airspeed
// Usa interpolação linear entre os pontos da tabela de calibração
function getASDeg(airspeed) {
    // Limita aos extremos da tabela
    if (airspeed <= asCalibration[0].kt) return asCalibration[0].deg
    if (airspeed >= asCalibration[asCalibration.length - 1].kt) return asCalibration[asCalibration.length - 1].deg

    // Encontra o segmento correspondente e interpola
    for (let i = 0; i < asCalibration.length - 1; i++) {
        const a = asCalibration[i]
        const b = asCalibration[i + 1]
        if (airspeed >= a.kt && airspeed <= b.kt) {
            const t = (airspeed - a.kt) / (b.kt - a.kt) // proporção entre os dois pontos
            return a.deg + t * (b.deg - a.deg)           // interpolação linear
        }
    }
}

// Tabela de calibração da velocidade vertical
const vsCalibration = [
    { vs: -2000, deg: -262 },
    { vs: -1500, deg: -216 },
    { vs: -1000, deg: -170 },
    { vs: -500,  deg: -126 },
    { vs: 0,     deg: -90  },
    { vs: 500,   deg: -55  },
    { vs: 1000,  deg: -10  },
    { vs: 1500,  deg: 38   },
    { vs: 2000,  deg: 84   }
]

// Retorna o ângulo de rotação da agulha para um valor de vertical speed
// Mesma lógica de interpolação linear do getASDeg
function getVSDeg(vs) {
    if (vs <= vsCalibration[0].vs) return vsCalibration[0].deg
    if (vs >= vsCalibration[vsCalibration.length - 1].vs) return vsCalibration[vsCalibration.length - 1].deg

    for (let i = 0; i < vsCalibration.length - 1; i++) {
        const a = vsCalibration[i]
        const b = vsCalibration[i + 1]
        if (vs >= a.vs && vs <= b.vs) {
            const t = (vs - a.vs) / (b.vs - a.vs)
            return a.deg + t * (b.deg - a.deg)
        }
    }
}

// Atualiza a rotação visual das duas agulhas com base nos dados recebidos
function updateNeedles(data) {
    const degAS = getASDeg(data.airspeed)
    const degVS = getVSDeg(data.vs)

    needleAS.style.transform = `rotate(${degAS}deg)`
    needleVS.style.transform = `rotate(${degVS}deg)`
}

// Escuta os dados enviados pelo main.js via IPC a cada 100ms
ipcRenderer.on('flight-data', (event, data) => {
    updateNeedles(data)
})