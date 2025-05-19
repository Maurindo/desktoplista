const { app, BrowserWindow, nativeImage, dialog, ipcMain} = require("electron");
//HABILITA O LIVE RELOAD NO ELECTRON E NO FRONTEND DA APLICAÇÃO COM A LIB ELECTRON-RELOAD
//require("electron-reload")(__dirname, {
//    electron: require(`${__dirname}/node_modules/electron`),
//})

if(!app.isPackaged){
    require('electron-reload')(__dirname)
}

function createWindow(){
    //ADICIONA UM ICONE NA BARRA DE TAREFAS/dock
    const icon = nativeImage.createFromPath(`${app.getAppPath()}/buid/icon.png`);
    
    if (app.dock){
        app.dock.setIcon(icon);
    }
   
   
    //CRIA JANELA DE DESKTOP
    const win = new BrowserWindow({
        icon,
        width: 600,
        height: 600,
        resizable:false,
        webPreferences: {
            //HABILITA A INTEGRAÇÃO DO NODE.JS NO FRONTEND
            nodeIntegration: false,
        },
        autoHideMenuBar: true,
        frame: true,
        backgroundColor: "black"
    });
    
    //CARREGA A JANELA COM CONTEÚDO DENTRO DE INDEX.HTML
    win.loadFile("index.html");
}

    //RECEBER MENSAGEM DO RENDERER PARA MOSTAR O DIÁLOGO
    ipcMain.on('show-error-dialog', (event, message) => {
        dialog.showErrorBox('Error', message)
    })
    //MÉTODO VAI SER CHAMADO ASSIM QUE ELECTRON FINALIZAR SUA INICIALIZAÇÃO
    //E ESTIVER PRONTO PARA ABRIR E MANIPULAR O NOSSO CÓDIGO
    //ALGUNS APIS PODEM SER USADAS SOMENTE DEPOIS QUE ESTE EVENTO OCORRE

    app.whenReady().then(createWindow);

    //QUANDO CLICARMOS NO BOTÃO DE FECHAR A JANELA NO APP DESKTOP
    //O EVENTO VAI SER OUVIDO AQUI NO ARQUIVO MAIN.JS ALGUM PROCEDIMENTO PODE SER REALIZADO
    //TIPO FECHAR ALGUMA CONEXÃO DE BANCO DE DADOS POR EXEMPLO
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin"){
            app.quit();
        }
    });

    app.on("activate", () => {
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow();
        }
    })

