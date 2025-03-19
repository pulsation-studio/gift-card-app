# Gift Card App Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Configuration](#configuration)
   - [Environment Variables](#environment-variables)
   - [Configuration File](#configuration-file)
   - [Gift Card template](#gift-card-template)
4. [Usage](#usage)
   - [Starting the Server](#starting-the-server)
   - [Accessing the Interface](#accessing-the-interface)
5. [API](#api)
   - [Payment Status](#payment-status)
6. [Commands](#commands)
7. [Contributing](#contributing)
8. [License](#license)

---

## Introduction

> Welcome to the documentation for **Gift Card App**. This project aims to provide an ergonomic and easy-to-use solution for managing a gift card system, from purchase to redemption.

## Installation

> To install the project, use the following commands (you will need Docker on your machine):

```sh
docker compose -f docker-compose.local.yml up -d
npm install
node ace generate:key
node ace migration:run
```

## Configuration

#### Environment Variables

> The list of needed environment variables are available in the **.env.example** :

> - **HOST/PORT**: host and port of your app
> - **NODE_ENV**: development in local, production when deployed
> - **DB_HOST/PORT/USER/PASSWORD/DATABASE**: db credentials
> - **STRIPE_PUBLIC_KEY/SECRET_KEY/WEBHOOK_SECRET_KEY**: Stripe credentials (if you are using the default payment service)
> - **SMTP_HOST/PORT/USERNAME/PASSWORD**: mailer credentials
> - **VITE_APP_NAME**: Title of your app in browser tabs
> - **SENTRY_DSN**: Url to log errors to Sentry (optional)

#### Gift Card template

> A default template is available in public/templates. We currently use Carbone to generate gift card PDFs, but you can change the technology by creating your own generation service and setting it as the default PDF generation service in providers/app_provider.ts .

#### Configuration File

> Modify the `config/settings.ts` file to include your own app configuration.

## Usage

#### Starting the Server

> To start the development server, run:
>
> ```sh
> npm run server
> ```

#### Accessing the Interface

> During your first login, you will need to create a store.
> To create this store, you can access the admin panel by creating an administrator from the terminal (see the [Commands](#commands) section).

> After creating this administrator, go to the admin console at /admin. Navigate to "Boutiques" and create a store.

> Once the store is created, you can create a partner in the "Partenaires" section.
> Your partner must have an email address that belongs to you in order to receive the password creation email.
> You can then log in as a partner (after logging out from the admin space) at /partner.

> To test the partner functionality for gift cards, you can go to /gift-card/purchase to make a test purchase and receive it via email, or create one in the admin panel.

## API

[^1]: This is the footnote.

#### Payment Status

> The API provides endpoints to receive the payment status of the order, and to send gift cards via email. By default, the implemented payment service is Stripe, but you can use any service of your choice by creating your own service and defining it as the payment service in `providers/app_provider`.

## Commands

> Create an admin: `node ace admin:create`
> Reset an admin password (when you cant access to the admin console): `node ace admin:reset_password`

## Contributing

> We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## License

> This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

For more detailed information, please refer to the project's [GitHub repository](https://github.com/pulsation-studio/gift-card-app).
