import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();

app.use(express.json());

app.put("/snack", (req, res) => {
    const db = new sqlite3.Database("snack.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    function calorie_grammo(peso, calorie) {
        return peso * calorie / 100;
    }

    const calorie_totali = calorie_grammo(req.body.peso, req.body.calorie);

    const stmt = db.prepare("INSERT INTO Snack (nome, categoria, prezzo, peso, calorie) VALUES (?,?,?,?,?);");

    // Gestiamo l'evento error dello statement
    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        }
    )});

    // Eseguiamo la query con stmt.run
    const prodotto = req.body;

    stmt.run(prodotto.nome.toLowerCase(), prodotto.categoria.toLowerCase(), prodotto.prezzo, prodotto.peso, calorie_totali, (err) => {

        if (err) {
            console.error("Errore Run:", err.message);
            res.status(500).send(err.message);
        }
        else {
            res.send("snack inserito correttamente");
        }
    });
});


app.get("/snack/:nome", (req, res) => {

    const db = new sqlite3.Database("snack.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    const stmt = db.prepare("SELECT * FROM Snack WHERE nome = ?;");

    // Gestiamo l'evento error dello statement
    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

    // Eseguiamo la query con stmt.all
    stmt.all(req.params.nome, (err, rows) => {
        if (err) {
            console.error("Errore Query:", err.message);
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }

        // Chiudiamo statement e database dopo aver inviato la risposta
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

});


app.get("/cat/:categoria", (req, res) => {
    const db = new sqlite3.Database("snack.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    // Query parametrizzata per evitare SQL Injection
    const query = "SELECT * FROM Snack WHERE categoria = ?";

    // Eseguiamo la query direttamente con db.all
    db.all(query, [req.params.categoria], (err, rows) => {
        // Chiudiamo il database prima di inviare la risposta
        db.close((errClose) => {
            if (errClose) console.error("Errore chiusura DB:", errClose.message);
        });

        if (err) {
            console.error("Errore Query:", err.message);
            return res.status(500).send(err.message);
        }

        // Invia i risultati
        res.json(rows);
    });
});



    app.get("/cal/:calorie", (req, res) => {

        const db = new sqlite3.Database("snack.db", (err) => {
            if (err) {
                console.error("Errore apertura DB:", err.message);
                return res.status(500).send(err.message);
            }
        });

        let stmt = db.prepare("SELECT * FROM Snack WHERE calorie <= ?;");

        // Gestiamo l'evento error dello statement

        stmt.on("error", (error) => {
            console.error("Errore Statement:", error.message);
            res.status(500).send(error.message);
            stmt.finalize((errFinalize) => {
                if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
            });
            db.close((errClose) => {
                if (errClose) console.error("Errore Close:", errClose.message);
            });
        })
        stmt.all(req.params.calorie, (err, rows) => {
            // Chiudiamo il database prima di inviare la risposta
            db.close((errClose) => {
                if (errClose) console.error("Errore chiusura DB:", errClose.message);
            });
    
            if (err) {
                console.error("Errore Query:", err.message);
                return res.status(500).send(err.message);
            }
    
            // Invia i risultati
            res.json(rows);
        })
});

const db = new sqlite3.Database("snack.db", (err) => {
    if (err) {
        console.error("Errore apertura DB:", err.message);
        return;
    }
    db.run('CREATE TABLE IF NOT EXISTS "Snack" (    \
        "nome"    TEXT NOT NULL, \
        "categoria"   TEXT NOT NULL, \
        "prezzo"    NUMERIC NOT NULL CHECK(prezzo >= 0), \
        "peso"    INTEGER NOT NULL CHECK(peso > 0), \
        "calorie"    INTEGER NOT NULL CHECK(calorie > 0), \
        PRIMARY KEY("nome"))');

});



app.listen(3000, () => {
    console.log("Server in ascolto sulla porta 3000");
});


