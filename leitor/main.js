const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

// Caminhos usados no app
const assetsPath = path.join(__dirname, '\\assets') // pasta de assets compartilhada
const pagesPath = path.join(__dirname, 'src/pages')
const DATA_PATH = 'C:\\MFSIM DADOS\\dados.json'     // caminho do JSON gravado pelo transmissor

// Referência global da janela — necessário para enviar dados via IPC de fora da função
let win

function CreateWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(assetsPath, '\\mfsimLogo.ico'),
        webPreferences: {
            nodeIntegration: true,    // permite usar require() no renderer.js
            contextIsolation: false   // necessário para o ipcRenderer funcionar
        }
    })

    win.loadFile(path.join(pagesPath, 'index.html'))

    // Polling: lê o JSON a cada 100ms e envia os dados pro renderer
    setInterval(() => {

        // Se o arquivo ainda não existe (transmissor não iniciado), ignora
        if (!fs.existsSync(DATA_PATH)) return

        try {
            const raw = fs.readFileSync(DATA_PATH, 'utf-8') // lê o arquivo como texto
            const data = JSON.parse(raw)                     // converte o texto em objeto JS
            win.webContents.send('flight-data', data)        // envia pro renderer via IPC
        } catch (e) {
            console.error('Erro ao ler JSON:', e)
        }
    }, 100)
}

app.whenReady().then(() => {
    CreateWindow()

    // No macOS recria a janela quando o ícone do dock é clicado
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) CreateWindow()
    })
})

// Encerra o processo quando todas as janelas forem fechadas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})