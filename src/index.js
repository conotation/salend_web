"use strict"

const express = require('express')
const path = require('path')
const request = require('request')

const router = express.Router()
const multer = require('multer')

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path.resolve(__dirname + '/../public/image/'));
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            const timestamp = new Date().getTime().valueOf();
            const filename = timestamp + ".png";
            cb(null, filename);
        },
    }),
});

const checkEmail = (text) => {
    var regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    if (regEmail.test(text) === true) {
        return true
    } else {
        return false
    }
}

router.get('/login', (req, res) => {
    res.render('login', {})
});

router.post('/login', upload.fields([]), (q, s) => {
    //@TODO DEL
    console.log(q.body)

    request.post({
        url: 'https://api.salend.tk/user/login',
        form: {
            s_email: q.body._id,
            s_pw: q.body._pw
        }
    }, (err, res, body) => {
        const data = JSON.parse(body)
        if (data) {
            q.session.user = {
                user_id: data._id
            }
            console.log(q.session.user)
        }
        s.json(data)
    })
})

router.get('/signup', (req, res) => {
    res.render('join', {})
});

router.post('/signup', upload.fields([]), (q, s) => {
    //@TODO DEL
    console.log(q.body)

    const p_id = q.body._id;
    const p_pw = q.body._pw;
    const p_rpw = q.body._rpw;


    if (!checkEmail(p_id)) {
        console.log('not email')
        s.json({ success: false, msg: "not mail" })
        return;
    }

    if (p_pw != p_rpw) {
        console.log('not equal')
        s.json({ success: false, msg: "not equal" })
        return;
    }

    request.post({
        url: 'https://api.salend.tk/user/',
        form: {
            s_email: p_id,
            s_pw: p_pw
        }
    }, (err, res, body) => {
        s.json(JSON.parse(body))
        console.log('error: ', err);
        console.log('statusCode: ', res && res.statusCode)
        console.log('body: ', body)
    })
})

router.get('/logout', (req, res) => {
    var session = req.session;
    try {
        if (session.user) {
            req.session.destroy(err => {
                if (err)
                    console.log(err)
                else
                    res.redirect("/");
            }).then();
        }
    } catch (e) {
        console.log(e)
    }
    res.redirect('/');
});

router.get('/manage', (req, res) => {
    res.render('manage', {})
});

router.post('/manage', upload.fields([]), (q, s) => {   // 작성 중
    //@TODO DEL
    console.log(q.body)

    const p_id = q.body._id;

    request.post({
        url: 'https://api.salend.tk/user/',
        form: {
            s_email: p_id,
            s_pw: p_pw
        }
    }, (err, res, body) => {
        s.json(JSON.parse(body))
        console.log('error: ', err);
        console.log('statusCode: ', res && res.statusCode)
        console.log('body: ', body)
    })
});

router.get('/store', (req, res) => {
    res.render('store', {})
});

router.post('/store', upload.fields([]), (q, s) => {   // 작성 중
    //@TODO DEL
    console.log(q.body)

    const p_id = q.body._id;

    request.post({
        url: 'https://api.salend.tk/user/',
        form: {
            s_email: p_id,
            s_pw: p_pw
        }
    }, (err, res, body) => {
        s.json(JSON.parse(body))
        console.log('error: ', err);
        console.log('statusCode: ', res && res.statusCode)
        console.log('body: ', body)
    })
});

router.get('/write', (req, res) => {
    res.render('write', {})
});

router.post('/write', upload.fields([]), (q, s) => {   // 작성 중
    //@TODO DEL
    console.log(q.body)

    const p_id = q.body._id;

    request.post({
        url: 'https://api.salend.tk/user/',
        form: {
            s_email: p_id,
            s_pw: p_pw
        }
    }, (err, res, body) => {
        s.json(JSON.parse(body))
        console.log('error: ', err);
        console.log('statusCode: ', res && res.statusCode)
        console.log('body: ', body)
    })
});


module.exports = router;