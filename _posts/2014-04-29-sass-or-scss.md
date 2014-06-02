---
title: "What’s the Difference Between Sass and SCSS?"
layout: post
external: http://www.sitepoint.com/whats-difference-sass-scss/
---

<p>First we create a package.json file in our assets’s root. We need to fill it with an empty object. This is because we will install all the modules with the –save parameter. This will save the module’s dependencies right in our package.json file. At the end all our modules will be listed in this file and we have a nice overview of what we are using.</p>
<p>First we create a package.json file in our assets’s root. We need to fill it with an empty object. This is because we will install all the modules with the –save parameter. This will save the module’s dependencies right in our <code>package.json</code> file. At the end all our modules will be listed in this file and we have a nice overview of what we are using <a href="">modern Webframework</a>.</p>
<h2>Install Gulp</h2>
<p>The first taks we will create is the Styles task. Here we want to compile our Sass file and save the CSS file in a different directory. This is super easy and when you see the code, you will immedatly notice what is going on.</p>
<h3>Let's do this</h3>
<ul>
	<li>Install node module</li>
	<li>Grap one of those delicious drinks</li>
	<li>Take a nap</li>
	<li>Relax and fell the sun</li>
</ul>
<blockquote>What if we could take over the World just by smiling</blockquote>
<p>First we create a package.json file in our assets’s root. We need to fill it with an empty object. This is because we will install all the modules with the –save parameter. This will save the module’s dependencies right in our package.json file. At the end all our modules will be listed in this file and we have a nice overview of what we are using.</p>p

{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}

{% highlight js %}
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var prefix = require('gulp-autoprefixer');

gulp.task('default', function () {
    gulp.src('src/app.scss')
        .pipe(sass({sourcemap: true, style: 'compact'}))
        .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
        .pipe(gulp.dest('dist'));
});
{% endhighlight %}			