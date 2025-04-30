# Pharma Project API Documentation

## Endpoints

### User Registration

**Endpoint:** `/v1/users/register`

**Method:** `POST`

**Description:** Registers a new user.

**Request Body:**
```json
{
  "name": {
    "firstName": "string",
    "lastName": "string"
  },
  "email": "string",
  "password": "string"
}
```

**Required Fields:**
- `name.firstName` (string, required)
- `email` (string, required)
- `password` (string, required)

**Response:**
- **201 Created:** User successfully registered.
- **500 Internal Server Error:** An error occurred during registration.

### User Login

**Endpoint:** `/v1/users/login`

**Method:** `POST`

**Description:** Logs in an existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Required Fields:**
- `email` (string, required)
- `password` (string, required)

**Response:**
- **200 OK:** User successfully logged in. Returns user data, access token, and refresh token.
- **500 Internal Server Error:** An error occurred during login.

### Get User Profile

**Endpoint:** `/v1/users/profile`

**Method:** `GET`

**Description:** Retrieves the profile of the logged-in user.

**Headers:**
- `Authorization`: Bearer token (required)

**Response:**
- **200 OK:** User profile data.
- **401 Unauthorized:** Authentication failed.
- **500 Internal Server Error:** An error occurred while fetching the profile.

### Update User Profile

**Endpoint:** `/v1/users/updateProfile`

**Method:** `PATCH`

**Description:** Updates user profile information

**Authorization:** User authentication required

**Request Body:**
```json
{
  "name": {
    "firstName": "string",
    "lastName": "string"
  },
  "email": "string",
  "address": "string",
  "phone": "string"
}
```

**Response:**
- **200 OK:** Profile updated successfully
- **400 Bad Request:** Invalid input data
- **401 Unauthorized:** Not authenticated
- **409 Conflict:** Email already in use

### Change Password

**Endpoint:** `/v1/users/updatePassword`

**Method:** `PATCH`

**Description:** Changes user password

**Authorization:** User authentication required

**Request Body:**
```json
{
  "currentPassword4": "string",
  "newPassword": "string"
}
```

**Response:**
- **200 OK:** Password changed successfully
- **400 Bad Request:** Invalid old password
- **401 Unauthorized:** Not authenticated

### User Logout

**Endpoint:** `/v1/users/logout`

**Method:** `POST`

**Description:** Logs out the user by invalidating the refresh token.

**Headers:**
- `Authorization`: Bearer token (required)

**Response:**
- **200 OK:** User successfully logged out.
- **401 Unauthorized:** Authentication failed.
- **500 Internal Server Error:** An error occurred during logout.

## Other Functionalities

### Token Generation

- **Access Token:** Generated using `generateAccessToken` method in `user.model.js`.
- **Refresh Token:** Generated using `generateRefreshToken` method in `user.model.js`.

### Middleware

- **User Validation:** Middleware `userValidation` used in the registration route to validate user input.
- **Authentication:** Middleware `authUser` used to protect routes that require authentication.

### Database Connection

- **MongoDB Connection:** Established in `dbConnection.js` using Mongoose.

### Logging

- **Request Logging:** Implemented using Morgan and custom logger in `app.js`.

### Environment Variables

Ensure the following environment variables are set in your `.env` file:
- `MONGO_URI`: MongoDB connection string.
- `ACCESS_TOKEN_SECRET`: Secret key for signing access tokens.
- `ACCESS_TOKEN_EXPIRE`: Expiration time for access tokens.
- `REFRESH_TOKEN_SECRET`: Secret key for signing refresh tokens.
- `REFRESH_TOKEN_EXPIRE`: Expiration time for refresh tokens.

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables in a `.env` file.
4. Start the server: `npm start`

## License

This project is licensed under the MIT License.

## Admin Endpoints

### Add Medicine

**Endpoint:** `/v1/admin/addMedicines`

**Method:** `POST`

**Description:** Adds a new medicine to the inventory.

**Authorization:** Admin access required

