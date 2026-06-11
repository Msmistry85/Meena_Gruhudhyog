# Meena Gruhudyog - Database Integration Setup

## Backend Setup for Contact Storage

This guide helps you set up the Microsoft SQL Server database and backend server for contact submissions.

### Prerequisites

- Node.js (v16 or higher)
- Microsoft SQL Server (Express or Developer edition)
- npm

### Installation Steps

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Database Setup

Use SQL Server Management Studio, Azure Data Studio, or `sqlcmd` to run the schema file.

**Option A: Using SQL Server Management Studio**

1. Open SSMS and connect to your SQL Server instance.
2. Open `database/schema.sql`.
3. Execute the script.

**Option B: Using sqlcmd**

```bash
sqlcmd -S localhost\\SQLEXPRESS -i database/schema.sql
```

#### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` with your SQL Server settings:
   ```ini
   DB_HOST=localhost
   DB_INSTANCE=SQLEXPRESS
   DB_NAME=meena_gruhudyog
   DB_DRIVER=msnodesqlv8
   DB_TRUSTED_CONNECTION=true
   DB_TRUST_SERVER_CERTIFICATE=true
   # DB_USER=sa
   # DB_PASSWORD=your_password
   # DB_PORT=1433
   PORT=3000
   ```

> If you use SQL Server authentication, set `DB_TRUSTED_CONNECTION=false` and provide `DB_USER`/`DB_PASSWORD`.

#### 4. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start at `http://localhost:3000`

### Database Schema

**contacts table**:
- `id` - Primary key
- `name` - Customer name
- `email` - Customer email
- `category` - Product category (soap/shampoo)
- `product` - Selected product
- `quantity` - Quantity ordered
- `message` - Customer message
- `created_at` - Submission timestamp
- `status` - Contact status (new/contacted/completed/rejected)
- `notes` - Internal notes
- `updated_at` - Last update timestamp

**products table**:
- Reference data for available products

### API Endpoints

#### Submit Contact Form
- **POST** `/api/contacts/submit`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "category": "soap",
    "product": "lavender-soap",
    "quantity": 2,
    "message": "I would like to order..."
  }
  ```

#### Get All Contacts (Admin)
- **GET** `/api/contacts/list`
- Returns all submitted contacts

#### Get Contact by ID
- **GET** `/api/contacts/:id`
- Returns specific contact details

#### Update Contact Status
- **PATCH** `/api/contacts/:id/status`
- **Body**:
  ```json
  {
    "status": "contacted"
  }
  ```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | SQL Server host | localhost |
| `DB_INSTANCE` | SQL Server named instance | SQLEXPRESS |
| `DB_NAME` | Database name | meena_gruhudyog |
| `DB_DRIVER` | mssql driver | msnodesqlv8 |
| `DB_TRUSTED_CONNECTION` | Use Windows authentication | true |
| `DB_TRUST_SERVER_CERTIFICATE` | Trust server certificate | true |
| `DB_USER` | SQL Server username | (optional) |
| `DB_PASSWORD` | SQL Server password | (optional) |
| `DB_PORT` | SQL Server port | 1433 |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |

### Troubleshooting

**Error: "Failed to connect to ..."**
- Confirm SQL Server is running.
- Verify `DB_HOST` and `DB_INSTANCE` in `.env`.
- If using SQL authentication, set `DB_TRUSTED_CONNECTION=false` and provide `DB_USER`/`DB_PASSWORD`.
- Check that the database `meena_gruhudyog` exists and the SQL instance accepts connections.

**Error: "EADDRINUSE: address already in use"**
- Port 3000 is already in use.
- Change `PORT` in `.env` or stop the process using port 3000.

**Error: "Unknown database"**
- Run `database/schema.sql` against your SQL Server instance.
- Check `DB_NAME` in `.env`.

### File Structure

```
soap/
├── server.js              # Main server file
├── package.json           # Node.js dependencies
├── .env.example           # Environment variables template
├── .env                   # Environment variables (create from .env.example)
├── database/
│   └── schema.sql         # SQL Server schema and seed data
├── server/
│   ├── db.js              # Database connection pool
│   └── routes/
│       └── contacts.js    # Contact endpoints
└── index.html             # Frontend files...
```

### Running with PM2 (Production)

```bash
npm install -g pm2
pm2 start server.js --name "meena-gruhudyog"
pm2 save
pm2 startup
```

### Security Notes

- Never commit `.env` to version control.
- Use strong database passwords.
- Consider adding authentication for admin endpoints.
- Validate all user input (already implemented with express-validator).

### Support

For issues or questions, please refer to the project documentation.
