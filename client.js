import axios from 'axios';
import inquirer from 'inquirer';

const menù = [
    {
        type: 'list',
        name: 'menù',
        message: 'Cosa vuoi fare?',
        choices: ['Visualizza prodotti', 'Inserisci prodotto', 'Esci']
    }
];

const domandeInserimento = [
    {
        type: 'input',
        name: 'nome',
        message: 'Nome prodotto:',
        validate: (value) => {
            if (value.length > 0) {
                return true;
            } else {
                return 'Inserisci un nome!';
            }
        }
    },
    {
        type: 'number',
        name: 'prezzo',
        message: 'Prezzo prodotto:',
        validate: (value) => {
            if (value >= 0) {
                return true;
            } else {
                return 'Inserisci un prezzo non negativo!';
            }
        }
    },
    {
        type: 'number',
        name: 'quantità',
        message: 'Quantità prodotto:',
        validate: (value) => {
            if (value >= 0) {
                return true;
            } else {
                return 'Inserisci una quantità non negativa!';
            }
        }
    }
];

function main() {
    inquirer.prompt(menù).then((answers) => {
        switch(answers.menù) {
            case 'Visualizza prodotti':
                axios.get('http://localhost:3000/api/prodotti').then((response) => {
                    console.log(response.data);
                });
                break;
            case 'Inserisci prodotto':
                inquirer.prompt(domandeInserimento).then((answers) => {
                    axios.post('http://localhost:3000/api/prodotto', {
                        nome: answers.nome,
                        prezzo: answers.prezzo,
                        quantità: answers.quantità
                    }).then((response) => {
                        console.log(response.data);        
                    }).catch((err) => {
                        console.log(err.response.data);
                    });
                });
                break;
            case 'Esci':
                console.log("Bye!");
                return;
        }
    });
}


main();