**Request Body (multipart/form-data):**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "category": "string",
  "manufacturer": "string",
  "expiryDate": "date",
  "images": "file"
}
```

**Required Fields:**
- All fields are required except images

**Response:**
- **201 Created:** Medicine successfully added
- **400 Bad Request:** Invalid input data
- **401 Unauthorized:** Not authenticated or not an admin
- **500 Internal Server Error:** Server error

### Delete Medicine

**Endpoint:** `/v1/admin/deleteMedicines/:id`

**Method:** `DELETE`

**Description:** Deletes a medicine from the inventory.

**Authorization:** Admin access required

**Parameters:**
- `id`: Medicine ID (in URL path)

**Response:**
- **200 OK:** Medicine successfully deleted
- **400 Bad Request:** Invalid medicine ID
- **401 Unauthorized:** Not authenticated or not an admin
- **404 Not Found:** Medicine not found
- **500 Internal Server Error:** Server error

### Update Medicine

**Endpoint:** `/v1/admin/updateMedicines/:id`

**Method:** `PATCH`

**Description:** Updates medicine details

**Authorization:** Admin access required

**Parameters:**
- `id`: Medicine ID (in URL path)

**Request Body (multipart/form-data):**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "category": "string",
  "manufacturer": "string",
  "expiryDate": "date",
  "images": "file"
}
```

**Response:**
- **200 OK:** Medicine updated successfully
- **400 Bad Request:** Invalid input or ID format
- **401 Unauthorized:** Not authenticated or not admin
- **404 Not Found:** Medicine not found

### Get All Medicines

**Endpoint:** `/v1/admin/products`

**Method:** `GET`

**Description:** Retrieves all medicines from the inventory.

**Authorization:** Admin access required

**Response:**
- **200 OK:** List of all medicines
- **401 Unauthorized:** Not authenticated or not an admin
- **500 Internal Server Error:** Server error

### Get Medicines (User)

**Endpoint:** `/v1/users/products`

**Method:** `GET`

**Description:** Retrieves all available medicines for users

**Authorization:** User authentication required

**Response:**
- **200 OK:** List of medicines
- **401 Unauthorized:** Not authenticated

## Enhanced Security Features

### File Upload

- Added support for image uploads using Multer middleware
- Secure file type validation
- Size limits and storage configuration

### Role-Based Access Control

- Added role verification for admin routes
- Separate middleware for admin authentication

## Updated Environment Variables

Additional environment variables required:
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name for image storage
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## Error Handling

Enhanced error handling for:
- File upload errors
- Invalid medicine data
- Authentication and authorization errors
- Database operation failures

## Response Format

Standard response format for all endpoints:
```json
{
  "success": boolean,
  "message": "string",
  "data": {
    // Response data specific to each endpoint
  }
}
```

## Inquiry System Endpoints

### Create Inquiry

**Endpoint:** `/v1/inquiry`

**Method:** `POST`

**Description:** Creates a new inquiry/query

**Authorization:** User authentication required

**Request Body:**
```json
{
  "subject": "string",
  "message": "string"
}
```

**Required Fields:**
- `subject` (string, required)
- `message` (string, required)

**Response:**
- **201 Created:** Inquiry created successfully
- **400 Bad Request:** Invalid input data
- **401 Unauthorized:** Not authenticated
- **500 Internal Server Error:** Server error

### Get User's Inquiries

**Endpoint:** `/v1/inquiry/my-inquiries`

**Method:** `GET`

**Description:** Retrieves all inquiries made by the logged-in user

**Authorization:** User authentication required

**Response:**
- **200 OK:** List of user's inquiries
- **401 Unauthorized:** Not authenticated
- **500 Internal Server Error:** Server error

### Admin: Get All Inquiries

**Endpoint:** `/v1/inquiry/admin/all`

**Method:** `GET`

**Description:** Retrieves all user inquiries (Admin only)

**Authorization:** Admin authentication required

**Response:**
- **200 OK:** List of all inquiries with user details
- **401 Unauthorized:** Not authenticated or not admin
- **500 Internal Server Error:** Server error

### Admin: Answer Inquiry

**Endpoint:** `/v1/inquiry/admin/answer/:id`

**Method:** `PUT`

**Description:** Submit admin's response to a user inquiry

**Authorization:** Admin authentication required

**Parameters:**
- `id`: Inquiry ID (in URL path)

**Request Body:**
```json
{
  "response": "string"
}
```

**Response:**
- **200 OK:** Response submitted successfully
- **400 Bad Request:** Invalid input data
- **401 Unauthorized:** Not authenticated or not admin
- **404 Not Found:** Inquiry not found
- **500 Internal Server Error:** Server error

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables in a `.env` file.
4. Start the server: `npm start`

## License

This project is licensed under the MIT License.