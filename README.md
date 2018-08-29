# help-in-need-bot

Say hello to the first humanitarian **bot**... This bot will allow to empower, help and bring communities together.

**Warning**
> Can't get the permissions necessary for making it public, Facebook asks for a Business verification. This is for the Hackaton, not for comercial use.

# Description

This is the source-code for a `Facebook Messenger Chat Bot` that is going to empower, help and bring communities together. 

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44757808-555bcb00-ab07-11e8-86d3-a7c30919210c.PNG" width="350">
</kbd>

# Developers Circles

This project was made for the Community Challenge of [Facebook Developers Circles](https://devcommunitychallenge.devpost.com)

<kbd>
    <img width="279" alt="captura de pantalla 2018-08-15 a la s 19 37 18" src="https://user-images.githubusercontent.com/4379982/44177165-03f11c00-a0c3-11e8-8dca-35d031f8c5c9.png">
</kbd>

## Regional Winner

On 08-15-18 we won the third place on Latin America:

<kbd>
    <img width="588" alt="captura de pantalla 2018-08-15 a la s 19 40 48" src="https://user-images.githubusercontent.com/4379982/44177196-208d5400-a0c3-11e8-84a1-4c01140643d5.png">
</kbd>

## Updates since 08-15-18 to 08-30-18 (World Round)

### Migrating from a Memory Database

We migrated our database from a Memory Base to a MongoDB. We implemented the [mLab](https://mlab.com/) online service that provide a Free MongoDB Database.

- Generate Schemas
- Creation of Script for Inserts and Deletions
- Implement MongoDB NPM Dependency

### Implementation of a Web App

We created a Web Application that can show you all the locations reported from a MongoDB Database. For doing that we did the following tasks:

- Creating an Express Application
- Implemented a View Engine ([Handlebars](https://handlebarsjs.com/))
- Google Maps API Integration

### Static Maps on Bot

To improve the help process, we change the link to Google Maps for an static image map that can show you your location and the nearest locations reported. To accomplish this we implemented:

- [MapQuest](https://developer.mapquest.com/)

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44757801-542a9e00-ab07-11e8-8888-52d660ea16c8.JPG" width="350">
</kbd>

### Posts on Facebook Page

We also implement the [FB Graphic API](https://developers.facebook.com/docs/graph-api/) to post on our Facebook Page when a user reports a location. This can trigger a notification to users following our Page.

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44758880-4e37bb80-ab0d-11e8-9492-a26a25342034.png">
</kbd>

## How

This bot will empower members of the community by fostering help for each other. If you want to help someone, all you have to do is open Facebook Messenger and search for "Help In Need". Once a conversation is started, you will be able to choose:

- Report the location of someone in need
- Help someone close to you

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44757804-54c33480-ab07-11e8-82bf-146c9fe13ee7.PNG" width="350">
</kbd>

### Report

When the options appear you will be able to choose `Report`. Once you choose this option, you will see a button (`Send Location`) to share the location of someone in need.

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44757807-555bcb00-ab07-11e8-8e91-0424fc27636f.PNG" width="350">
</kbd>

If you are close to the person, just share your current location. You can search for the locaction by address or drag a waypoint on map.

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44757800-542a9e00-ab07-11e8-8aba-d4c73c55edf9.PNG" width="350">
</kbd>

That's it! Now other people or organizations can find and assist them!

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44757805-54c33480-ab07-11e8-8e03-d8ee74ce2977.PNG" width="350">
</kbd>

### Help

You can also search for people in need around you so that you can provide help. When the options appear, you choose the option `Help`. 

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44757806-555bcb00-ab07-11e8-9b39-d0df5cffe5f6.PNG" width="350">
</kbd>

So, using our database any person or organization could use this information to help someone in need.

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44757799-542a9e00-ab07-11e8-85d6-ee648249ca9f.PNG" width="350">
</kbd>

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44757803-54c33480-ab07-11e8-918a-bb4363d3d2f9.PNG" width="350">
</kbd>

We provide an Static Image generated from an integration with MapQuest](https://developer.mapquest.com/). This photo will show your location with a **red** marker. And it is going to show the 5 near locations with **violets** markers.

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44757801-542a9e00-ab07-11e8-8888-52d660ea16c8.JPG" width="350">
</kbd>

We are also providing a link yo our Web Page that is going to show the map in the location that you share. This will show you the nearest locations:

<img src="https://user-images.githubusercontent.com/4379982/44757802-54c33480-ab07-11e8-90ff-38f213a260aa.PNG" width="350">

### Text Intelligence

We also provide a text parser that can identify keywords to detect if you want to report or help:

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44757798-542a9e00-ab07-11e8-9bf6-15ce3fd0d472.PNG" width="350">
</kbd>

<kbd>
    <img src="https://user-images.githubusercontent.com/4379982/44757797-53920780-ab07-11e8-92bf-46ff02c28e8a.PNG" width="350">
</kbd>

# Home Page

We also have a [Home Page](https://help-in-need.now.sh/). In this homepage you can visualize all the locations that have been reported using the Help In Need Bot.

<kbd>
    <img width="1440" alt="captura de pantalla 2018-08-28 a la s 20 56 10" src="https://user-images.githubusercontent.com/4379982/44757348-f8f7ac00-ab04-11e8-83bc-bc6b3a29ec47.png">
</kbd>

## Current Reports

We count with a World Report Count on the right side of the page:

<kbd>
    <img width="246" alt="captura de pantalla 2018-08-28 a la s 22 00 04" src="https://user-images.githubusercontent.com/4379982/44758980-bf776e80-ab0d-11e8-9afa-3a96c0b8024f.png">
</kbd>

## Customer Chat Plugin

We also count with an implementation of the [Customer Chat Plugin](https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/).

<img width="396" alt="captura de pantalla 2018-08-28 a la s 20 58 40" src="https://user-images.githubusercontent.com/4379982/44757387-2a707780-ab05-11e8-83b2-caca9cdbd3e8.png">

## Integrations

For creating this [Home Page](https://help-in-need.now.sh/) we have implemented the next technologies:

- [Google Maps API](https://cloud.google.com/maps-platform/?hl=es) (Map on HomePage)
- [MapQuest](https://developer.mapquest.com/) (Static Maps on Bot)
- [FB Graphic API](https://developers.facebook.com/docs/graph-api/) (Automatic posting on FB Page)
- [Customer Chat Plugin](https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/)

# Technical Spoilers

Just read the code, don't be lazy. Just kidding. This application was done using the next technologies:

- NodeJS
- MongoDB: Save Locations
- Google Maps API: Show map on Page
- MapQuest: Image from maps on Bot and on Facebook Page
- Express

This are the main packages that we are using:

- Facebook API: [FB](https://www.npmjs.com/package/fb).

## Install

### Application

Then, comes the **easy** thing:

```bash
npm install
```

Done!

### Database

To run a MongoDB locally we encourage to use Docker:

```bash
docker run --name mongo -p 27017:27017 -d mongo
```

### Hosts

If you wan't to run the "main" page locally, you need to add the next entry on `/etc/hosts`:

```bash
127.0.0.1           help-in-need.com
```

Why?. Facebook doesn't allow to run the `Customer Chat Plugin` on a `localhost` domain.

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

## Database

We are currently using mLab to host the database. mLab is a free solution.

- [mLab](https://mlab.com/)

## License

Released under the terms of the MIT license.

# About

- [Ariel Rey](https://github.com/arielfr/)
- [Horacio Lopez](https://github.com/hdlopez/)
