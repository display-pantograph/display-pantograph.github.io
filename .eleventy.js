const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("style.css");
    eleventyConfig.addPassthroughCopy("main.js");
    eleventyConfig.addPassthroughCopy("jQuery.js");
    
    eleventyConfig.addPassthroughCopy("**/*.woff2");
    eleventyConfig.addPassthroughCopy("**/*.ttf");
    eleventyConfig.addPassthroughCopy("**/*.otf");

    eleventyConfig.addPassthroughCopy("**/*.jpg");
    eleventyConfig.addPassthroughCopy("**/*.jpeg");
    eleventyConfig.addPassthroughCopy("**/*.png");
    eleventyConfig.addPassthroughCopy("**/*.pdf");
    eleventyConfig.addPassthroughCopy("**/*.mp4");
    
    eleventyConfig.addPlugin(lazyImagesPlugin, {
        imgSelector: '.left-align img',
    });
};
