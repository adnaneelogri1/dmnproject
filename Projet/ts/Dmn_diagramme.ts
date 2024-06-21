import DmnModdle from "dmn-moddle";
import { migrateDiagram } from '@bpmn-io/dmn-migrate';
const { Interpreter, DMNConverter } = require("imicros-feel-interpreter");
import Swal from 'sweetalert2';
import { Erreur } from "./DMN_Erreur";
import {DMN_Definitions, is_DMN_Definitions} from "./DMN-JS";
export class DMN  {// Diagramme DMN
    private readonly _interpreter = new Interpreter();// Interpreter
    private readonly _diagram: Promise<DMN_Definitions | undefined>;// Diagramme
    private  _XML: Promise<string>;// XML du diagramme
    private  _Json: string | undefined;// Json de l'evaluation
    private _expression: string | undefined ;


    private async _getXML(): Promise<DMN_Definitions | undefined> {// Récupère le diagramme DMN
        try {
            this._XML = await  migrateDiagram(await this._XML);// Mise à jour du diagramme DMN pour le rendre compatible avec le viewer
            const {
                rootElement: diagram,
                warnings: warnings
            } = await new DmnModdle().fromXML(await this.XML);
            if (!is_DMN_Definitions(diagram)) {
                throw new Erreur("Le diagramme n'est pas une instance de DMN_Definitions.");
            }
            if (warnings.length !== 0) {
                throw new Erreur("Le nombre d'avertissements n'est pas égal à zéro, ce qui n'est pas attendu.");            }
            return Promise.resolve(diagram);
        } catch (error: unknown) {
            throw new Erreur("Impossible de traiter le fichier XML DMN.");
            return Promise.resolve(undefined);
        }
    }


    private async _viewDMN(): Promise<undefined | void> {// Affiche le diagramme DMN
        const diagram = await this._diagram;
        try {
            if (!diagram)
                throw new Erreur("Le contenu n'est pas du DMN.");
            const { warnings } = await this._DmnViewer.importXML(await this.XML);
            this._DmnViewer
                .getActiveViewer()
                .get('canvas')
                .zoom('fit-viewport');
        } catch (error) {
            throw new Erreur('Erreur lors du rendu : ' + error);
        }
    }
    constructor(readonly fichier_dmn: string, private readonly _DmnViewer: any) {
        this._XML = Promise.resolve(fichier_dmn);
        this._diagram = this._getXML();
        this._viewDMN();
    }
    get XML() {
        return this._XML;
    }
    set XML(XML: Promise<string>) {
        this._XML = XML;
    }


     async evaluation( source: string) {// Evaluation du diagramme DMN

         try {
             this._expression = new DMNConverter().convert({ xml: this.XML });
             let successs = this._interpreter.parse(this._expression);
             if (!successs)
                 if (!successs) throw new Erreur("Erreur lors de l'analyse de l'expression");
             this._Json = JSON.parse(source);
            if (Array.isArray(this._Json)) {
                for (const obj of this._Json) { // Evaluation du diagramme DMN
                    this.evaluation_affichage(obj);
                    await new Promise(resolve => setTimeout(resolve, 4000));
                }
            } else {
                this.evaluation_affichage(this._Json);
            }


        }catch (error ) {
             new Erreur(error as string);
        }

    }
     evaluation_affichage( json:any) {// Evaluation du diagramme DMN
            let result = this._interpreter.evaluate(this._expression, json );
            //if (result === undefined) throw new Erreur("error evaluating");
            let affiche: string ="" ;
            for (const key in result) {
                if (result.hasOwnProperty(key)) {
                    const value = result[key];
                    if (value == undefined && value !== null)
                        if (value == undefined && value !== null)
                            throw new Erreur(`${key} est undefined, voici vos données ${JSON.stringify(json)}`);
                    affiche=affiche+` <span style="font-weight:bold;"> ${key}</span> :  ${value} <br> `;
                }
            }
            console.log(affiche);
            const Toast = Swal.mixin({
                showConfirmButton: true,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: "Result",
                html: affiche,
            });



    }

}