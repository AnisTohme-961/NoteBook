import express from 'express';
import { verifyLogin } from '../Middleware/Verification.js';
import { validate } from 'express-validation';
import { createNote, deleteNote, getNoteById, getNotes, updateNote } from '../controllers/note.controllers.js';
import noteValidations from '../Validations/note.validations.js';

const router = express.Router();

// @route   GET /notes
// @desc    Get all notes
// @access  Public

router.get('/notes', verifyLogin, getNotes);

// @route   GET /note/noteId
// @desc    Get note
// @access  Public

router.get('/note/noteId', verifyLogin, getNoteById);

// @route   POST /note
// @desc    Create note
// @access  Public

router.post('/note', verifyLogin, validate(noteValidations.noteValidator), createNote);

// @route   PUT /note/:noteId
// @desc    Update note
// @access  Public

router.put('/note/:noteId', verifyLogin, updateNote);

// @route   DELETE /note/:noteId
// @desc    Delete note
// @access  Public

router.delete('/note/:noteId', verifyLogin, deleteNote);

export default router;