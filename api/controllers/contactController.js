const Contact = require("../models/contactModel");

const createContact = (req, res) => {
  const contact = new Contact({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    tags: req.body.tags || [],
    workspaceId: req.body.workspaceId,
    createdBy: req.user.userId,
  });

  contact
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Contact created successfully",
        contact: result,
        request: {
          type: "GET",
          url: "http://localhost:3000/contacts/" + result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const getAllContacts = (req, res) => {
  Contact.find()
    .then((contacts) => {
      res.status(200).json({
        message: "Contacts retrieved successfully",
        data: contacts,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error retrieving contacts",
        error: err,
      });
    });
};

const getContactById = (req, res) => {
  const contactId = req.params.contactId;
  Contact.findById(contactId)
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json({
        message: "Contact retrieved successfully",
        data: contact,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const updateContact = (req, res) => {
  const contactId = req.params.contactId;
  const updatedData = req.body;

  Contact.findByIdAndUpdate(contactId, updatedData)
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json({
        message: "Contact updated successfully",
        data: updatedData,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

const deleteContact = (req, res) => {
  const contactId = req.params.contactId;
  Contact.findByIdAndDelete(contactId)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(200).json({
        message: "Contact deleted successfully",
        data: result,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
