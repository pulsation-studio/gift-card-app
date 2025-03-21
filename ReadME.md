# Documentation de l'application de cartes cadeaux

## Table des matières

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Configuration](#configuration)
   - [Variables d’environnement](#variables-denvironnement)
   - [Fichier de configuration](#fichier-de-configuration)
   - [Template de carte cadeau](#template-de-carte-cadeau)
4. [Utilisation](#utilisation)
   - [Démarrer le serveur](#démarrer-le-serveur)
   - [Accéder à l’interface](#accéder-à-linterface)
5. [Fonctionnalités](#fonctionnalités)
   - [Invité](#gift-cardpurchase)
   - [Partenaire](#partner)
   - [Panneau d’administration](#admin)
   - [API](#api)
6. [Technologies utilisées](#technologies-utilisées)
   - [Génération de PDF](#génération-de-pdf)
   - [Solution de paiement](#solution-de-paiement)
   - [Backend](#backend)
   - [Frontend](#frontend)
7. [Commandes terminal](#commandes-terminal)
8. [Contribuer](#contribuer)
9. [Licence](#licence)

---

[Link to english version of this ReadME](ReadME.en.md)

## Introduction

Bienvenue dans la documentation de **Gift Card App**.  
Ce projet vise à offrir une solution ergonomique et facile d’utilisation pour gérer un système de cartes cadeaux, de l’achat à l’utilisation.

## Installation

Pour installer le projet, utilisez les commandes suivantes (vous aurez besoin de Docker sur votre machine) :

```sh
docker compose -f docker-compose.local.yml up -d
npm install
node ace generate:key
node ace migration:run
```

## Configuration

#### Variables d’environnement

La liste des variables d’environnement nécessaires est disponible dans le fichier **.env.example** :

- **HOST/PORT** : hôte et port de votre application
- **NODE_ENV** : `development` en local, `production` en production
- **DB_HOST/PORT/USER/PASSWORD/DATABASE** : identifiants de la base de données
- **STRIPE_PUBLIC_KEY/SECRET_KEY/WEBHOOK_SECRET_KEY** : clés Stripe (si vous utilisez le service de paiement par défaut)
- **SMTP_HOST/PORT/USERNAME/PASSWORD** : identifiants pour l’envoi d’emails
- **VITE_APP_NAME** : titre de votre application affiché dans l’onglet du navigateur
- **SENTRY_DSN** : URL pour enregistrer les erreurs sur Sentry (optionnel)

#### Template de carte cadeau

Un template par défaut est disponible dans le dossier `public/templates`.  
Nous utilisons actuellement [Carbone](https://carbone.io/) pour générer les PDF des cartes cadeaux, mais vous pouvez remplacer cette technologie en créant votre propre service de génération de PDF et en le définissant comme service par défaut dans `providers/app_provider.ts`.

#### Fichier de configuration

Modifiez le fichier `config/settings.ts` pour inclure la configuration spécifique à votre application.

## Utilisation

#### Démarrer le serveur

Pour lancer le serveur en mode développement, exécutez :

```sh
npm run server
```

#### Accéder à l’interface

Lors de votre première connexion, vous devrez créer une boutique.  
Pour cela, accédez au panneau d’administration en créant un administrateur via le terminal (voir la section [Commandes](#commandes-terminal)).

Une fois l’administrateur créé, accédez à la console d’administration à l’adresse `/admin`.  
Rendez-vous dans l’onglet **"Boutiques"** pour créer une boutique.

Une fois la boutique créée, vous pouvez ajouter un partenaire depuis la section **"Partenaires"**.  
Ce partenaire doit disposer d’une adresse email vous appartenant pour recevoir l’email de création de mot de passe.  
Vous pouvez ensuite vous connecter en tant que partenaire (après vous être déconnecté de l’espace admin) à l’adresse `/partner`.

Pour tester le fonctionnement des cartes cadeaux côté partenaire, vous pouvez vous rendre sur `/gift-card/purchase` pour effectuer un achat test et le recevoir par email, ou en créer une depuis le panneau d’administration.

## Fonctionnalités

#### `/gift-card/purchase`

C’est ici que les clients peuvent acheter des cartes cadeaux.

#### `/partner`

Le chemin **/partner** donne accès au tableau de bord partenaire, qui comprend :

- **Accueil** : vue d’ensemble de l’activité des cartes cadeaux
- **Boutique** : consulter votre boutique, votre équipe, ainsi que toutes les transactions liées aux cartes cadeaux
- **Compte** : consulter vos informations, modifier votre mot de passe, et vous déconnecter

#### `/admin`

Le chemin **/admin** donne accès au panneau d’administration, qui permet de :

- **Partenaires** : lister / créer / modifier
- **Cartes cadeaux** : lister / créer / modifier / envoyer par email
- **Boutiques** : lister / créer / modifier
- **Transactions** : lister
- **Administrateurs** : lister / envoyer un email de réinitialisation de mot de passe

Vous pouvez personnaliser la configuration dans le dossier `/config/admin`.

#### API

L’API fournit des endpoints pour recevoir le statut de paiement d’une commande et pour envoyer des cartes cadeaux par email.  
Par défaut, le service de paiement intégré est Stripe, mais vous pouvez utiliser n’importe quel autre service en créant le vôtre et en le définissant comme service par défaut dans `providers/app_provider`.

## Technologies utilisées

#### Génération de PDF

Nous utilisons [Carbone.io](https://carbone.io) pour générer les cartes cadeaux PDF dans notre application.  
Carbone est un puissant moteur de génération de documents basé sur des templates. Il prend des données JSON et les insère dans des modèles pour produire des fichiers PDF, DOCX, etc.  
C’est rapide, flexible, et idéal pour générer des documents dynamiques et stylisés.

#### Solution de paiement

Nous utilisons [Stripe](https://stripe.com) pour gérer les paiements dans notre application.  
Stripe est une plateforme de paiement puissante et sécurisée qui prend en charge un large éventail de moyens de paiement.  
Son API conviviale, sa documentation complète et sa prise en charge des webhooks permettent une intégration simple et une gestion fiable des transactions, abonnements et paiements.

#### Solution back-end

Nous avons utilisé **AdonisJS** pour développer le back-end de notre application.  
C’est un framework Node.js full-stack qui offre une architecture claire et structurée.  
Avec le routage, l’authentification et l’ORM intégrés, ainsi que le support TypeScript, AdonisJS garantit productivité et stabilité.

#### Solution front-end

Nous avons utilisé **Mantine** pour construire le front-end de notre application.  
Mantine est une bibliothèque moderne de composants React offrant un ensemble riche d’éléments UI accessibles et personnalisables.  
Grâce à ses hooks intégrés, son support du mode sombre et ses composants responsives, elle permet un développement rapide, cohérent et agréable.

## Commandes terminal

Créer un administrateur : `node ace admin:create`
Réinitialiser un mot de passe admin (quand vous ne pouvez pas accéder à l'espace administrateur): `node ace admin:reset_password`

## Contribuer

Les contributions sont les bienvenues !  
Veuillez lire notre fichier [CONTRIBUTING.md](CONTRIBUTING.md) pour commencer.

## Licence

Ce projet est sous licence MIT.  
Consultez le fichier [LICENSE](LICENSE) pour plus de détails.

---

Pour plus d'informations, veuillez consulter le [dépôt GitHub du projet](https://github.com/pulsation-studio/gift-card-app).
