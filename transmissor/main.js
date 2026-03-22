const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const fs = require("fs")

// Caminhos usados no app
const srcPath = path.join(__dirname + "/src")
const pagesPath = path.join(srcPath + "/pages")
const DATA_PATH = path.join(require('os').homedir(), 'MFSIM DADOS', 'dados.json')    // caminho do JSON compartilhado com o leitor

function CreateWindow() {
    const win = new BrowserWindow({
        width: 880,
        height: 660,
        minWidth: 880,
        minHeight: 660,
        icon: path.join('src/assets/mfsimLogo.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.setMenu(null)
    win.loadFile(pagesPath + '/index.html')

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('data-path', DATA_PATH)
    })
}

// Escuta o evento 'save-data' enviado pelo renderer quando o slider é movido
ipcMain.on('save-data', (event, data) => {

    // Monta o objeto JSON com os dados recebidos
    const json = JSON.stringify({
        airspeed: data.airspeed,
        vs: data.vs
    }, null, 2) // null, 2 = formatação com indentação de 2 espaços

    // Cria a pasta C:\MFSIM DADOS\ se não existir
    const dir = path.dirname(DATA_PATH)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    // Grava o JSON no disco, sobrescrevendo o arquivo anterior
    fs.writeFileSync(DATA_PATH, json, 'utf-8')
})

app.whenReady().then(() => {
    CreateWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            CreateWindow()
        }
    })
})

// Encerra o processo quando as janelas forem fechadas
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})