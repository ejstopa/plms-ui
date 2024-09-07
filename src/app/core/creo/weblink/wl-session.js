import { isProEEmbeddedBrowser, pfcCreate } from "./wl-utilities";


export function getCreoSession() {

    if (!isProEEmbeddedBrowser()) {
        return null;
    }

    try {
        let sessionHandler = pfcCreate("MpfcSession");
        let session = sessionHandler.GetCurrentSessionWithCompatibility("CCreoCompatibility_nil");

        return session;
    }
    catch (error) {
        return null
    }
}

export function setWorkingDirectory(creoSession, directory){
    creoSession.ChangeDirectory(directory);
}

export function setConfigOption(creoSession, name, value){
    creoSession.SetConfigOption(name, value); 
}

export function listDirectoryFiles(creoSession, filter, path){
    const filesSeq = creoSession.ListFiles(filter, "FILE_LIST_LATEST", path);
    let files = [];

    for (let index = 0; index < filesSeq.Count; index++) {
        files.push(filesSeq.Item(index));
    }

    return files;
}

export function openFile(creoSession, filePath){
    let modelDescriptorHandler = pfcCreate("pfcModelDescriptor");
    let modelDescriptor = modelDescriptorHandler.CreateFromFileName(filePath);
    
    let model = creoSession.RetrieveModel(modelDescriptor);
    let window = creoSession.CreateModelWindow(model);

    model.Display();
    window.Activate();
}

export function closeFile(creoSession, filePath){
    let modelDescriptorHandler = pfcCreate("pfcModelDescriptor");
    let modelDescriptor = modelDescriptorHandler.CreateFromFileName(filePath);
    
    let model = creoSession.GetModelFromDescr(modelDescriptor);

    if (model == null){
        return;
    }

    let modelWindow = creoSession.GetModelWindow(model);
    modelWindow.Close();
}

export function startNewFileWindow(creoSession, newFileName){
    let command = "~ Command `ProCmdModelNew` ;";

    if (newFileName != null){
        const fileCommonName = `${newFileName.substring(0,4)}.${newFileName.substring(4)}`;
        command = `${command} 
        ~ Update \`new\` \`InputPanel1\` \`${newFileName}\`; 
        ~ Update \`new\` \`InputPanel2\` \`${fileCommonName}\`; `
    }

    creoSession.RunMacro(command);
}


// creoSession.RunMacro(
//     "@SYSTEM\\n\\@echo off\\n\\nstart \
//     C:/Users/ejsto/Desktop/Programacao/creo-customization/VpApiCs/bin/Debug/net8.0-windows/VpApiCs.exe\\n\\nexit;");