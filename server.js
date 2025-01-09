import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();

app.use(express.json());

app.put("/Snack", (req, res) => {
    const db = new sqlite3.Database("snack.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

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

    const prodotto = req.body;

    stmt.run(prodotto.nome, prodotto.categoria, prodotto.prezzo, prodotto.peso, prodotto.calorie, (err) => {

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
    stmt.all((err, rows) => {
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

    let stmt = db.prepare("SELECT * FROM Snack WHERE categoria = ?;");

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
    stmt.all(req.params.categoria, (err, rows) => {
        if (err) {
            console.error("Errore Query:", err.message);
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });


        // Chiudiamo statement e database dopo aver inviato la risposta
        stmt.finalize((errFinalize) => {
            if (errFinalize) console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });


    app.get("/Snack/:calorie", (req, res) => {

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
        }
    );
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
