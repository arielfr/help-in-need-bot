# help-in-need-bot

Say hello to the first humanitarian **bot**... This bot will allow to empower, help and bring communities together.

# Developers Circles

This project was made for the Community Challenge of [Facebook Developers Circles](https://devcommunitychallenge.devpost.com)

# Description

This is the source-code for a `Facebook Messenger Chat Bot` that is going to empower, help and bring communities together. 

<img src="https://user-images.githubusercontent.com/4379982/43087314-eaa224a6-8e75-11e8-869d-4d9c421da783.JPG" width="350">

## How

This bot will allow you to empower your community by fostering help with each other. If you want to help someone, all you have to do is open Facebook Messenger and search for "Help In Need". Once you started a conversation you will be able to choose:

- Reporting someone's in need location
- Help someone close to you

<img src="https://user-images.githubusercontent.com/4379982/43087329-f7b5c544-8e75-11e8-86ef-241952ed5358.JPG" width="350">

### Report

When the options appear you will be able choose `Report`. Once you choose this option, you will see a button (`Send Location`) to share someone's in need location.

<img src="https://user-images.githubusercontent.com/4379982/43087338-03332c04-8e76-11e8-89d6-f38192143598.JPG" width="350">

In case you are close to the person just share your current location, in other case, you can search locaction by address or drag a waypoint on map.

<img src="https://user-images.githubusercontent.com/4379982/43108497-7fbb427e-8eb8-11e8-94dc-7fd037c87442.JPG" width="350">

Ready, that's easy. Now other people or organizations can find and assist them!

<img src="https://user-images.githubusercontent.com/4379982/43087363-18a5ea90-8e76-11e8-988b-63db5946fcfd.JPG" width="350">

### Help

You can also ask for people's in need locations. When the options appear you will be able choose `Help`. 

<img src="https://user-images.githubusercontent.com/4379982/43108470-5facca70-8eb8-11e8-99e1-20f3360b3cb2.JPG" width="350">

This will make our `engine` of locations allow you to find someone close to you so you can help (5km radius). If our location engine finds someone who needs help close to you, it will give you the necessary links so you can help him.

<img src="https://user-images.githubusercontent.com/4379982/43108499-8536bf3a-8eb8-11e8-891a-b1c6010392c3.JPG" width="350">
<img src="https://user-images.githubusercontent.com/4379982/43087419-3a36339a-8e76-11e8-8168-bb00949c84aa.JPG" width="350">

Now you can go help him!

<img src="https://user-images.githubusercontent.com/4379982/43108503-8bead186-8eb8-11e8-9f31-059b9a1f0a4c.JPG" width="350">

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
