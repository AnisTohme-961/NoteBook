import Note from "../models/note.js";
import User from "../models/user.js";
import createError from "../util/Error.js";
import mongoose from "mongoose";
import category from "../models/category.js";

export const getNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({}).sort({ createdAt: -1 });
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
        if (!note) {
            return next(createError(`Note not found with id ${noteId}`))
        }
        const noteAggregate = await Note.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(noteId) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'writtenBy',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'title',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: "$category"
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    createdBy: "$user._id",
                    fullname: {
                        $concat: ["$user.firstName", " ", "$user.lastName"]   
                    },
                    email: "$user.email",
                    category: "$category.title"
                }
            }
        ])  
        res.status(200).json({
            success: true,
            message: "Note found successfully", 
            noteAggregate: noteAggregate[0]
        })

    }
    catch (error) {
        next (error)
    }   
}

export const viewNotesRelatedToCategory = async (req, res, next) => {
    const { noteId } = req.params;
    const noteCategory = await Note.aggregate([
        {
            $match: {
                categoryId: mongoose.Types.ObjectId(noteId)
            },
            $lookup: {
                from: "categories",
                localField: "title",
                foreignField: "_id",
                as: "category"
            },
            $group: {
                _id: "$title",
                category: "$category.title"
            }
        }
    ])
}

export const getFirstAndLastTag = async (req, res, next) => {
    try {
        const firstAndLastTag = await Note.aggregate([
            {
                $project: {
                    title: 1,
                    _id: 0,
                    first: { $arrayElemAt: ["$tags", 0] },
                    last: { $arrayElemAt: ["$tags", -1] }
                }
            }
        ])
    }
    catch (error) {
        next (error)
    }
}

export const getNoteWithTags = async (req, res, next) => {
    try {
        const noteTags = await Note.aggregate([
            {
                $unwind: "$tags"
            },                                  
            {
                $group: {
                    _id: "$title",
                    tags: { $push: "$tags"}
                }
            }
        ])
    }
    catch (error) {
        next (error)
    }  
}

export const getTagSize = async (req, res, next) => {
    const sizeTag = await Note.aggregate([
        {
            $project: {
                title:1,
                _id: 0,
                numberofTags: { 
                    $cond: { 
                        if: { $isArray: "$tags" },
                        then: { $size: "$tags" },
                        else: "Not Applicable"    
                    } 
                }
            }
        }
    ])
}

export const createNote = async (req, res, next) => {
    const { title, description, status, tags } = req.body;
    const { id } = req.user;
    const { categoryId } = req.params.categoryId;
    try {
        const existingNote = await Note.findOne({ title })
        if (existingNote) {
            return next(createError("Note already exists", 400))
        }
        const note = new Note({
            title: title, 
            description: description,
            status: status,
            tags: tags,
            writtenBy: id,
            category: categoryId
        })
        await note.save();
        const user = await User.findById(id);
        user.notes.push(note._id);
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
    const { id } = req.user;
    const { title, description, status, tags } = req.body;
    try {
        const note = await Note.findById(noteId);
        if (!note) {
            return next(createError(`Note not found with id ${noteId}`, 404))
        }
        if (note.writtenBy.toString() !== id){
            return next(createError("User not authorized", 403))
        }
        note.title = title;
        note.description = description;
        note.status = status;
        note.tags = tags;
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
    const { id } = req.user;
    try {
        const note = await Note.findById(noteId);
        if (!note) {
            return next(createError(`Note not found with id ${noteId}`, 404));
        }
        if (note.writtenBy.toString() !== id) {
            return next(createError("User not authorized", 403))
        }
        const deletedNote = await Note.findByIdAndDelete(noteId);
        const user = await User.findById(id);
        user.noteId.pull(note._id);
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

