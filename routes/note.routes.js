import express from "express"
import { verifyLogin } from "../Middleware/Verification.js"
import {
  createNote,
  deleteNote,
  getFirstAndLastTag,
  getNoteById,
  getNotes,
  getNotesWithTags,
  updateNote,
} from "../controllers/note.controllers.js"
import Validator from "../Middleware/Validator.js"

const router = express.Router()

// @route   GET /notes/
// @desc    Get all notes
// @access  Private

router.get("/", verifyLogin, getNotes)

// @route   GET /note/noteId
// @desc    Get note
// @access  Private

router.get("/:noteId", verifyLogin, getNoteById)

// @route   Get /:noteId/tags
// @desc    Get first and last tags of note
// @access  Private

router.get("/:noteId/fltags", verifyLogin, getFirstAndLastTag)

// @route   Get /tag
// @desc    Get notes that has tags and its size
// @access  Private

router.get("/:noteId/tags", verifyLogin, getNotesWithTags)

// @route   POST /note
// @desc    Create note
// @access  Private

router.post("/", verifyLogin, Validator("note"), createNote)

// @route   PUT /note/:noteId
// @desc    Update note
// @access  Private

router.put("/:noteId", verifyLogin, Validator("note"), updateNote)

// @route   DELETE /note/:noteId
// @desc    Delete note
// @access  Private

router.delete("/:noteId", verifyLogin, deleteNote)

export default router
