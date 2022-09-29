import Note from "../models/note.js"
import User from "../models/user.js"
import createError from "../util/Error.js"
import mongoose from "mongoose"
import category from "../models/category.js"
import note from "../models/note.js"

export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({}).sort({ createdAt: -1 })
    if (!notes) {
      return next(createError("Notes not found", 404))
    }
    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes: notes,
      count: notes.length,
    })
  } catch (error) {
    next(error)
  }
}

export const getNoteById = async (req, res, next) => {
  try {
    const noteId = req.params.noteId
    const note = await Note.findById(noteId)
    if (!note) {
      return next(createError(`Note not found with id ${noteId}`))
    }
    const noteAggregate = await Note.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(noteId) }
      },
      {
        $group: {
          _id: {
            id: "$_id",
            title: "$title",
            content: "$content",
            status: "$status",
            tags: "$tags",
            writtenBy: "$writtenBy"
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "writtenBy",
          foreignField: "id",
          as: "user",
        }
      },
      {
        $unwind: "$user"
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "id",
          as: "category"
        },
      },
      {
        $unwind: "$category"
      },
      {
        $project: {
          category: {
            id: "$category._id",
            title: "$category.title" 
          }
        }
      }
    ])
    res.status(200).json({
      success: true,
      message: "Note found successfully",
      note: noteAggregate[0]
    })
  } catch (error) {
    next(error)
  }
}

export const getFirstAndLastTag = async (req, res, next) => {
  try {
    const noteId = req.params.noteId
    const firstAndLastTag = await Note.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(noteId) },
      },
      {
        $project: {
          title: 1,
          _id: 0,
          firstTag: { $ifNull: [{ $arrayElemAt: ["$tags", 0] }, "NA"] },
          lastTag: { $ifNull: [{ $arrayElemAt: ["$tags", -1] }, "NA"] },
        },
      },
    ])
    res.status(200).json({
      success: true,
      message: "First and Last Tag found successfully",
      note: firstAndLastTag[0],
    })
  } catch (error) {
    next(error)
  }
}

export const getNotesWithTags = async (req, res, next) => {
  try {
    const { noteId } = req.params
    const note = Note.findById(noteId)
    const noteTags = await Note.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(noteId) },
      },
      {
        $unwind: { path: "$tags", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$title",
          tags: { $push: "$tags" },
        },
      },
      {
        $project: {
          title: 1,
          tags: 1,
          numberofTags: {
            $cond: {
              if: { $isArray: "$tags" },
              then: { $size: "$tags" },
              else: "Not Applicable",
            },
          },
        },
      },
    ])
    res.status(200).json({
      success: true,
      message: "Note with the appropriate tags:",
      note: noteTags[0],
    })
  } catch (error) {
    next(error)
  }
}

export const createNote = async (req, res, next) => {
  const { title, content, status, tags, categoryId, writtenBy } = req.body
  const { id } = req.user
  try {
    const existingNote = await Note.findOne({ title })
    if (existingNote) {
      return next(createError("Note already exists", 400))
    }
    const note = new Note({
      title: title,
      content: content,
      status: status,
      tags: tags,
      categoryId: categoryId,
      writtenBy: id,
    })
    await note.save()
    const user = await User.findById(id)
    user.notes.push(note._id)
    await user.save()
    res.status(201).json({
      success: true,
      message: "Note created successfully.",
      note: note,
    })
  } catch (error) {
    next(error)
  }
}

export const updateNote = async (req, res, next) => {
  const noteId = req.params.noteId
  const { id } = req.user
  const { title, content, status, tags } = req.body
  try {
    const note = await Note.findById(noteId)
    if (!note) {
      return next(createError(`Note not found with id ${noteId}`, 404))
    }
    if (note.writtenBy.toString() !== id) {
      return next(createError("User not authorized", 403))
    }
    note.title = title
    note.content = content
    note.status = status
    note.tags = tags
    await note.save();
    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: note,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId
  const { id } = req.user
  try {
    const note = await Note.findById(noteId)
    if (!note) {
      return next(createError(`Note not found with id ${noteId}`, 404))
    }
    if (note.writtenBy.toString() !== id) {
      return next(createError("User not authorized", 403))
    }
    const deletedNote = await Note.findByIdAndDelete(noteId)
    const user = await User.findById(id)
    user.notes.pull(note._id)
    await user.save()
    res.status(200).json({
      success: true,
      message: "Note deleted successfully.",
      note: deletedNote,
    })
  } catch (error) {
    next(error)
  }
}
