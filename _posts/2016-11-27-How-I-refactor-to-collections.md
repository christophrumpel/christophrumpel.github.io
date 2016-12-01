---
layout: post
title: "How I refactor to collections"
article_description: "Refactoring to Collections is a great book by Adam Wathan where he demonstrates, how you can avoid loops by using collections. It sounds great from the beginning but you need to practice it in order to be able to use it in your own projects. This is why I refactored some conditional code of my older projects. I will share these examples today."
---


<header>
<a href="https://adamwathan.me/refactoring-to-collections">Refactoring to Collections</a> is a great book by Adam Wathan where he demonstrates, how you can avoid loops by using collections. It sounds great from the beginning, but you need to practice it, in order to be able to use it in your own projects. This is why I refactored some of my older projects. I want to share these examples today with you.
</header>

<div class="note"><strong>Note:</strong> Code examples are from Laravel projects where collections are built-in. If you want to use them outside of Laravel you can use the <a href="https://github.com/tightenco/collect">Tighten Co. collect</a> or the <a href="https://github.com/lasso/Enumerable.php/wiki">enumerable</a> package.</div>

## Example 1

Here I needed to built a string from an array to create an unique cache key for given search filters. When you first look at the before and after examples, you could question if the collection version is a better choice here. This is because it looks a little bit more complex. But this is just the first impression. The collection version of this code has some great benefits:

* as always with collections, the code tells you more about what is happening
* it separates steps and helps you do one thing after the other
* it is easier to add more functionality like adding a filter

### Before
{% highlight php startinline %}
<?php
...

$returnString = '';
foreach ($filters as $key => $item) {
    $returnString .= $key .':' . $item . ',';
}
{% endhighlight php startinline %}


### Afterwords
{% highlight PHP startinline %}
<?php
...

$returnString = collect($filters)
    ->map(function($value, $key) {
        return $key . ':' . $value;
    })->implode(',');
{% endhighlight PHP startinline %}

## Example 2

This second example is from a private project of mine where I work with recipes and recipe steps. When you create a new recipe you need to store recipe steps too. We are mapping an input array of recipe step data to a new collection of recipeSteps objects. Collections are also great here, because we can use them with the `saveMany` method like this:
`$newRecipe->recipeSteps()->saveMany($recipeSteps);`

### Before
{% highlight php startinline %}
<?php
...

$steps = $input['step'];
$recipeSteps = [];
foreach ($steps as $step) {
    $recipeSteps[] = new RecipeStep(['recipe_id' => $recipeId, 'desc' => $step['desc']]);
}
{% endhighlight php startinline %}


### Afterwords
{% highlight PHP startinline %}
<?php
...

$steps = collect($input['step'])
$recipeSteps = $steps->map(function($step) use ($recipeId) {
    return new RecipeStep(['recipe_id' => $recipeId, 'desc' => $step['desc']]);
});
{% endhighlight PHP startinline %}


## Example 3

The third example is from my [Twitter notification channel](https://github.com/laravel-notification-channels/twitter), which I built as one of the [unofficial Laravel notification channels](http://laravel-notification-channels.com/). Here I needed to collect some image IDs. In order to get them, I need to call an upload method on every image. When you want to create a new array from a given one, `map` is the 
collection method you need. Additionally this is a good example for getting rid of an unnecessary temporary variable: 
`$mediaAids`.

### Before
{% highlight php startinline %}
<?php
...

$mediaIds = [];  
foreach ($imagePaths as $imagePath) { 
    $media = $this->connection->upload('media', ['media' => $imagePath]); 
    $mediaIds[] = $media->media_id_string; 
}  
    
$twitterMessage->imageIds = $mediaIds;
{% endhighlight php startinline %}

 <div class="note"><strong>Note:</strong> For better readability I did shorten some names in the code example.</div>


### Afterwords
{% highlight PHP startinline %}
<?php
...

$twitterMessage->imageIds = $imagePaths->map(function ($path) { 
    $media = $this->connection->upload('media', ['media' => $path]);  
    
    return $media->media_id_string; 
});
{% endhighlight PHP startinline %}

## Example 4

This example is from our [chatbot NELA](https://liechtenecker.at/en/tools/nela/) and is a little bit more complex. Given
 is an array of countries and we need to find a country, starting with a given character. Additionally there could 
 be a list of already used words, which we do not want to get returned. What I like here is how 
 refactoring to collections helps me clarify what I really want to do. When you work with loops and if statements it 
 often gets confusing what it actually is you want to do. And of course it is really hard to read the code.
So this is what we want to do here:

* we have countries and we want countries, which means we need a `filter` method here
* only return countries with the given first character
* and countries which are not already used
* and because we only want one of them, we can use the `random` method too

### Before
{% highlight php startinline %}
<?php
...

foreach ($countries as $country) {
    if (strtolower(substr($country, 0, 1)) == $char) {

        if (!empty($notWords)) {
            if (in_array($country, $notWords)) {
                continue;
            }
        }

        return $country;
    }
}

return false;
{% endhighlight php startinline %}


### Afterwords
{% highlight PHP startinline %}
<?php
...

$countries = collect($countries);
return $country = $countries->filter(function($country) use ($char, $notWords) {
   return strtolower(substr($country, 0, 1)) == $char && !in_array($country, $notWords);
})->random();
{% endhighlight PHP startinline %}

## Cheat sheet

If you're still struggling with figuring out which collection method you can use when, then this litte cheat sheet will 
help you:

* use `filter` when the output type is the same, but you just need specific items
{% highlight PHP startinline %}
<?php
...
// Get only users with a score higher than 1000
$topUsers = $users->filter(function($user) {
    return $user->score > 1000;
});
{% endhighlight PHP startinline %}

* use `each` when you need to do an action on each item 
{% highlight PHP startinline %}
<?php
...
// Invite a given collection of users to something
$users->each(function($user) {
    $user->sendInvite();
});
{% endhighlight PHP startinline %}

* use `map` when you need to create a different collection from a given one
{% highlight PHP startinline %}
<?php
...
// Get all the phone numbers from a collection of users
$userPhoneNumners = $users->map(function($user) {
    return $user->phone_number;
});
{% endhighlight PHP startinline %}

Often you need to do do multiple actions with a given collection of data. This is the case when you're able to chain 
those collection methods:

{% highlight PHP startinline %}
<?php
...
// Using multiple collection methods in order to get the best users
// send them an invations
// collect their phone numbers in order to call them personally too
$userPhoneNumbers = $users->filter(function($user) {
    return $user->score > 1000;
})->each(function($user) {
    $user->sendInvite();
})->map(function($user) {
    return $user->phone_number;
});
{% endhighlight PHP startinline %}

## Conclusion

After reading the book you're like: Hell yeah! This is awesome and I will use that now all the time!=)
But actually it takes some time until you can really use these methods in your day-to-day work. This is why it is a good idea to try to refactor some given code basis of you. This really helps you to think about where these techniques are useful and to get a feeling for your future code.