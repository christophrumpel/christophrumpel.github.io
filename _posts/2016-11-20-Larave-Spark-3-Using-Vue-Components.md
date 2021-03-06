---
layout: post
title: "Laravel Spark 3 and Vue components"
article_description: "Laravel 3 is out and it is using Vue.js version 2. Time to take a look at what has changed to use 
Vue 
components."
---


<header>
Laravel Spark 3 is out and it is using Vue.js version 2. Time to take a look at what has changed to use .vue 
components.
</header>

## Vue.js 2

A new version of the JavaScript framework Vue.js is out and it is a complete rewrite. It comes with lots of 
improvements and new features and this is why there is some upgrade tasks involved. Check out [the upgrade page](https://vuejs.org/v2/guide/migration.html) to see exactly what has changed. There is also a neat migration helper 
mentioned. It's a CLI tool than scans your code in order to tell you what needs to be adapted. Use that, it is really 
helpful.

It took me 3 hours to update my whole Spark application to the new version.

 <div class="note"><strong>Note:</strong> The migration helper gets confused when you use the Laravel Blade Syntax 
 next to your Vue.js code.</div>

## Spark 3 and Vueify

If you're not familiar with Vueify yet, check out my article [Laravel Spark - Vue components](http://christoph-rumpel
.com/2016/05/Larave-Spark-Using-Vue-Component/) where I cover some basics.

If you have used Vueify with Spark before, you will notice that using Vue components is the same.

### 1. Create a Vue component

{% highlight text startinline %}
// resources/assets/js/components/hello.vue
<template>
    <h1 class="helloWorld">Hello {{ msg }}</h1>
</template>

<script>
    export default{
        data() {
            return {
                msg: 'World'
            }
        }
    }
</script>

<style>
    .helloWorld {
        color: #3097D1;
    }
</style>
{% endhighlight text startinline %}
  
This is our Vue component containing the template, script and the styles.

### 2. Import the component

Next we need to import the component and add it to our Vue instance. This is done within the `app.js` file. The whole 
file looks like this:

{% highlight JS startinline %}
// resources/assets/js/app.js
require('spark-bootstrap');
 
require('./components/bootstrap');
 
import Hello from './components/hello.vue'; // new
 
Vue.component('hello', Hello); // new
 
var app = new Vue({
    mixins: [require('spark')],
 
});
{% endhighlight JS startinline %}

Only the two lines highlighted were added here.

### 3. Include the component in a template

For our demo I will put this component inside the Spark login page.

{% highlight HTML startinline %}
// resources/views/vendor/spark/auth/login.blade.php
@extends('spark::layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <hello></hello>
                <div class="panel panel-default">
                ...
{% endhighlight HTMLc startinline %}

### 4. Gulp it

No we just need to run Gulp in order to compile the assets again. If you visit your login page you should see our 
component output `Hello World` like this:

<img  class="alignnone" style="max-width: 100%; height: auto;" src="/assets/post-images/spark3-vue-screenshot.png" 
alt="Close up image of the relay">

## Conclusion

As you could see the harder part is updating your Vue.js components to the new version. Using .vue components is very 
straight forward again because Laravel is helping us a lot under the hood. Let me know if you ran into other problems.



