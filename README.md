# help-in-need-bot

Say hello to the first humanitarian **bot**... This bot will allow to empower, help and bring communities together.

# Developers Circles

This project was made for the Community Challenge of [Facebook Developers Circles](https://devcommunitychallenge.devpost.com)

# Description

This is the source-code for a `Facebook Messenger Chat Bot` that is going to empower, help and bring communities together. How?

## How

This bot will bring help to people in street situations. If you see someone, all you have to do is open Facebook Messenger and search for "Help In Need". Once started a conversation you will be able to choose:

- Reporting sighting of someone in street situation
- Help someone close to you

### Report

Once the options appear you will choose `Report`. Below you will see an option to share a location.

[SCREENSHOT]

In case you are seeing this person share your current location. If it was someone you saw while driving or you could not use your phone at that time, it reports the location where you were.

[SCREENSHOT]

Ready, that's easy. Now another person can help you.

### Help

Una vez que aparezcan las opciones vas a elegir `Help`. A continuación veras una opción para compartir una ubicación.

[SCREENSHOT]

Esto hara que nuestro `engine` de ubicaciones permita encontrar alguien cerca tuyo para que puedas ayudar (radio de 5 kilometros). Si nuestro motor de ubicaciones encuentra a alguien que necesite ayuda cerca tuyo te dara los links necesarios para que puedas ayudarlo.

[SCREENSHOT]

Ahora puedes ir a ayudarlo!

## Technical Spoilers

Just read the code, don't be lazy. Just kidding. This application was done using **NodeJS**. This are the main packages that we are using:

- Facebook API: [FB](https://www.npmjs.com/package/fb).

To upload the attachments we are manually doing the **request**.

## Install

### Application

Then, comes the **easy** thing:

```bash
npm install
```

Done! Easy...

#### Start (Production)

```bash
npm start
```

#### Start (Development)

If you start the application this way, you are not going to be posting messages on Facebook

```bash
npm start-dev
```

## Deployment

This application is currently deployed on a Zeit ([now.sh](http://now.sh)). It already have the configurations on `now.json` file.

If you want to deploy it, you just need to execute:

```bash
now
```

You can find it currently here:

[https://help-in-need.now.sh](https://help-in-need.now.sh)

## License

Released under the terms of the MIT license.

# About

- [Ariel Rey](https://github.com/arielfr/)
- [Horacio Lopez](https://github.com/hdlopez/)
