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
5. [Features](#features)
   - [Guest](#gift-cardpurchase)
   - [Partner](#partner)
   - [Admin panel](#admin)
   - [API](#api)
6. [Techs we used](#techs-we-used)
   - [Pdf generation](#pdf-generation)
   - [Payment solution](#payment-solution)
   - [Back-end solution](#back-end-solution)
   - [Front-end solution](#front-end-solution)
7. [Commands in terminal](#commands-in-terminal)
8. [Contributing](#contributing)
9. [License](#license)

---

## Introduction

Welcome to the documentation for **Gift Card App**. This project aims to provide an ergonomic and easy-to-use solution for managing a gift card system, from purchase to redemption.

## Installation

To install the project, use the following commands (you will need Docker on your machine):

```sh
docker compose -f docker-compose.local.yml up -d
npm install
node ace generate:key
node ace migration:run
```

## Configuration

#### Environment Variables

The list of needed environment variables are available in the **.env.example** :

- **HOST/PORT**: host and port of your app
- **NODE_ENV**: development in local, production when deployed
- **DB_HOST/PORT/USER/PASSWORD/DATABASE**: db credentials
- **STRIPE_PUBLIC_KEY/SECRET_KEY/WEBHOOK_SECRET_KEY**: Stripe credentials (if you are using the default payment service)
- **SMTP_HOST/PORT/USERNAME/PASSWORD**: mailer credentials
- **VITE_APP_NAME**: Title of your app in browser tabs
- **SENTRY_DSN**: Url to log errors to Sentry (optional)

#### Gift Card template

A default template is available in public/templates. We currently use [Carbone](https://carbone.io/) to generate gift card PDFs, but you can change the technology by creating your own generation service and setting it as the default PDF generation service in providers/app_provider.ts .

#### Configuration File

Modify the `config/settings.ts` file to include your own app configuration.

## Usage

#### Starting the Server

To start the development server, run:

```sh
npm run server
```

#### Accessing the Interface

During your first login, you will need to create a store.
To create this store, you can access the admin panel by creating an administrator from the terminal (see the [Commands](#commands) section).

After creating this administrator, go to the admin console at /admin. Navigate to "Boutiques" and create a store.

Once the store is created, you can create a partner in the "Partenaires" section.
Your partner must have an email address that belongs to you in order to receive the password creation email.
You can then log in as a partner (after logging out from the admin space) at /partner.

To test the partner functionality for gift cards, you can go to /gift-card/purchase to make a test purchase and receive it via email, or create one in the admin panel.

## Features

#### /gift-card/purchase

This is where customers can purchase gift cards.

#### /partner

The **/partner** path provides access to the partner dashboard, which includes:

- Home: Overview of gift card activity.
- Shop: View your store, your team, and all gift card transactions related to your store.
- Account: View your account information, update your password, and log out.

#### /admin

The **/admin** path provides access to the admin panel, which includes:

- **Partners**: List/Create/Update
- **Gift cards**: List/Create/Update/Send via email
- **Shops**: List/Create/Update
- **Transactions**: List
- **Admins**: List/Send password reset email
  You can implement your own configuration in the /config/admin folder

#### API

The API provides endpoints to receive the payment status of the order, and to send gift cards via email. By default, the implemented payment service is Stripe, but you can use any service of your choice by creating your own service and defining it as the payment service in `providers/app_provider`.

## Techs we used

#### Pdf generation

We used [Carbone.io](https://carbone.io) to generate PDF gift cards in our application. Carbone is a powerful template-based document generator that takes JSON data and injects it into templates to create PDFs, DOCX, and more. It’s fast, flexible, and ideal for generating dynamic and styled documents.

#### Payment solution

We used [Stripe](https://stripe.com) to handle payments in our application. Stripe is a powerful and secure payment platform that supports a wide range of payment methods. Its developer-friendly API, extensive documentation, and built-in support for webhooks make it easy to integrate and manage transactions, subscriptions, and payouts with reliability and flexibility.

#### Back-end solution

We used AdonisJS to build the backend of our application. It’s a full-stack Node.js framework that offers a clean, structured approach to web development. With built-in routing, authentication, and ORM, plus TypeScript support, AdonisJS ensures productivity, and stability.

#### Front-end solution

We used Mantine to build the frontend of our application. Mantine is a modern React component library that offers a rich set of accessible, customizable UI elements. With built-in hooks, dark mode support, and responsive components, it allows fast and consistent interface development while maintaining a clean and developer-friendly experience.

## Commands in terminal

Create an admin: `node ace admin:create`
Reset an admin password (when you cant access to the admin console): `node ace admin:reset_password`

## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

For more detailed information, please refer to the project's [GitHub repository](https://github.com/pulsation-studio/gift-card-app).
