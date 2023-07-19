const express = require('express')
const app = express()
const path = require('path')
const port = 3000
const uuid = require('uuid');


app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

let playlist = [{
        id: 1,
        title: "someone like you",
        artist: 'John',
        url: 'https://spotify.com/album/someone-like-you',
        repeats: 10,
        isPlaying: true

    },
    {
        id: 2,
        title: "I am yours",
        artist: 'Bruno Mars',
        url: 'https://spotify.com/album/i-am-yours',
        repeats: 1000,
        isPlaying: false
    }
]

// buat nerima body json
// app.use(express.json())

app.get('/', (req, res) => {
    const playedSong = playlist.find(song => song.isPlaying === true)
    res.status(200).render('index', { playlist, playedSong });
})

app.get("/add-song", (req, res) => {
    res.render("add_song.ejs");
});

app.post('/add-song', (req, res) => {
    const id = uuid.v4();
    const title = req.body.title;
    const artist = req.body.artist;
    const url = req.body.url;

    const newSong = {
        id: id,
        title: title,
        artist: artist,
        url: url,
        repeats: 0
    }

    playlist.push(newSong);

    res.status(200)
    res.redirect('/');
})

app.put('/playing/:song', function(req, res) {
    const lastPlayedIdx = playlist.findIndex(song => song.isPlaying === true)
    playlist[lastPlayedIdx].isPlaying = false;

    const nowPlayedIdx = playlist.findIndex(song => song.title === req.params.song)
    playlist[nowPlayedIdx].isPlaying = true;

    res.status(200)
    res.redirect('/');
});

//most played song
app.get('/most-played', (req, res) => {

    const repeats = playlist.map(song => {
        return song.repeats;
    });

    const maxRepeat = Math.max(...repeats);

    const mostRepeatsSong = playlist.find(song => song.repeats === maxRepeat);


    // playlist.filter((song) => {
    //     return song.title.includes(req.query.title) || song.artist.includes(req.query.artist);
    // })

    // res.setHeader('Content-Type', 'application/json');
    res.send(mostRepeatsSong);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})