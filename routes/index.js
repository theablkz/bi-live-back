var express = require('express');
var router = express.Router();
const path = require('path');
const multer  = require('multer')


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads-image/')
  },
  filename: (req, file, cb) => {
    cb(null, `${+Date.now()}-${file.originalname}`)
  }
})
// const storageBuklet = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads-buklet/')
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${+Date.now()}-${file.originalname}`)
//   }
// })
const upload = multer({storage})
// const uploadBuklet = multer({storage})


const sqlite3 = require('sqlite3').verbose();

const tableName = 'example'

/* GET home page. */
router.get('/', function(req, res, next) {
  let db = new sqlite3.Database('./hello.sqlite');
  db.serialize(function() {
    db.serialize()
    db.all(`SELECT rowid AS id, name, link, image, active, buklet, class, city FROM ${tableName}`, [], function(err, row) {
      if (err){
        res.error()
        throw err
      }
      res.json(row)
    });
  });
  db.close((err) => {
    if (err) {
      throw err
    }
    console.log('Close the database connection.');
  });

});

router.post('/', (req, res) => {
  console.log('req.body', req.body)
  let db = new sqlite3.Database('./hello.sqlite');
  db.serialize()
  db.run('INSERT INTO example(name, link, city, class, image, active, buklet) VALUES(?, ?, ?, ?, ?, ?, ?)',
      [req.body.name,req.body.link, req.body.city, req.body.class, req.body.image, req.body.active, req.body.buklet],
      (err) => {
    if(err) {
      res.status(500)
      res.json(err)
      return console.log(err.message);
    }
    res.json(req.body)
    console.log('Row was added to the table: ${this.lastID}');
  })
  db.close((err) => {
    if (err) {
      throw err
    }
    console.log('Close the database connection.');
  });
})


router.post('/upload-image', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.send({
      success: false
    });

  } else {
    console.log(req.file)
    return res.send({
      success: true,
      fileName: req.file.filename
    })
  }
});
router.post('/upload-buklet', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.send({
      success: false
    });

  } else {
    console.log(req.file)
    return res.send({
      success: true,
      fileName: req.file.filename
    })
  }
});


router.get('/get-image/:id', (req, res) => {
  var options = {
    root: path.join(__dirname, '../uploads-image'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  var fileName = req.params.id
  res.contentType('image/jpeg');
  res.sendFile(fileName, options, function (err) {
    if (err) {
      res.status(403).send(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})

router.get('/get-buklet/:id', (req, res) => {
  var options = {
    root: path.join(__dirname, '../uploads-image'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  var fileName = req.params.id

  res.sendFile(fileName, options, function (err) {
    if (err) {
      res.status(403).send(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})

router.get('/delete/:id', (req, res) => {
  let db = new sqlite3.Database('./hello.sqlite');
  db.serialize()
  db.run(`DELETE FROM example WHERE id=?`, req.params.id, function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) deleted`);
    res.send({ success: true })
  });
  db.close((err) => {
    if (err) {
      res.send({ success: false })
      throw err
    }
    console.log('Close the database connection.');
  });

})
module.exports = router;
