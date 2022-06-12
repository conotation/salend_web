"use strict"

const express = require('express')
const path = require('path')
const request = require('request')
const fs = require('fs')

const router = express.Router()
const sharp = require('sharp')
const multer = require('multer')

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path.resolve(__dirname + '/public/image/'));
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

router.get('/', (req, res) => {
    res.redirect('login')
})

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
        console.log(res.statusCode)
        if (res.statusCode == 200) {
            data['success'] = true
            q.session.user = {
                user_id: data._id,
                data: data
            }
            s.json(data)
            console.log(q.session.user)
        } else {
            s.json(data)
        }
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
            req.session.destroy(() => {
                req.session
            })
        }
    } catch (e) {
        console.log(e)
    }
    res.redirect('/login');
});

// 이미지 업로드
router.post('/upload', upload.single('image'), (req, res) => {
    let response = {}
    // image name = 'image'
    // 매장 자유 사이즈, 상품 400:400
    try {
        let size = {
                width: 400,
            }

        if(req.body.item){
            size['height'] = 400
        }

        sharp(req.file.path)
            .resize(size)
            .withMetadata()
            .png()
            .toBuffer((err, buffer) => {
                if (err) throw err;
                fs.writeFile(req.file.path, buffer, (err) => {
                    if (err) throw err;
                });
            });
    } catch (err) {
        console.log(err)
        response = { success: false, msg:"Image Upload Failed"}
        res.status(400).json(response)
        return
    }
    response = { success: true, filename: req.file.filename }
    res.json(response);
});

router.get('/map', (req, res) => {
    res.render('map')
})

router.get('/manage', (req, res) => {
    res.render('manage', {})
});

router.post('/manage', upload.fields([]), (q, s) => { // 작성 중
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
    if(!req.session.user)
        res.redirect('login')
    const data = req.session.user.data
    console.log(data)

    const inData = {
        id: data._id,
        name: data.s_name || "",
        time: data.s_time || "",
        address: data.s_location || "",
        certified: "" + data.s_certified,
        image: data.s_image || "res/default.png"
    }
    console.log(inData)

    res.render('store', inData)
});

router.post('/store', upload.fields([]), (q, s) => {
    //@TODO DEL
    console.log(q.body)
    console.log(typeof q.body)

    request.put({
        url: 'https://api.salend.tk/user/' + q.body.x_id,
        form:  q.body
    }, (err, res, body) => {
        let data = JSON.parse(body)
        s.json(data)
        q.session.user = {
            data: data
        }
        console.log('error: ', err);
        console.log('statusCode: ', res && res.statusCode)
        console.log('body: ', body)
    })
});

router.get('/write', (req, res) => {
    if(!req.session.user)
        res.redirect('login')
    const data = req.session.user.data;

    let inData = {
        id: data._id,
        name: data.s_name
    }

    res.render('write', inData)
});

router.post('/write', upload.fields([]), (q, s) => { // 작성 중
    //@TODO DEL
    console.log(q.body)

    const data = q.body;

    request.post({
        url: 'https://api.salend.tk/item',
        form: data
    }, (err, res, body) => {
        const result = JSON.parse(body)
        console.log(result)
        s.json(result)
        console.log('error: ', err);
        console.log('statusCode: ', res && res.statusCode)
        console.log('body: ', body)
    })
});


module.exports = router;