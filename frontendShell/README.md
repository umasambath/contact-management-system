# Contact Management System - Frontend

## Overview
This is the frontend service for a Contact Management System, developed using React.js. The application provides a user-friendly interface for managing contacts, allowing users to perform CRUD operations seamlessly.

## Technology Used
- **Language**: JavaScript (React.js)
- **State Management**: React Hooks (useState, useEffect)
- **Testing**: Playwright for testing
  - **Test Cases**:
    - Creation of Contact
    - List of Contacts
    - Update of a Contact
- **API Communication**: Axios for making HTTP requests
- **Styling**: Tailwind CSS for styling the components

## Features
The frontend service supports the following features:
1. **Display Contacts**: List of contacts fetched from the backend API.
2. **Search Functionality**: Search contacts using first name, last name, or email address.
3. **Delete Contacts**: Option to delete a contact from the list with a confirmation dialog.
4. **Create Contacts**: Button to open a popup dialog for creating a new contact with fields: First name, Last name, email, and phone number.
5. **Update Contacts**: Redirect to a contact details page where all details are displayed in a form that can be updated.

## Getting Started

### Prerequisites
- Node.js installed on your machine
- Environment variables set for your backend connection URL (only for local connection).`REACT_APP_CONNECTION_URL`

### Running the Frontend Application Locally
To start the frontend application in your local environment, use the following command:

```bash
npm start
