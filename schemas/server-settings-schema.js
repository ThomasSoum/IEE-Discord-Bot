const mongoose = require('mongoose');

const serverSettingsSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  semester_1: {
    type: String,
    default: 'none'
  },
  semester_2: {
    type: String,
    default: 'none'
  },
  semester_3: {
    type: String,
    default: 'none'
  },
  semester_4: {
    type: String,
    default: 'none'
  },
  semester_5: {
    type: String,
    default: 'none'
  },
  semester_6: {
    type: String,
    default: 'none'
  },
  semester_7: {
    type: String,
    default: 'none'
  },
  semester_8: {
    type: String,
    default: 'none'
  },
  semester_9: {
    type: String,
    default: 'none'
  },
  thesis: {
    type: String,
    default: 'none'
  },
  class_news: {
    type: String,
    default: 'none'
  },
  secretary_announcements: {
    type: String,
    default: 'none'
  },
  technical_issues: {
    type: String,
    default: 'none'
  },
  erasmus: {
    type: String,
    default: 'none'
  },
  thesis_presentations: {
    type: String,
    default: 'none'
  },
  postgraduate_studies: {
    type: String,
    default: 'none'
  },
  other_public_news: {
    type: String,
    default: 'none'
  },
  covid_cases: {
    type: String,
    default: 'none'
  },
  placements: {
    type: String,
    default: 'none'
  },
  proclamations: {
    type: String,
    default: 'none'
  },
  events: {
    type: String,
    default: 'none'
  },
  research_projects: {
    type: String,
    default: 'none'
  },
  MScWebIntelligence: {
    type: String,
    default: 'none'
  },
  IEEE_student_branch: {
    type: String,
    default: 'none'
  },
  enabled: {
    type: Boolean,
    required: true,
    default: false
  }
})

module.exports = mongoose.model('servers-settings', serverSettingsSchema)