import {Set_current_diagram} from "./DMN-JS";
import {DMN} from "./Dmn_diagramme";
import {Erreur} from "./DMN_Erreur";

export class Dmn_file  {//lecture des  Fichiers
    static File_reader = new FileReader();
    static isJson: boolean;// Vrai si le fichier est un fichier JSON
    static Viewer: any;// Viewer
    static DMN: DMN;// Diagramme DMN
    static initFileReader = (): void => {// Active le chargement de fichier
        Dmn_file.File_reader.onload = Dmn_file.handleFileReaderLoad;
    };

    static handleFileReaderLoad = (progress_event: ProgressEvent<FileReader>) => {// Gère le chargement de fichier
        if(Dmn_file.isJson){
            Dmn_file.DMN.evaluation(Dmn_file.File_reader.result as string);// Evaluation du fichier JSON
        }else{
            Set_current_diagram({// Le diagramme courant est placé dans l'historique du navigateur :
                file_content: Dmn_file.File_reader.result as string,
                file_name: window.history.state.diagram.file_name
            });
            window.document.body.dispatchEvent(new CustomEvent('File_reload'));
        }
    };
    static checkFileType(fileName:string){// Vérifie le type de fichier
        const fileParts = fileName.split('.');
        const fileExtension = fileParts[fileParts.length - 1].toLowerCase();
        Dmn_file.isJson = fileExtension === 'json';
    }
}