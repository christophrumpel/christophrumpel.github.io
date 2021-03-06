---
layout: post
title: "Tracking active visitors with Google Analytics and Raspberry Pi in real-time"
article_description: "At the beginning of this year I fell in love with a tiny one-chip computer called Raspberry Pi. After some time of playing around I thought it was time for a real first project."
---


<header>
At the beginning of this year I fell in love with a tiny one-chip computer called Raspberry Pi. After some time of playing around I thought it was time for a real first project.
</header>

<img  class="alignnone" style="max-width: 100%; height: auto;" src="/assets/post-images/remote_tracking-1_web.jpg" alt="Close up of the LED of the installation">

## Raspberry what?

If you haven't heard of the Raspberry Pi, let me tell you one thing. `It is a wonderful tiny little piece of technology.`
Let's image s full functional computer  of the size of credit card. That's what it is! It was built for educational purposes but because of its size it is now widely used. It is so small that you can hide it very easily. Especially for IoT (Internet of Things) products it is a very popular component.

<blockquote>The Raspberry Pi® is a single-board computer developed in the UK by the Raspberry Pi Foundation with the intention of stimulating the teaching of basic computer science in schools. (adafruit)</blockquote>

## Hello World

Before diving right into my first projects I needed to get myself familiar with some new basics. I am a web developer and I wasn't much into electronics at school or university. If you want to use the Pi it is necessary to know about some electronic basics. There are a lot of resources for that out there. Just go and look what fits your needs.

