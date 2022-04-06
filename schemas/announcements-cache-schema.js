const mongoose = require('mongoose');

const announcementsCacheSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  announcements: [
    {
      _id: String,
      _about: String
    }
  ]
})

module.exports = mongoose.model('announcements-cache', announcementsCacheSchema)