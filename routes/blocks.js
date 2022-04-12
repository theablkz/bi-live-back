const express = require('express');
const router = express.Router();
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

const upload = multer({storage})
const sqlite3 = require('sqlite3').verbose();
const tableName = 'blocks'

/* GET home page. */
router.get('/', function(req, res, next) {
    let db = new sqlite3.Database('./hello.sqlite');
    db.serialize(function() {
        db.serialize()
        db.all(`SELECT * FROM ${tableName}`, [], function(err, row) {
            if (err){
                console.log(err)
                res.error()
                throw err
            }
            res.json(row)
            //res.json(row)
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
    let db = new sqlite3.Database('./hello.sqlite');
    db.serialize()

    db.run(`INSERT INTO ${tableName}(city, status, format, title, description, date, link, image, videolink, categories) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.body.city,req.body.status, req.body.format, req.body.title, req.body.description, req.body.date, req.body.link, req.body.image, req.body.videolink, req.body.categories],
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


router.get('/delete/:id', (req, res) => {
    let db = new sqlite3.Database('./hello.sqlite');
    db.serialize()
    db.run(`DELETE FROM ${tableName} WHERE id=?`, req.params.id, function(err) {
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
