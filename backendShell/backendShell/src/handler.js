/**
 * Author: Uma Sambathkumar
 * Date: 2024-10-16
 * Description: CRED operations for contact module
 */

const express = require("express");
const connectDB = require('./databaseConnection/db');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

/* Establishing Connection to Database */
connectDB();
const Contact = require('./model/model');
Contact();
const { v4: uuidv4 } = require("uuid");

/** Health Check API */
app.get("/health_check", (req, res, next) => {
  return res.status(200).json({
    message: "Health Check",
  });
});


/*Creation API - Contact */
app.post("/contact", async (req, res) => {
  const { firstName, lastName, phone, email } = req.body;
  const createdAt = Date.now()
  const uId = uuidv4();
  try {
    const newContact = new Contact({
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      uId: uId,
      softDeleteFlag: 1,
      createdAt: createdAt
    });

    const savedContact = await newContact.save();

    return res.status(201).json({
      message: "Contact created successfully!",
      contact: savedContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error.Error);
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      console.log("errorMessages")
      console.log(errorMessages)
      const formattedMessage = errorMessages.join(', ');
      return res.status(400).json({ message: formattedMessage });
    }
    return res.status(500).json({
      message: "Error creating contact",
      error: error.message,
    });
  }
});

/*Get All API - Contacts*/
app.get('/contacts', async (req, res) => {
  try {
    const contact = await Contact.find({ isDeleted: false });
    return res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return res.status(500).json({
      message: "Error fetching contact",
      error: error.message,
    });
  }
});

/*Get Particular Contact API */
app.get('/contact/:uId', async (req, res) => {
  const { uId } = req.params;
  try {
    const contact = await Contact.findOne({ uId, isDeleted: false });
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    return res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return res.status(500).json({
      message: "Error fetching contact",
      error: error.message,
    });
  }
});

/*Update Particular Contact API */
app.put('/contact/:uId', async (req, res) => {
  const { uId } = req.params;
  const { firstName, lastName, phone, email } = req.body;
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { uId },
      { firstName, lastName, phone, email, updatedAt: Date.now() },
      {
        new: true, // Return the updated document
        runValidators: true, // Run validation on update
        context: 'query' // Needed to handle `required` validations correctly
      }
    );

    if (!updatedContact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      message: "Contact updated successfully!",
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      const formattedMessage = errorMessages.join(', ');
      return res.status(400).json({ message: formattedMessage });
    }
    return res.status(500).json({
      message: "Error updating contact",
      error: error.message,
    });
  }
});

/*Delete Particular Contact API */
app.delete('/contact/:uId', async (req, res) => {
  const { uId } = req.params;
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { uId },
      { updatedAt: Date.now(), isDeleted: true },
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      message: "Contact soft deleted successfully!",
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    return res.status(500).json({
      message: "Error updating contact",
      error: error.message,
    });
  }
});


/*Search using FirstName, LastName, PhoneNo & Email */
app.get('/contact', async (req, res) => {
  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ message: 'Search text is required' });
  }

  try {
    const regex = new RegExp(text, 'i');
    const query = {
      $and: [
        {
          $or: [
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } },
            { email: { $regex: regex } },
            { phone: { $regex: regex } },
          ],
        },
        { isDeleted: false },
      ],
    };
    const users = await Contact.find(query);
    console.log("users Result")
    console.log(users)
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports = app;
