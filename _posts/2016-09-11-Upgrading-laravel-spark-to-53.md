---
layout: post
title: "Laravel Spark - 5.3 upgrade"
article_description: "Laravel 5.3 is out! But what about Spark? Can we upgrade it too? Is it free? Let's check it out."
---


<header>
Laravel 5.3 is out! It is filled with lots of new and exciting features. Of course we want to make use of them in Laravel Spark too. So what about Spark and Laravel 5.3? Can we upgrade it too? Is it free? Let's check it out.
</header>

## The plan

A Spark installation is built on Laravel, but it is still different from a standard Laravel application. Besides the Laravel framework, a little Spark app is living there. With the Spark artisan commands you are able to pull changes and update Spark itself. This is why upgrading a Spark application to Laravel 5.3 needs two steps.

## 1. Upgrade the framework

In order to upgrade the Laravel framework just follow the [upgrade guide](https://laravel.com/docs/5.3/upgrade#upgrade-5.3.0). This may take 2-3 hours of your time.

For me this was the perfect time to try out [Laravel Shift](https://laravelshift.com/). It is an automated way to upgrade Laravel applications. You grant the application access to your repository and it will send a pull request within minutes. This will take care of ~ 90% of the upgrade. Depending on your code, there may be some files that could not be changed. The PR contains comments to let you know about these files. This will save you a lot of time and costs only $9. (costs depending on the shift) It is definitely worth a try and the money!

 <div class="note"><strong>Note:</strong> A shift is an upgrade from specific Laravel versions like from 5.2 to 5.3 in our case.</div>

## 2. Upgrade Spark

<blockquote>Several have asked if Spark upgrade to Laravel 5.3 will be a paid upgrade. It won't. It will be a free upgrade. (Taylor Otwell)</blockquote>

So luckily Taylor made this Spark upgrade free. So all we have to do now is call the command `php artisan spark:update`. No we are running the latest Spark version already using Laravel 5.3.

 <div class="note"><strong>Note:</strong> If you run into this error "Trait method hasTooManyLoginAttempts has not been applied, because there are collisions with other trait methods", checkout my reply <a href="https://laracasts.com/discuss/channels/spark/laravel-53-and-spark/replies/192744)">here</a>.</div>

## Conclusion

Now you should have a Spark installation up and running on Laravel 5.3! That's awesome. Check out all the [new features](https://laracasts.com/series/whats-new-in-laravel-5-3) to make your app even better. Also take a look at the [community notification channels](http://laravel-notification-channels.com/) for Laravel. Some drivers like Slack or SMS are already built into Laravel, but there are dozens of drivers which are not. This is why this project is providing lots of other drivers just for you.