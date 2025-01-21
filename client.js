import axios from 'axios';
import inquirer from 'inquirer';

const menù = [
    {
        type: 'list',
        name: 'menù',
        message: 'Cosa vuoi fare?',
        choices: ['Inserisci snack', 'visuallizza snack dal nome', 'visuallizza snack dalla categoria','visuallizza snack dalle calorie', 'Esci']
    }
];

const domandeInserimento = [
    {
        type: 'input',
        name: 'nome',
        message: 'Nome snack:',
        validate: (value) => {
            if (value.length > 0) {
                return true;
            } else {
                return 'Inserisci un nome!';
            }
        }
    },

    {
        type: 'input',
        name: 'categoria',
        message: 'Categoria snack:',
        validate: (value) => {
            if (value.length > 0) {
                return true;
            } else {
                return 'Inserisci una categoria!';
            }
        }
    },

    {
        type: 'number',
        name: 'prezzo',
        message: 'Prezzo snack:',
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
        name: 'peso',
        message: 'peso snack:',
        validate: (value) => {
            if (value >= 0) {
                return true;
            } else {
                return 'Inserisci un peso non negativa!';
            }
        }
    },
    {
        type: 'number',
        name: 'calorie',
        message: 'calorie per 100 grammi snack:',
        validate: (value) => {
            if (value >= 0) {
                return true;
            } else {
                return 'Inserisci quantità calorie non negativa!';
            }
        }
    }
];

function main() {
    inquirer.prompt(menù).then((answers) => {
        switch(answers.menù) {
            case 'Inserisci snack':
                inquirer.prompt(domandeInserimento).then((answers) => {
                    axios.put('http://localhost:3000/snack', {
                        nome: answers.nome,
                        categoria: answers.categoria,
                        prezzo: answers.prezzo,
                        peso: answers.peso,
                        calorie: answers.calorie
                    }).then((response) => {
                        console.log(response.data);
                    }).catch((err) => {
                        console.log(err.response.data);
                    });
                });
                break;
            case 'visuallizza snack dal nome':
                inquirer.prompt({
                    type: 'input',
                    name: 'nome',
                    message: 'Nome snack:'
                }).then((answers) => {
                    axios.get(`http://localhost:3000/snack/${answers.nome}`).then((response) => {
                        console.log(response.data);
                    }).catch((err) => {
                        console.log(err.response.data);
                    });
                });
                break;
            case 'visuallizza snack dalla categoria':
                inquirer.prompt({
                    type: 'input',
                    name: 'categoria',
                    message: 'Categoria snack:'
                }).then((answers) => {
                    axios.get(`http://localhost:3000/cat/${answers.categoria}`).then((response) => {
                        console.log(response.data);
                    }).catch((err) => {
                        console.log(err.response.data);
                    });
                });
                break;
            case 'visuallizza snack dalle calorie':
                inquirer.prompt({
                    type: 'number',
                    name: 'calorie',
                    message: 'Calorie snack:'
                }).then((answers) => {
                    axios.get(`http://localhost:3000/cal/${answers.calorie}`).then((response) => {
                        console.log(response.data);
                    }).catch((err) => {
                        console.log(err.response.data);
                    });
                });
            case 'Esci':
                console.log("Bye!");
                return;
        }
    });
}


main();