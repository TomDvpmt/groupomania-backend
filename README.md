<center>

![Logo de l'application Groupomania](/readme/logo/groupomania-logo.png)

</center>

# Contexte

Projet réalisé en 2023 dans le cadre de la formation "Développeur web" d'OpenClassrooms.

# Résumé

**Groupomania** est un réseau social d'entreprise avec forum et chat en temps réel.

Le projet consistait à créer le back-end et le front-end de l'application, en utilisant une **base de données**, un **framework JavaScript** et un **state manager**.

# Dépôts

Ce dépôt contient uniquement le **back-end** de l'application.

Le front-end : [https://github.com/TomDvpmt/groupomania-frontend](https://github.com/TomDvpmt/groupomania-frontend)

# Technologies utilisées

-   MySQL (sans ORM)
-   JavaScript
-   Node.js
-   Express
-   Bcrypt
-   JWT
-   Multer
-   Socket.io

# Fonctionnalités

-   forum avec posts et commentaires
-   possibilité de poster des images (Multer)
-   système de likes
-   chat en temps réel (Socket.io)

# Captures

<center>

![Page forum de Groupomania](/readme/captures/groupomania-forum.webp)

</center>

<center>

![Page chat de Groupomania](/readme/captures/groupomania-chat.webp)

</center>

# Installation

-   Installer MySQL en suivant [ces instructions](https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7152681-installez-le-sgbd-mysql).

-   Dans le répertoire racine de l'application, créer un fichier `.env` contenant les instructions suivantes, avec les noms d'utilisateur et mot de passe à remplacer par les données relatives à votre installation de MySQL (supprimer les balises `<>`), et la phrase de création du token à remplacer par une phrase de votre choix :

```
PORT=3000
DB_HOST=localhost
DB_NAME=groupomania
DB_USER=<nom d'utilisateur>
DB_PASSWORD=<mot de passe>
TOKEN_CREATION_PHRASE=<choisir une phrase complexe>
CHAT_POSTS_LIMIT=100
```

-   Toujours dans le répertoire racine, exécuter la commande :

`npm install`

# Lancement du serveur

-   Dans le répertoire racine, exécuter la commande :

`npm start`

# Configuration

Pour changer le nombre maximum de messages affichés dans le chat :

-   dans le fichier `.env`, changer la valeur de `CHAT_POSTS_LIMIT`,
