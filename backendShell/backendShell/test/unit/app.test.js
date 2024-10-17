/**
 * Author: Uma Sambathkumar
 * Date: 2024-10-16
 * Description: Unit Testing for CRED Operations -Contact using jest
 */

const request = require('supertest');
const app = require('../../src/handler');
const Contact = require('../../src/model/model');

/*Mock the Contact model*/
jest.mock('../../src/model/model');
jest.mock('../../src/databaseConnection/db')

describe('API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('GET / should return a greeting message', async () => {
    const response = await request(app).get('/health_check');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Health Check" });
  });

  it('POST /contact should create a new contact', async () => {
    const newContact = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      email: 'john@example.com',
    };

    Contact.prototype.save = jest.fn().mockResolvedValue({
      ...newContact,
      uId: 'some-unique-id',
      createdAt: Date.now(),
      softDeleteFlag: 1,
    });

    const response = await request(app).post('/contact').send(newContact);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Contact created successfully!');
    expect(response.body.contact).toHaveProperty('uId'); // Check if uId is returned
    expect(response.body.contact.firstName).toBe(newContact.firstName);
  });

  it('GET /contacts should return all contacts', async () => {
    const mockContacts = [
      { firstName: 'John', lastName: 'Doe', phone: '1234567890', email: 'john@example.com' },
    ];

    Contact.find = jest.fn().mockResolvedValue(mockContacts);

    const response = await request(app).get('/contacts');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockContacts);
  });

  it('GET /contact/:uId should return a specific contact', async () => {
    const mockContact = { firstName: 'Jane', lastName: 'Doe', phone: '0987654321', email: 'jane@example.com', uId: 'some-unique-id' };

    Contact.findOne = jest.fn().mockResolvedValue(mockContact);

    const response = await request(app).get(`/contact/${mockContact.uId}`);
    expect(response.status).toBe(200);
    expect(response.body.firstName).toBe('Jane');
  });

  it('PUT /contact/:uId should update a specific contact', async () => {
    const mockContact = { firstName: 'John', lastName: 'Doe', phone: '1234567890', email: 'john@example.com', uId: 'some-unique-id' };
    const updatedContact = {
      firstName: 'Johnathan',
      lastName: 'Doe',
      phone: '0987654321',
      email: 'johnathan@example.com',
    };

    Contact.findOneAndUpdate = jest.fn().mockResolvedValue({ ...mockContact, ...updatedContact });

    const response = await request(app).put(`/contact/${mockContact.uId}`).send(updatedContact);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Contact updated successfully!');
    expect(response.body.contact.firstName).toBe('Johnathan');
  });

  it('DELETE /contact/:uId should soft delete a specific contact', async () => {
    const mockContact = { firstName: 'Jane', lastName: 'Doe', phone: '1234567890', email: 'jane@example.com', uId: 'some-unique-id' };

    Contact.findOneAndUpdate = jest.fn().mockResolvedValue(mockContact);

    const response = await request(app).delete(`/contact/${mockContact.uId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Contact soft deleted successfully!');
  });

  it('GET /contact should search for contacts', async () => {
    const mockContact = { firstName: 'John', lastName: 'Doe', phone: '1234567890', email: 'john@example.com' };

    Contact.find = jest.fn().mockResolvedValue([mockContact]);

    const response = await request(app).get('/contact?text=John');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

});
