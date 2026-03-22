const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

// Caminhos usados no app
const pagesPath = path.join(__dirname, 'src/pages')
const DATA_PATH = path.join(require('os').homedir(), 'MFSIM DADOS', 'dados.json')     // caminho do JSON gravado pelo transmissor

// Referência global da janela — necessário para enviar dados via IPC de fora da função
let win

function CreateWindow() {
    win = new BrowserWindow({
        width: 880,
        height: 660,
        minWidth: 880,
        minHeight: 660,
        icon: path.join('src/assets/mfsimLogo.ico'),
        webPreferences: {
            nodeIntegration: true,    // permite usar require() no renderer.js
            contextIsolation: false   // necessário para o ipcRenderer funcionar
        }
    })
    win.setMenu(null)
    win.loadFile(path.join(pagesPath, 'index.html'))

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('data-path', DATA_PATH)
    })

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