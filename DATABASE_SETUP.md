# Meena Gruhudyog - Database Integration Setup

## Backend Setup for Contact Storage

This guide will help you set up the SQL database and backend server for storing contact submissions.

### Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v5.7 or higher)
- npm

### Installation Steps

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Database Setup

**Option A: Using MySQL CLI**

```bash
mysql -u root -p < database/schema.sql
```

**Option B: Manual Setup**

1. Open MySQL Workbench or phpMyAdmin
2. Create a new database: `CREATE DATABASE meena_gruhudyog;`
3. Run the SQL commands from `database/schema.sql`

#### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=meena_gruhudyog
   DB_PORT=3306
   PORT=3000
   ```

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
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | (empty) |
| `DB_NAME` | Database name | meena_gruhudyog |
| `DB_PORT` | MySQL port | 3306 |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |

### Troubleshooting

**Error: "Can't connect to MySQL server"**
- Ensure MySQL is running
- Check host, user, and password in `.env`
- Verify database exists

**Error: "EADDRINUSE: address already in use"**
- Port 3000 is already in use
- Change `PORT` in `.env` or kill the process using port 3000

**Error: "Unknown database"**
- Run schema.sql to create the database
- Check database name in `.env`

### File Structure

```
soap/
├── server.js              # Main server file
├── package.json           # Node.js dependencies
├── .env.example           # Environment variables template
├── .env                   # Environment variables (create from .env.example)
├── database/
│   └── schema.sql         # Database schema and seed data
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

- Never commit `.env` to version control
- Use strong database passwords
- Consider adding authentication for admin endpoints
- Validate all user input (already implemented with express-validator)

### Support

For issues or questions, please refer to the project documentation.
