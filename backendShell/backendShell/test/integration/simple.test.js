/**
 * Author: Uma Sambathkumar
 * Date: 2024-10-16
 * Description: Integration Testing using playwright
 */

require('dotenv').config(); 
const { test, expect } = require('@playwright/test');

test.describe('Creation of Contact Managment', () => {
    const apiUrl = `${process.env.API_URL}/contact`;

    /*Test 1 --> Creation of Contact */
    test('should create a new contact', async ({ request }) => {
        const newContact = {
            firstName: 'John',
            lastName: 'Doe',
            phone: '1234567890',
            email: 'john.doe@example.com',
        };

        const response = await request.post(apiUrl, {
            data: newContact,
        });

        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        expect(responseBody.message).toBe("Contact created successfully!");
        expect(responseBody.contact).toHaveProperty('firstName', newContact.firstName);
        expect(responseBody.contact).toHaveProperty('lastName', newContact.lastName);
        expect(responseBody.contact).toHaveProperty('phone', newContact.phone);
        expect(responseBody.contact).toHaveProperty('email', newContact.email);
    });

    /* Test 2 --> Validation of Field missing*/
    test('field value is missing', async ({ request }) => {
        const newContact = {
            lastName: 'Doe',
            phone: '1234567890',
            email: 'john.doe@example.com',
        };
        const response = await request.post(apiUrl, { data: newContact })
        expect(response.status()).toBe(400)
    })

    /* Test 3 -->  Invalid Email Format Validation */
    test('Invalid Email format',async({request})=>{
        const newContact = {
            firstName: 'John',
            lastName: 'Doe',
            phone: '1234567890',
            email: 'john.doe',
        }; 
        const response = await request.post(apiUrl, { data: newContact })
        expect(response.status()).toBe(400)
    })

    /* Test 4 --> Invalid Phone Number Validation */
     test('Phone No should have 10 digits',async({request})=>{
        const newContact = {
            firstName: 'John',
            lastName: 'Doe',
            phone: '123',
            email: 'john.doe@gmail.com',
        }; 
        const response = await request.post(apiUrl, { data: newContact })
        expect(response.status()).toBe(400)
    })

});