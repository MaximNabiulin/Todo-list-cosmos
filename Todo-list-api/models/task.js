const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    required: true,
  },
  status: {
    type: String,
    enum: ['to_do', 'in_progress', 'done', 'cancelled'],
    default: 'to_do',
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  responsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // NOTE: Добавляет поля createdAt и updatedAt
});

module.exports = mongoose.model('task', taskSchema);
