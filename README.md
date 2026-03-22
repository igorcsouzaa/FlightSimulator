# ✈️ FlightSimulator – Simulador de Instrumentos de Voo

Esse projeto tem o objetivo de construir um sistema de instrumentos de voo virtual capaz de transmitir e exibir dados de telemetria em tempo real.

O sistema utiliza:  
✔ Dois executáveis Electron independentes  
✔ Comunicação via arquivo JSON compartilhado  
✔ Interface inspirada em painéis aviônicos reais  
✔ Ponteiros giratórios com calibração por interpolação linear  

---

## 📋 Índice
- 📌 Sobre o Projeto  
- 🛠 Tecnologias Utilizadas  
- 🚀 Como Funciona  
- ⚙️ Instalação & Configuração  
- ▶️ Como Executar  

---

## 📌 Sobre o Projeto

O FlightSimulator é um sistema composto por dois aplicativos desktop que se comunicam em tempo real, simulando o comportamento de instrumentos de voo reais:

- **Transmissor** — painel de controle com sliders para Airspeed e Vertical Speed  
- **Leitor** — display com os instrumentos AIRSPEED e VSI com ponteiros giratórios  

Os dados são gravados pelo Transmissor em `C:\MFSIM DADOS\dados.json` e lidos pelo Leitor a cada 100ms, atualizando os ponteiros em tempo real.

---

## 🛠 Tecnologias Utilizadas

Este projeto foi construído utilizando:

- Electron  
- Node.js (fs, path, ipcMain, ipcRenderer)  
- HTML, CSS, JavaScript  
- electron-builder  
- Git & GitHub  

---

## 🚀 Como Funciona

1. O usuário move os sliders no app **Transmissor**  
2. Os valores são enviados via IPC pro processo main  
3. O main grava os dados em `C:\MFSIM DADOS\dados.json`  
4. O app **Leitor** lê o JSON a cada 100ms via polling  
5. Os ponteiros dos instrumentos giram em tempo real de acordo com os valores  

---

## 📁 Estrutura do Projeto

```
FlightSimulator/
├── transmissor/          # App 1 — painel de controle
│   ├── main.js
│   ├── package.json
│   └── src/
│       ├── assets/
│       │   └── mfsimLogo.png / .ico
│       ├── pages/
│       └── static/
│
└── leitor/               # App 2 — display de instrumentos
    ├── main.js
    ├── package.json
    └── src/
        ├── assets/
        │   ├── AIRSPEED.png
        │   ├── VSI.png
        │   ├── needle.png
        │   └── mfsimLogo.png / .ico
        ├── pages/
        └── static/
```

---

## ⚙️ Instalação & Configuração

### 1) Pré-requisitos

Antes de começar, instale:

- [Node.js](https://nodejs.org/) v18+  
- npm  
- Git  

---

### 2) Clone o Repositório

```bash
git clone https://github.com/igorcsouzaa/FlightSimulator.git
cd FlightSimulator
```

---

### 3) Instalar Dependências

```bash
# Transmissor
cd transmissor
npm install

# Leitor
cd ../leitor
npm install
```

---

## ▶️ Como Executar

> Execute o **Transmissor primeiro** para garantir que o arquivo JSON seja criado antes do Leitor tentar lê-lo.

### Transmissor
```bash
cd transmissor
npm start
```

### Leitor
```bash
cd leitor
npm start
```

---

## 📦 Build (gerar executáveis)

```bash
# Transmissor
cd transmissor
npm run build

# Leitor
cd ../leitor
npm run build
```

Os instaladores (setup) `.exe` serão gerados na pasta `dist/` de cada app.
