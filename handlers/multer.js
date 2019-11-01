
const multer = require('multer')

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
      cb(new Error('Solo se admiten imagenes de tipo png/jpeg/jpg/gif'), false)
      return
    }

    cb(null, true)
  }
})

