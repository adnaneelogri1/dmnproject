// Code: TypeScript
import DmnJS from "dmn-js";
import {Set_current_diagram} from "./DMN-JS";
import {DMN} from "./Dmn_diagramme";
import {Dmn_file} from "./DMN_file";


let lastTarget: EventTarget | null = null;

function isFile(evt: DragEvent): boolean {
    const dt = evt.dataTransfer;

    if (dt) {
        for (let i = 0; i < dt.types.length; i++) {
            if (dt.types[i] === "Files") {
                return true;
            }
        }
    }
    return false;
}

window.addEventListener("dragenter", function (e: DragEvent) {
    if (isFile(e)) {
        lastTarget = e.target;
        const dropzone = document.querySelector("#dropzone")as HTMLElement;
        const textnode = document.querySelector("#textnode")as HTMLElement;
        if (dropzone && textnode) {
            dropzone.style.visibility = "";
            dropzone.style.opacity = '1';
            textnode.style.fontSize = "48px";
        }
    }
});

window.addEventListener("dragleave", function (e: DragEvent) {
    e.preventDefault();
    if (e.target === lastTarget || e.target === document) {
        const dropzone = document.querySelector("#dropzone")as HTMLElement;
        const textnode = document.querySelector("#textnode")as HTMLElement;
        if (dropzone && textnode) {
            dropzone.style.visibility = "hidden";
            dropzone.style.opacity = '0';
            textnode.style.fontSize = "42px";
        }
    }
});

window.addEventListener("dragover", function (e: DragEvent) {
    e.preventDefault();
});

window.addEventListener("drop", function (e: DragEvent) {
    e.preventDefault();
    const dropzone = document.querySelector("#dropzone")as HTMLElement;
    const textnode = document.querySelector("#textnode")as HTMLElement;
    const text = document.querySelector("#text");
    if (dropzone && textnode && text) {
        dropzone.style.visibility = "hidden";
        dropzone.style.opacity = '0';
        textnode.style.fontSize = "42px";
        if(e.dataTransfer && e.dataTransfer.files.length == 1) {
            text.innerHTML = "<b>File selected:</b><br>" + e.dataTransfer.files[0].name;
        }
    }
    const droppedFiles = e.dataTransfer!.files;
    if (droppedFiles) {
        Dmn_file.checkFileType(droppedFiles[0].name)
        if(Dmn_file.isJson) {
            Dmn_file.File_reader.readAsText(droppedFiles![0]);
        }else {
            Set_current_diagram({file_name: droppedFiles[0].name});
            Dmn_file.File_reader.readAsText(droppedFiles![0]);
        }
    }
});
window.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const uploadButton = document.getElementById('uploadButton');
    Dmn_file.Viewer = new DmnJS({
        container: document.getElementById("canvas")
    });
    window.document.body.addEventListener("File_reload", () => {
        Dmn_file.DMN= new DMN(window.history.state.diagram.file_content, Dmn_file.Viewer);
    });
    uploadButton?.addEventListener('click', () => {
        fileInput.click();
    });
    Dmn_file.initFileReader();
    fileInput.addEventListener('change', (event) => {
        if (fileInput.files && fileInput.files.length > 0) {

            Dmn_file.checkFileType(fileInput.files[0].name)
            if(Dmn_file.isJson) {
                Dmn_file.File_reader.readAsText((event.target as HTMLInputElement).files![0]);

            }else {
                Set_current_diagram({file_name: (event.target as HTMLInputElement).files![0].name});
                Dmn_file.File_reader.readAsText((event.target as HTMLInputElement).files![0]);
            }

        }
    });
});



