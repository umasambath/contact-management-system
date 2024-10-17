# Contact Management System - Backend

## Overview
This is the backend service for a Contact Management System, developed using Node.js. It allows users to perform CRUD (Create, Read, Update, Delete) operations on contact data, with a focus on API design and integration testing.

## Technology Used
- **Language**: Node.js
- **Unit Testing**: NestJS
  - Total Mock Unit Cases: 8
- **Integration Testing**: Playwright
  - **Test 1**: Creation of Contact
  - **Test 2**: Validation of Field Missing
  - **Test 3**: Invalid Email Format Validation
  - **Test 4**: Invalid Phone Number Format Validation
- **Database**: Mongo DB
- **AWS Services Used**: 
  - AWS Secrets Manager
  - AWS CDK
  - AWS Lambda
  - API Gateway
 

## Features
The backend service supports the following features:
1. **Display Contacts**: List of contacts available via API.`GET /contacts`
2. **Search Functionality**: Contacts can be searched by first name, last name, or email address. `POST /contact?text=${firstName/lastName/email/phoneno}`
3. **Delete Contacts**: Option to delete a contact from the list. `DELETE /contact/${uId}`
4. **Create Contacts**: Button to create a new contact via a popup dialog with fields: First name, Last name, email, and phone number. `POST /contact`
5. **Update Contacts**: Redirect to a contact details page where all details are displayed in a form that can be updated. `PUT /contact/${uId}`
6. **CRUD Operations**: API endpoints for adding, deleting, updating, and listing contacts.

## Getting Started

### Prerequisites
- Node.js installed on your machine
- AWS account for using AWS services
- Environment variables set for your AWS credentials and connection URL.

### API Endpoints

    GET /contacts: Retrieve the list of contacts.
    POST /contacts: Create a new contact.
    DELETE /contacts/:uId: Delete a contact by uId.
    PUT /contacts/:uId: Update a contact by uId.

### Running the Backend Service Locally
To start the backend service in your local environment, use the following command:

```bash
node ./local.js
```
### Running Unit & Integration Tests Locally

```bash
npm test
```
