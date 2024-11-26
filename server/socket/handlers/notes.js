const User = require("../../models/User");
const JobApplied = require("../../models/JobsApplied");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const notesHandler = (socket, io) => {
  socket.on("addNote", async (data, callback) => {
    const { content } = data;
    const candidateId = socket.meetingDetails?.candidateUserId;

    if (!candidateId) {
      return callback({
        success: false,
        message: "Unauthorized request. Candidate ID is missing.",
      });
    }

    try {
      const candidateObjectId = new ObjectId(candidateId);

      // Find the application document for the candidate
      const application = await JobApplied.findOne({
        userProfile: candidateObjectId,
      });

      if (!application) {
        return callback({
          success: false,
          message: "Application not found for the candidate.",
        });
      }

      // Create the new note
      const newNote = {
        _id: new mongoose.Types.ObjectId(), // Generate a unique ObjectId for the note
        note: content,
        createdAt: new Date(),
      };

      // Add the note to the application
      application.notes.push(newNote);
      await application.save();

      // Respond with success and the added note
      callback({
        success: true,
        note: {
          id: newNote._id.toString(),
          content: newNote.note,
          createdAt: newNote.createdAt.toISOString(),
        },
      });
    } catch (error) {
      console.error("Error adding note:", error);
      callback({
        success: false,
        message: "Failed to add the note. Please try again.",
      });
    }
  });

  socket.on("updateNote", async (data, callback) => {
    const { id, content } = data;
    const candidateId = socket.meetingDetails?.candidateUserId;

    if (!candidateId) {
      return callback({
        success: false,
        message: "Unauthorized request. Candidate ID is missing.",
      });
    }

    try {
      const candidateObjectId = new ObjectId(candidateId);

      // Find the application document for the candidate
      const application = await JobApplied.findOne({
        userProfile: candidateObjectId,
      });

      if (!application) {
        return callback({
          success: false,
          message: "Application not found for the candidate.",
        });
      }

      // Find the note within the application by its ObjectId
      const noteToUpdate = application.notes.id(id);

      if (!noteToUpdate) {
        return callback({
          success: false,
          message: "Note not found.",
        });
      }

      // Update the note content
      noteToUpdate.note = content;
      await application.save();

      // Respond with success and the updated note
      callback({
        success: true,
        note: {
          id: noteToUpdate._id.toString(),
          content: noteToUpdate.note,
          createdAt: noteToUpdate.createdAt.toISOString(), // Preserve original createdAt
        },
      });
    } catch (error) {
      console.error("Error updating note:", error);
      callback({
        success: false,
        message: "Failed to update the note. Please try again.",
      });
    }
  });

  socket.on("deleteNote", async (data, callback) => {
    const { id } = data; // Note ID to delete
    const candidateId = socket.meetingDetails?.candidateUserId; // Candidate's ID from socket

    if (!candidateId) {
      return callback({
        success: false,
        message: "Unauthorized request. Candidate ID is missing.",
      });
    }

    try {
      const candidateObjectId = new ObjectId(candidateId);

      // Find the application document for the candidate
      const application = await JobApplied.findOne({
        userProfile: candidateObjectId,
      });

      if (!application) {
        return callback({
          success: false,
          message: "Application not found for the candidate.",
        });
      }

      // Check if the note exists in the notes array
      const noteIndex = application.notes.findIndex(
        (note) => note._id.toString() === id
      );

      if (noteIndex === -1) {
        return callback({
          success: false,
          message: "Note not found.",
        });
      }

      // Remove the note from the array
      application.notes.splice(noteIndex, 1);

      // Save the updated application document
      await application.save();

      // Respond with success
      callback({
        success: true,
        message: "Note deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      callback({
        success: false,
        message: "Failed to delete the note. Please try again.",
      });
    }
  });

  socket.on("getNotes", async (data, callback) => {
    const candidateId = socket.meetingDetails?.candidateUserId;

    if (!candidateId) {
      return callback({
        success: false,
        message: "Unauthorized request. Candidate ID is missing.",
      });
    }

    try {
      const candidateObjectId = new ObjectId(candidateId);

      // Find the application document for the candidate
      const application = await JobApplied.findOne({
        userProfile: candidateObjectId,
      });

      if (!application) {
        return callback({
          success: false,
          message: "Application not found for the candidate.",
        });
      }

      // If the candidate exists, return all the notes
      const notes = application.notes.map((note) => ({
        id: note._id.toString(),
        content: note.note, // Assuming the notes are stored in the "note" field
        createdAt: note.createdAt || new Date(),
      }));

      callback({
        success: true,
        notes,
      });
    } catch (error) {
      console.error("Error fetching notes:", error);
      callback({
        success: false,
        message: "Failed to fetch notes. Please try again.",
      });
    }
  });
};

module.exports = notesHandler;
