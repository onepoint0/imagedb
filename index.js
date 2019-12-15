const path = require('path');
const express = require('express');
const app = express();

const Image = require('./models/image');

const fs = require('fs');
const multer = require('multer'); 
var upload = multer();

// multer storage
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({ storage: storage })

app.set('view engine', 'pug');
app.set('views','./views');

// get request with file upload 
app.get('/', async (req, res) => {
  let name = 'clare';
  Image.find({}, function(err, imgs) { 
    let imgToShow = Object.keys(imgs).length;
    if ( imgToShow > 0 ) {
      console.log(imgs); 
      res.render('index'
          ,{  name: name, 
              src: imgs[imgToShow-1].img.data.toString('base64'),
              mimetype: imgs[imgToShow-1].img.contentType
          });
//      res.contentType('image/png'); res.send(imgs[1].img.data, "binary")
    } else {
      res.render('index',{ name: name }); 

    }
  });

});

app.post('/', upload.array('image',1), (req, res) => {
//  app.post('/', upload.single('image'), (req, res) => { // <-- can use upload.single but if you want to get info out of the body of the form then must use array
// console.log('body',  req.body); console.log('file',  req.files);

  if (req.files[0]) {
    var img = fs.readFileSync(req.files[0].path);
    var encode_image = img.toString('base64');
    
    var finalImg = {
        name: req.files[0].originalname,
        contentType: req.files[0].mimetype,
        image:  new Buffer(encode_image, 'base64')
    };
  } else {
    finalImg = '';
  }
  createImage( finalImg )

res.send('done - refresh page to see upload'); 

})

function createImage( target_file ) {
  return new Promise(( resolve, reject ) => {
    try {
      const image = new Image();
      if (target_file) {
        image.name = target_file.name;
        image.img.data = target_file.image;
        image.img.contentType = target_file.contentType;
      }

      let result = image.save();
      console.log(result);

      resolve(target_file);

    } catch(err) {
      console.error('Error creating image', err);
      reject(err);
    }
  });

};



// db stuff
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/imagedb')
  .then( () => console.log('Connected to Image DB') )
  .catch(err => console.error('Could not connect to Image DB',err));

app.listen(3000, () => console.log('listening on port 3000'));