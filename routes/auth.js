var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    if (req.body.user = 'YWRtaW4=S2VnJDdSc1l1V1Q4') {
        res.send('auth success');
    }else {
        res.status(403)
        res.send('auth error')
    }

});

module.exports = router;
