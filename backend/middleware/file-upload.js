// custom middlerware
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
}

// configuration of multer -package: file-size limit, store procedures, storing location, 
const fileUpload = multer({
  limits: 700000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images')
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype]
      cb(null, 'image0'+ Math.floor((Math.random()*1000)) + '.' + ext)
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]
    let error = isValid ? null : new Error('invalid image mime-type!')
    cb(error, isValid)
  }
})

module.exports = fileUpload