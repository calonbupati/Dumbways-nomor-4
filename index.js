const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'music-app'
});

connection.connect(function (err) {
    if (err) throw err;
});

app.use(bodyParser.json())


app.get('/genres', (req, res) => {
    let query = 'SELECT * FROM genres'
    if (req.query.search) {
        query = query + ' WHERE name LIKE ?'
    }
    connection.query(query, ['%' + req.query.search + '%'],
        function (error, results, fields) {
            if (error) throw error;

            res.send(results)
        });
})

app.get('/genres/:id', (req, res) => {
    let query = 'SELECT * FROM genres WHERE id = ?'
    connection.query(query, [req.params.id],
        function (error, results, fields) {
            if (error) throw error

            res.send(results)
        }
    );
})

app.post('/genres', (req, res) => {
    connection.query(
        'INSERT INTO genres (name) VALUES (?)',
        [req.body.name],
        function (error, results, fields) {
            if (error) throw error;

            res.send(results)
        }
    );
})

app.put('/genres/:id', (req, res) => {
    connection.query(
        'UPDATE genres SET name = ? WHERE id = ?',
        [req.body.title, req.params.id],
        function (error, results, fields) {
            if (error) throw error;

            res.send(results)
        }
    );
})
app.delete('/genres/:id', (req, res) => {
    connection.query(
        'DELETE FROM genres WHERE id = ?',
        [req.params.id],
        function (error, results, fields) {
            if (error) throw error;

            res.send(results)
        }
    );
})


app.get('/singers', (req, res) => {
    let query = 'SELECT * FROM singers'
    if (req.query.search) {
        query = query + ' WHERE name LIKE ?'
    }
    connection.query(query, ['%' + req.query.search + '%'],
        function (error, results, fields) {
            if (error) throw error;

            res.send(results)
        });
})

app.get('/singers/:id', (req, res) => {
    let query = 'SELECT * FROM singers WHERE id = ?'
    connection.query(query, [req.params.id],
        function (error, results, fields) {
            if (error) throw error

            res.send(results)
        }
    );
})

app.post('/singers', (req, res) => {
    connection.query(
        'INSERT INTO singers (name) VALUES (?)',
        [req.body.name],
        function (error, results, fields) {
            if (error) throw error;

            res.send(results)
        }
    );
})

app.put('/singers/:id', (req, res) => {
    connection.query(
        'UPDATE singers SET name = ? WHERE id = ?',
        [req.body.name, req.params.id],
        function (error, results, fields) {
            if (error) throw error;

            res.send(results)
        }
    );
})
app.delete('/singers/:id', (req, res) => {
    connection.query(
        'DELETE FROM singers WHERE id = ?',
        [req.params.id],
        function (error, results, fields) {
            if (error) throw error;

            res.send(results)
        }
    );
})

app.get('/music', (req, res) => {
    let query = 
    `SELECT music.*, genres.name as genre_name, singers.name as singer_name
    FROM music
    JOIN genres ON music.id_genre = genres.id
    JOIN singers ON singers.id = music.id_singer`

    connection.query(query,
        function (error, results, fields) {
            if (error) throw error;

            res.send(results)
        });
})

app.get('/music/:id', (req, res) => {
    let query = 'SELECT * FROM music WHERE id = ?'
    connection.query(query, [req.params.id],
        function (error, results, fields) {
            if (error) throw error

            connection.query(
                `SELECT singers.*
                FROM singers
                JOIN music ON music.id_singer = singers.id
                WHERE music.id = 1`,
                [req.params.id],
                function (errorSingers, resultsSingers) {
                    if (errorSingers) throw errorSingers;

                    connection.query(
                        `SELECT genres.*
                    FROM genres
                    JOIN music ON music.id_genre = genres.id
                    WHERE music.id = ?`,
                        [req.params.id],
                        function (errorGenres, resultsGenres) {
                            if (errorGenres) throw errorGenres;

                            const response = {
                                title: results[0].title,
                                duration: results[0].duration,
                                genres: resultsGenres,
                                singers: resultsSingers,
                                photo: results[0].photo,
                                description: results[0].description,
                            }
                            res.send(response)
                        });
                })
        })
})


app.post('/music', (req, res) => {
    connection.query(
        'INSERT INTO music (title, duration, photo, description, id_genre, id_singer) VALUES (?, ?, ?, ?, ?, ?)',
        [req.body.title, req.body.duration, req.body.photo, req.body.description, req.body.id_genre, req.body.id_singer],
        function (error, results, fields) {
            if (error) throw error;

            res.send(results)
        }
    );
})

app.put('/music/:id', (req, res) => {
    connection.query(
        'UPDATE music SET title = ?, duration = ?, photo = ?, description = ?, id_genre = ?, id_singer = ?  WHERE id = ?',
        [req.body.title, req.body.duration, req.body.photo, req.body.description, req.body.id_genre, req.body.id_singer, req.params.id],
        function (error, results, fields) {
            if (error) throw error;

            res.send(results)
        }
    );
})
app.delete('/music/:id', (req, res) => {
    connection.query(
        'DELETE FROM music WHERE id = ?',
        [req.params.id],
        function (error, results, fields) {
            if (error) throw error;

            res.send(results)
        }
    );
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})