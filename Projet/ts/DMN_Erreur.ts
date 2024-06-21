import Swal from 'sweetalert2';

export class Erreur extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'Erreur';
        this.showError();


    }

    showError() {// Affiche l'erreur
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: this.message,
        });
    }
}