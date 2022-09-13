import Note from "../models/note.js";
import User from "../models/user.js";
import createError from "../util/Error.js";
import mongoose from "mongoose";

export const getNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({});
        if (!notes) {
            return next(createError("Notes not found", 404))
        }
        res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            notes: notes,
            count: notes.length
        })
    }
    catch (error) {
        next (error)
    }
}

export const getNoteById = async (req, res, next) => {
    try {
        const noteId = req.params.noteId;
        const note = await Note.findById(noteId);
        if (note.length <= 0) {
            return next(createError(`Note not found with id ${noteId}`, 404));
        }
        res.status(200).json({
            success: true,
            message: "Note fetched successfully",
            note: note
        })
    }
    catch (error) {
        next (error)
    }
}

export const viewNotesRelatedToCategory = async (req, res, next) => {
    const noteCategory = await Note.aggregate([
        {
            $project: {
                title: 1
            },
            $match: {
                

            }
        }
    ])
}

export const getNoteWithFirstTag = async (req, res, next) => {
    const firstNoteTag = await Note.aggregate([
        { 
            $group: {
                _id : "$title",
                tags: { $sum: 1 }
            }, 
            $addFields: {
                firstTag: { $first: "$tags" }
            }
      }
    ])

    return firstNoteTag[0];
}

export const getNoteWithTags = async (req, res, next) => {
    const noteTags = await Note.aggregate([
        {
            $unwind: "$tags"
        },
        {
            $group: {
                _id: null,
                tags: { $push: "$tags"}
            }
        },
        {
            $project: {
                title: true,
                tags: true,
                _id: false
            }
        }
    ])
    return noteTags[0];
}

export const createNote = async (req, res, next) => {
    const { title, description, status, tags } = req.body;
    try {
        const note = new Note({
            title: title, 
            description: description,
            status: status,
            tags: tags
        })
        await note.save();
        const user = await User.findById(req.user);
        user.noteId.push(note);
        await user.save();
        res.status(201).json({
            success: true,
            message: "Note created successfully.",
            note: note
        })
    }
    catch (error) {
        next (error)
    }
}

export const updateNote = async (req, res, next) => {
    const noteId = req.params.noteId;
    const { title, description, status, tags } = req.body;
    try {
        const note = await Note.findOneAndUpdate({noteId}, { title, description, status, tags }, { new: true });
        if (!note) {
            return next(createError("Note not found", 404))
        }
        if (note.writtenBy.toString() !== req.user){
            return next(createError("User not authorized", 403))
        }
        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            note: note
        })
    }
    catch (error) {
        next (error)
    }
}

export const deleteNote = async (req, res, next) => {
    const noteId = req.params.noteId;
    try {
        const note = await Note.findById(noteId);
        if (!note) {
            return next(createError("Note not found", 404));
        }
        if (note.writtenBy.toString() !== req.user) {
            return next(createError("User not authorized", 403))
        }
        const deletedNote = await Note.findByIdAndDelete(noteId);
        const user = await User.findOne(req.user);
        user.noteId.pull(note);
        await user.save();
        res.status(200).json({
            success: true,
            message: "Note deleted successfully.",
            note: deletedNote
        })
    }
    catch (error) {
        next (error)
    }
}
