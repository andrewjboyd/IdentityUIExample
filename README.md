# IdentityUIExample

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.3.

## Prerequisites

- Node.js and npm
- .NET SDK (for generating SSL certificates)

## Setup

### 1. Install Dependencies

```bash
ng serve
```

### 2. Generate SSL Certificates

This project is configured to run with HTTPS. Generate the required SSL certificates using the .NET CLI:

```bash
dotnet dev-certs https --export-path ./ssl/localhost.pem --format Pem --no-password
```

This will create:

- `ssl/localhost.pem` - The SSL certificate
- `ssl/localhost.key` - The private key

**Note:** The `ssl/` directory is excluded from version control. Each developer needs to generate their own certificates locally.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `https://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.