But for some Pi experiments I can totally recommend [this article](https://www.pubnub.com/blog/2015-05-27-internet-of-things-101-getting-started-w-raspberry-pi/) by PubNub. This is where I built my first circuits and where I learned about how to control them over the Internet.

<div class="note"><strong>Note:</strong> This is just prototype code. Don't use it in production.</div>

## The idea
The first idea was to to turn on a LED whenever someone is hitting my blog. Since I already was able to control the light 
over the Internet I just needed a way to see if someone is on my site right now. I also knew there was a [Google Analytics 
Real Time API](https://developers.google.com/analytics/devguides/reporting/realtime/v3/) which could help with that.

<blockquote>The PubNub Realtime Data Stream Network enables developers build and scale realtime apps for IoT, Mobile, and web applications. (PubNub)</blockquote>

In the meantime I got a little display, so I decided to enhance my first idea and to show some user data too.

So here is a little schema of what wer are trying to achieve:

1. Every minute a cronjob will check the Google Real Time API for an active user
2. If there is one it will push some data to our PubNub channel
3. A python script running on the Raspberry Pi will listen to this channel and taking care of activating the LED and the display.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Process workflow image showing a website, PubNub plattform and the Raspberry Pi" src="/assets/post-images/realtimetracking.svg" width="700" height="261" />

<div class="note"><strong>Note:</strong> If you want to take the shortcut, checkout out the code at the <a href="https://github.com/christophrumpel/raspberrypi-realtime-website-tracking">GitHub Repository</a>.</div>

## The tutorial

### Step 1: SignUp for a PubNub account

In order to communicate between a PHP script on a server and a program on the Raspberry Pi we are using PubNub. It 
provides real time communication between different devices. The free plan is enough for our little project. Make sure to
 create an app after the sign up process. Selecting the app will show you some config data we will need later.

### Step 2: SignUp for the Beta Real Time Reporting API

This API is still in BETA and you need to sign up first [here](https://docs.google.com/forms/d/1qfRFysCikpgCMGqgF3yXdUyQW4xAlLyjKuOoOEFN2Uw/viewform). For more information about this API check out the [overview](https://developers.google.com/analytics/devguides/reporting/realtime/v3/). We will use it to receive real-time data from our Google Analytics account which is in this case my blog.

### Step 3: Receiving and sending Google Analytics data

The file `get_and_send_ga_realtime_data.php` contains the PHP script to get and send the GA data. I have a cronjob that 
is calling this file every minute. This is enough to make it feel like real-time. In order to get data from the API we need to provide some information about our GA account:

* Service Account Email
* Key File Location
* GA Profile View ID

Fill them at the right spot labeled with `insert-...`.
Also make sure to provide the Google API PHP client library at the correct location.

Inside the `$optParams` we define the additional real-time data we need. Because of that we are able to show the user's country and city on the display.

{% highlight PHP startinline %}
<?php
...
$optParams = array(
    'dimensions' => 'rt:medium,rt:city,rt:country'
);
...
{% endhighlight PHP startinline %}

After receiving the data we want to send it to the our PubNub app.
We are publishing the data to a PubNub Channel called `analytics-channel`. If there is an active user the led value is set
 to one and we pass the country and the city. If not, the led value will be zero.


{% highlight PHP startinline %}
<?php
...
$activeUserCount = $results->totalsForAllResults['rt:activeUsers'];
$country = $results->getRows()[0][2];
$city = $results->getRows()[0][1];

if($activeUserCount > 0) {
    $info = $pubnub->publish('analytics-channel', ['led' => 1, 'city' => $city, 'country' => $country]);
} else {
    $info = $pubnub->publish('analytics-channel', ['led' => 0]);
}
...
{% endhighlight PHP startinline %}

<div class="note"><strong>Note:</strong> In fact it doesn't care what data you are sending. You just want to let the other script know about what just happened.</div>

Here you can see the full file:

{% highlight PHP startinline %}
<?php

// Source: https://developers.google.com/analytics/devguides/reporting/realtime/v3/reference/data/realtime/get

require_once('pubnub-lib/autoloader.php');

use Pubnub\Pubnub;

$pubnub = new Pubnub(array(
    'subscribe_key' => 'insert-your-pubnub-subscribe-key',
    'publish_key'   => 'insert-your-pubnub-publish-key'
));

function getService()
{
  // Creates and returns the Analytics service object.

  // Load the Google API PHP Client Library.
  require_once 'google-api-php-client/src/Google/autoload.php';

  // Use the developers console and replace the values with your
  // service account email, and relative location of your key file.
  $service_account_email = 'your-service-account-email';
  $key_file_location = 'your-client-secret-file';

  // Create and configure a new client object.
  $client = new Google_Client();
  $client->setApplicationName("HelloAnalytics");
  $analytics = new Google_Service_Analytics($client);

  // Read the generated client_secrets.p12 key.
  $key = file_get_contents($key_file_location);
  $cred = new Google_Auth_AssertionCredentials(
      $service_account_email,
      array(Google_Service_Analytics::ANALYTICS_READONLY),
      $key
  );
  $client->setAssertionCredentials($cred);
  if($client->getAuth()->isAccessTokenExpired()) {
    $client->getAuth()->refreshTokenWithAssertion($cred);
  }

  return $analytics;
}

$analytics = getService();

/**
 * 1.Create and Execute a Real Time Report
 * An application can request real-time data by calling the get method on the Analytics service object.
 * The method requires an ids parameter which specifies from which view (profile) to retrieve data.
 */
$optParams = array(
    'dimensions' => 'rt:medium,rt:city,rt:country'
);

try {

  // How to find your GA profile view id:
  // Go to GA. Get to your site.
  // When you're on the dashboard you will see the ID in your URL at the end.
  // It's the number after the "p".
  $results = $analytics->data_realtime->get(
      'ga:INSERT-YOUR-GA-PROFILE-VIEW-ID',
      'rt:activeUsers',
      $optParams);

  // print_r($results);
  $activeUserCount = $results->totalsForAllResults['rt:activeUsers'];
  $country = $results->getRows()[0][2];
  $city = $results->getRows()[0][1];

  if($activeUserCount > 0) {
    $info = $pubnub->publish('analytics-channel', ['led' => 1, 'city' => $city, 'country' => $country]);
  } else {
    $info = $pubnub->publish('analytics-channel', ['led' => 0]);
  }

  var_dump($info);

  // Success. 
} catch (apiServiceException $e) {
  // Handle API service exceptions.
  $error = $e->getMessage();
}

?>
{% endhighlight PHP startinline %}

### Step 4: Physical stuff

Ok, this will be the fun part. We will setup a LED and a display for the Raspberry Pi in order to show our Google 
Analytics data.

This is what I have used.

#### Component list

* Raspberry Pi 2 Model B
* Breadboard
* LED display 16x2 (hd44780 chip)
* LED (1.6V)
* Jumper Wires
* Resistor 200Ω
* Resistor 1kΩ

And this is how we connect all the parts.

<img class="alignnone" style="max-width: 100%; height: auto;" alt="Technical graphic of the connected units" src="/assets/post-images/realtimetracking_schema.png" width="700" height="261" />

The LED uses just a small circuit where one side belongs to the ground and the other to a GPIO pin which is sending some power when we want it to. In between we got an 220Ω resistor which depends on the LED you are using.

For the display we need 12 of its 16 connectors in order to use it in a 4-bit mode. Here is a detailed  list of the wiring.

#### Display wiring

* Pin #1 of the LCD goes to ground (black wire)
* Pin #2 of the LCD goes to +5V (red wire)
* Pin #3 (Vo) of the LCD goes to over a transistor to the ground (black wire)
* Pin #4 (RS) connects to GPIO #26 (orange wire)
* Pin #5 (RW) goes to ground (black wire)
* Pin #6 (EN) connects to GPIO #19 (white wire)
* Skip LCD Pins #7, #8, #9 and #10
* Pin #11 (D4) connects to GPIO #13 (purple wire)
* Pin #12 (D5) connects to GPIO #6 (yellow wire)
* Pin #13 (D6) connects to GPIO #5 (gray wire)
* Pin #14 (D7) connects to GPIO #12 (brown wire)
* Pin #15 (LED +) goes to +5V (red wire)
* Pin #16 (LED -) goes to ground (black wire)

For more information about connecting such a display you should take a look at this [Adafruit Tutorial (PDF)](https://learn.adafruit.com/downloads/pdf/drive-a-16x2-lcd-directly-with-a-raspberry-pi.pdf).

### Step 5: The python script

<img class="alignnone" style="max-width: 100%; height: auto;" src="/assets/post-images/remote_tracking_display-1_web.jpg" alt="Closeup photo of the display saying Hello new user">

The python script is our listener. Again we are using a [PubNub library](https://www.pubnub.com/docs/python/pubnub-python-sdk), but this time we are listening to the subscribed channel. In the callback function 
I am checking the returned message. The `led` key defines if there is an active user. If there is one the main method 
will pass the user's country and city to the display and the led will blink.

<div class="note"><strong>Note:</strong> This is my first python script, so please don't be to hard on me =)</div>

The beginning of the `control_led_and_display.py` script is all about settings. Afterwards you will find the more 
interesting part. See this part below.

{% highlight python startinline %}

...
# PubNub Settings
pubnub = Pubnub(publish_key='your-pubnub-publish-ley', subscribe_key='your-pubnub-subscribe-key')
channel = 'analytics-channel'

def _callback(m, channel):
    print(m)
    if m['led'] == 1:
        print('User is active')

        # Send data to the display
        main(m['city'], m['country'])
      
        # Turn the LED on and off to make it blink
        for i in range(6):
            GPIO.output(LED_PIN,True)
            time.sleep(0.5)
            GPIO.output(LED_PIN,False)
            time.sleep(0.5)
            GPIO.output(LED_PIN,True)

    elif m['led'] == 0:
            GPIO.output(LED_PIN,False)
            print('NO User is active')

def _error(m):
    print(m)

pubnub.subscribe(channels=channel, callback=_callback, error=_error)

{% endhighlight PHP startinline %}

<div class="note"><strong>Note:</strong> Checkout the <a href="https://github.com/christophrumpel/raspberrypi-realtime-website-tracking">GitHub Repository</a> for all of the code.</div>

## Conclusion

So this is how you can track an active an user with Google Analytics and a Raspberry Pi. It was my first article on an 
IoT project and I hope you find every information you need. Please leave me a comment if you got any further 
questions or other feedback. Of course this is just a fast prototype and there is enough place for improvements. Have fun!