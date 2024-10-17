const { test, expect } = require('@playwright/test');

test.describe('AddContact Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3001/add/user'); // Adjust route as needed
    });

    test('should submit the form successfully', async ({ page }) => {
        await page.route('**/contact', async (route) => {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({ success: true }), // Mock successful response
            });
        });

        await page.fill('input[name="firstName"]', 'John');
        await page.fill('input[name="lastName"]', 'Doe');
        await page.fill('input[name="email"]', 'john.doe@example.com');
        await page.fill('input[name="phone"]', '1234567890');

        // Click the save button
        await page.click('text=Save');

        // Wait for the page to navigate back to the home page (or whatever page you navigate to on success)
        await page.waitForURL('http://localhost:3001/'); // Adjust according to your redirect

        // Assert that the user is redirected back to the home page
        await expect(page).toHaveURL('http://localhost:3001/'); // Adjust according to your redirect
    });

    test('should display an error message on failure', async ({ page }) => {
        // Intercept and mock the POST request to simulate an error
        await page.route('**/contact', async (route) => {
            await route.fulfill({
                status: 400,
                body: JSON.stringify({
                    message: 'Error inserting contact',
                }), 
            });
        });

        // Fill out the form
        await page.fill('input[name="firstName"]', 'Jane');
        await page.fill('input[name="lastName"]', 'Doe');
        await page.fill('input[name="email"]', 'jane.doe@example.com');
        await page.fill('input[name="phone"]', '0987654321');

        // Click the save button
        await page.click('text=Save');

        // Wait for the error message to be displayed
        const errorMessage = await page.locator('.fixed.bg-red-500');
        await expect(errorMessage).toHaveText('Error inserting contact');

        // Optional: Check if the error message disappears after 2 seconds
        await page.waitForTimeout(2000); // Adjust this according to your setTimeout duration
        await expect(errorMessage).toBeHidden();
    });

    test('should navigate to home page on cancel', async ({ page }) => {
        // Click the cancel button
        await page.click('text=Cancel');

        // Assert that the user is redirected back to the home page
        await expect(page).toHaveURL('http://localhost:3001/'); // Adjust according to your redirect
    });
});


test.describe('UpdateContact Component', () => {
    const contactId = '123'; // Example contact ID

    test.beforeEach(async ({ page }) => {
        // Navigate to the UpdateContact component
        await page.goto(`http://localhost:3001/edit/${contactId}`); // Adjust the URL path as necessary
    });

    test('should load existing contact details', async ({ page }) => {
        // Intercept the GET request and mock the response
        await page.route(`**/contact/${contactId}`, async (route) => {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '1234567890',
                }),
            });
        });

        // Navigate to the page/component where the contact is updated
        await page.goto(`http://localhost:3001/edit/${contactId}`); // Adjust the path as necessary

        // Wait for the form fields to be populated
        await page.waitForSelector('input[name="firstName"]'); // Ensure the field is rendered

        // Assert that the form fields are filled with the mocked contact data
        await expect(page.locator('input[name="firstName"]')).toHaveValue('John');
        await expect(page.locator('input[name="lastName"]')).toHaveValue('Doe');
        await expect(page.locator('input[name="email"]')).toHaveValue('john.doe@example.com');
        await expect(page.locator('input[name="phone"]')).toHaveValue('1234567890');
    });


    test('should successfully update the contact', async ({ page }) => {
        // Intercept the GET request to load existing contact details
        await page.route(`**/contact/${contactId}`, async (route) => {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '1234567890',
                }),
            });
        });

        // Intercept the PUT request to update the contact
        await page.route(`**/contact/${contactId}`, async (route) => {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({ success: true }), // Mock successful update response
            });
        });

        // Fill out the form with new values
        await page.fill('input[name="firstName"]', 'Jane');
        await page.fill('input[name="lastName"]', 'Smith');
        await page.fill('input[name="email"]', 'jane.smith@example.com');
        await page.fill('input[name="phone"]', '0987654321');

        // Click the save button
        await page.click('text=Save');

        // Wait for the page to navigate back to the home page (or whatever page you navigate to on success)
        await page.waitForURL('http://localhost:3001/'); // Adjust according to your redirect

        // Assert that the user is redirected back to the home page
        await expect(page).toHaveURL('http://localhost:3001/');
    });

    test('should display an error message on update failure', async ({ page }) => {
        // Intercept the GET request to load existing contact details
        await page.route(`**/contact/${contactId}`, async (route) => {
            await route.fulfill({
                status: 200,
                body: JSON.stringify({
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '1234567890',
                }),
            });
        });

        // Intercept the PUT request to simulate an error
        await page.route(`**/contact/${contactId}`, async (route) => {
            await route.fulfill({
                status: 400,
                body: JSON.stringify({ message: 'Error updating contact' }), // Mock error response
            });
        });

        // Fill out the form
        await page.fill('input[name="firstName"]', 'Jane');
        await page.fill('input[name="lastName"]', 'Smith');
        await page.fill('input[name="email"]', 'jane.smith@example.com');
        await page.fill('input[name="phone"]', '0987654321');

        // Click the save button
        await page.click('text=Save');

        // Wait for the error message to be displayed
        const errorMessage = await page.locator('.fixed.bg-red-500');
        await expect(errorMessage).toHaveText('Error updating contact');

        // Optional: Check if the error message disappears after 2 seconds
        await page.waitForTimeout(2000); // Adjust this according to your setTimeout duration
        await expect(errorMessage).toBeHidden();
    });

    test('should navigate to home page on cancel', async ({ page }) => {
        // Click the cancel button
        await page.click('text=Cancel');

        // Assert that the user is redirected back to the home page
        await expect(page).toHaveURL('http://localhost:3001/'); // Adjust according to your redirect
    });
});


test.describe('ListContacts Component', () => {
    test('should fetch and display all contacts', async ({ page }) => {
        const testContacts = [
            { uId: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '1234567890' },
            { uId: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '0987654321' }
        ];

        // Mock the GET request for fetching all contacts
        await page.route('**/contacts', async (route) => {
            await route.fulfill({
                status: 200,
                body: JSON.stringify(testContacts),
            });
        });

        // Navigate to the page where the ListContacts component is rendered
        await page.goto('http://localhost:3001'); // Adjust based on your app's routing

        // Assert that both contacts are displayed
        const contactNames = await page.locator('tbody tr td:first-child').allTextContents();
        expect(contactNames).toEqual(['John', 'Jane']);

        const contactEmails = await page.locator('tbody tr td:nth-child(3)').allTextContents();
        expect(contactEmails).toEqual(['john.doe@example.com', 'jane.smith@example.com']);
    });
});
