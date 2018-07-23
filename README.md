# help-in-need-bot

Say hello to the first humanitarian **bot**... This bot will allow to empower, help and bring communities together.

# Developers Circles

This project was made for the Community Challenge of [Facebook Developers Circles](https://devcommunitychallenge.devpost.com)

# Description

This is the source-code for a `Facebook Messenger Chat Bot` that is going to empower, help and bring communities together. How?

<img src="https://user-images.githubusercontent.com/4379982/43087314-eaa224a6-8e75-11e8-869d-4d9c421da783.JPG" width="350">

## How

This bot will bring help to people in street situations. If you see someone, all you have to do is open Facebook Messenger and search for "Help In Need". Once started a conversation you will be able to choose:

- Reporting sighting of someone in street situation
- Help someone close to you

<img src="https://user-images.githubusercontent.com/4379982/43087329-f7b5c544-8e75-11e8-86ef-241952ed5358.JPG" width="350">

### Report

Once the options appear you will choose `Report`. Below you will see an option to share a location.

<img src="https://user-images.githubusercontent.com/4379982/43087338-03332c04-8e76-11e8-89d6-f38192143598.JPG" width="350">

In case you are seeing this person share your current location. If it was someone you saw while driving or you could not use your phone at that time, it reports the location where you were.

<img src="https://user-images.githubusercontent.com/4379982/43087354-0febccee-8e76-11e8-85bf-814032ae530e.JPG" width="350">

Ready, that's easy. Now another person can help you.

<img src="https://user-images.githubusercontent.com/4379982/43087363-18a5ea90-8e76-11e8-988b-63db5946fcfd.JPG" width="350">

### Help

Once the options appear you will choose `Help`. Below you will see an option to share a location.

<img src="https://user-images.githubusercontent.com/4379982/43087363-18a5ea90-8e76-11e8-988b-63db5946fcfd.JPG" width="350">

This will make our `engine` of locations allow you to find someone close to you so you can help (5km radius). If our location engine finds someone who needs help close to you, it will give you the necessary links so you can help him.

<img src="https://user-images.githubusercontent.com/4379982/43087390-2da98ec4-8e76-11e8-809c-7f0e00663d52.JPG" width="350">
<img src="https://user-images.githubusercontent.com/4379982/43087419-3a36339a-8e76-11e8-8168-bb00949c84aa.JPG" width="350">

Now you can go help him!

<img src="https://user-images.githubusercontent.com/4379982/43087424-3ba8046a-8e76-11e8-9171-544d6965a798.JPG" width="350">

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
