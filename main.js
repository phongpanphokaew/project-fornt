const moment = require('moment');
const express = require('express');
const axios = require('axios');

const app = express();
var bodyParser = require('body-parser');

// const base_url = "http://localhost:3000/api";
const base_url = "http://node59699-back-end.proen.app.ruk-com.cloud/api";
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

// index // all album *************************************************************


app.get("/", async (req, res) => {
    try {
        const [resPhotos, resAlbums, resLocats, resPtgs] = await Promise.all([
            axios.get(base_url + '/photos'),
            axios.get(base_url + '/albums'),
        ]);

        res.render("index", { 
            moment: moment,
            photos: resPhotos.data,
            albums: resAlbums.data,

         });


    } catch (error) {
        console.log(error);
        res.status(500).render('error',
            {
                message: `${error}`
            }
            )
    }
})



app.post('/albums/create', async (req, res) => {
    // console.log(req.body);
    try {
        
        const data = { 
            // AlbumID: req.body.AlbumID,
            AlbumName: req.body.AlbumName || "Anonymous",
            Description: req.body.Description || "-",
        }
        await axios.post(base_url + '/albums', data);
        // console.log(data,"<<<<");
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

app.post('/albums/edit/:id', async (req, res) => {
    // console.log(req.body);
    try {
        
        const data = { 
            AlbumName: req.body.AlbumName || "Anonymous",
            Description: req.body.Description || "-",
        }
        await axios.put(base_url + `/albums/${req.params.id}`, data);
        
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send('error ');
    }
});

app.post('/albums/delete/:id', async (req, res) => {
    try {
        // console.log(base_url + `/photos/${req.params.id}`);
        await axios.delete(base_url + `/albums/${req.params.id}`);
       
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.render("error",
        {
            message: error,
        }
        )
    }
});



//photo **************------------------------------------***********************
app.get("/album/:id", async (req, res) => {
    try {
  
        const albumId = parseInt(req.params.id, 10);
        
        const [resPhotos, resAlbums, resLocats, resPtgs] = await Promise.all([
            axios.get(base_url + '/photos'),
            axios.get(base_url + '/albums'),
            axios.get(base_url + '/locations'),
            axios.get(base_url + '/photographers'),
        ]);

        res.render("photo", { 
            moment: moment,
            albumId: albumId,
            photos: resPhotos.data,
            albums: resAlbums.data,
            locations: resLocats.data,
            photographers: resPtgs.data,
         });
        // res.render("album");
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
});

app.post('/photo/create', async (req, res) => {
    // console.log(req.body);
    try {
        
        const data = { 
            AlbumID: req.body.AlbumID,
            PhotographerID: req.body.PhotographerID,
            LocationID: req.body.LocationID,
            PhotoPath: req.body.PhotoPath,
            Caption: req.body.Caption || "Anonymous",
        }
        await axios.post(base_url + '/photos', data);
        // console.log(data,"<<<<");
        res.redirect('/album/'+ req.body.currentAlbumId);
    } catch (error) {
        console.log(error);
        res.status(500).send('error can not post photo');
    }
});

app.post('/photo/edit/:id', async (req, res) => {
    // console.log(req.body);
    try {
        
        const data = { 
            AlbumID: req.body.AlbumID,
            PhotographerID: req.body.PhotographerID,
            LocationID: req.body.LocationID,
            PhotoPath: req.body.PhotoPath,
            Caption: req.body.Caption || "Anonymous",
        }
        await axios.put(base_url + `/photos/${req.params.id}`, data);
        
        res.redirect('/album/'+ req.body.currentAlbumId);
    } catch (error) {
        console.log(error);
        res.status(500).send('error can not post location');
    }
});

app.post('/photo/delete/:id', async (req, res) => {
    try {
        // console.log(base_url + `/photos/${req.params.id}`);
        await axios.delete(base_url + `/photos/${req.params.id}`);
       
        res.redirect('/album/'+ req.body.currentAlbumId);
    } catch (error) {
        console.log(error);
        res.render("error",
        {
            message: `ID: ${req.params.id} ถูกใช้งานอยู่ไม่สามารถลบได้`
        }
        )
    }
});




// location ************************************************************
app.get("/locations", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/locations');
        res.render("location", { 
            locations: response.data,
            moment: moment,
         });
        // res.render("album");
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
})

app.post('/locations/create', async (req, res) => {
    // console.log(req.body);
    try {
        
        const data = { 
            LocationName: req.body.LocationName,
            Description: req.body.Description
        }
        await axios.post(base_url + '/locations', data);
        res.redirect('/locations');
    } catch (error) {
        console.log(error);
        res.status(500).send('error can not post location');
    }
});


app.post('/locations/edit/:id', async (req, res) => {
    try {
        const data = { 
            LocationName: req.body.LocationName,
            Description: req.body.Description
        }
        await axios.put(base_url + `/locations/${req.params.id}`, data);
        res.redirect('/locations');
    } catch (error) {
        console.log(error);
        res.status(500).send('error can not post location');
    }
});

app.post('/locations/delete/:id', async (req, res) => {
    try {
        // console.log(base_url + `/locations/${req.params.id}`);
        await axios.delete(base_url + `/locations/${req.params.id}`);
        res.redirect('/locations');
    } catch (error) {
        console.log(error);
        res.render("error",
        {
            message: `ID: ${req.params.id} ถูกใช้งานอยู่ไม่สามารถลบได้`
        }
        )
    }
});



// photographer **********************************************************************
app.get("/photographers", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/photographers');
        res.render("photographer", { 
            photographers: response.data,
            moment: moment,
         });
        // res.render("album");
    } catch (error) {
        console.log(error);
        res.status(500).send('Error');
    }
})

app.post('/photographers/create', async (req, res) => {
    // console.log(req.body);
    try {
        
        const data = { 
            Name: req.body.photographerName,
            Bio: req.body.Bio
        }
        await axios.post(base_url + '/photographers', data);
        res.redirect('/photographers');
    } catch (error) {
        console.log(error);
        res.status(500).send('error can not post location');
    }
});


app.post('/photographers/edit/:id', async (req, res) => {
    try {
        const data = { 
            Name: req.body.photographerName,
            Bio: req.body.Bio
        }
        await axios.put(base_url + `/photographers/${req.params.id}`, data);
        res.redirect('/photographers');
    } catch (error) {
        console.log(error);
        res.status(500).send('error can not post location');
    }
});

app.post('/photographers/delete/:id', async (req, res) => {
    try {
        // console.log(base_url + `/photographers/${req.params.id}`);
        await axios.delete(base_url + `/photographers/${req.params.id}`);
        res.redirect('/photographers');
    } catch (error) {
        console.log(error);
        res.render("error",
        {
            message: `ID: ${req.params.id} ถูกใช้งานอยู่ไม่สามารถลบได้`
        }
        )
    }
});



app.listen(5500, () => {
    console.log(`server started on http://localhost:5500`);
})