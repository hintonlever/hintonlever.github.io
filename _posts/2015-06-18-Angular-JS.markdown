---
layout: post
title:  "Angular JS"
date:   2015-06-07 18:15:00
categories: Javascript
type: doc
---

Why are services useful? Instead of filling the controller with code to fetch weather data from a server, it's better to move this independent logic into a service so that it can be reused by other parts of the app.

What can we generalize so far?

Directives are a way to make standalone UI components, like <app-info>
Services are a way to make standalone communication logic, like forecast which fetches weather data from a server

So far we've made AngularJS apps that display data in a single view index.html.

But what happens when the app grows and needs to display more information? Stuffing more code to a single view will quickly make things messy.

A better solution is to use multiple templates that display different pieces of data based on the URL that the user is visiting. We can do this with Angular's application routes.

* URL ROUTING *


