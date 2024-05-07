const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')

const shortUrl = require('./models/shortUrl');
const app = express();

app.use(bodyParser.json())
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }))

mongoose.connect("mongodb://localhost:27017/urlShortener")

const db = mongoose.connection

db.on('error', (err) => {
    console.log(err, "error in connection to the database");
});

db.once('open', () => {
    console.log("connected to the database");
});

app.get('/', async (req, res) => {
    const shortUrls = await shortUrl.find()
    res.render('../views/index', { shortUrls: shortUrls })
})
app.post('/shorturl', async (req, res) => {
    const short = await shortUrl.create({ full: req.body.fullUrl })

    res.json(short).status(200)
})

app.get('/:shorturl', async (req, res) => {
    const Link = await shortUrl.findOne({ short: req.params.shorturl });
    if (Link == null) return res.sendStatus(404)

    await Link.save()

    res.redirect(Link.full)

})
const port = 8801;
app.listen(port, () => {
    console.log("App running on port ", port);
})