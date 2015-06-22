# SharePoint JavaScript Helpers

SharePoint JavaScript Helpers (SJH) makes it easier to work with the SharePoint API through JavaScript.

SJH returns standard JavaScript objects, not SharePoint enumerators or other exotic creatures, so it's easy to incorporate into your code.

This was built to be fully compatible with popular front-end libraries like React JS. Join the future of SharePoint front-end development.

## Compatibility

SharePoint:

- SharePoint 2010, 2013, or Office 365

JavaScript Libraries:

- jQuery
- lodash

You can load libraries locally or through CDN prior to loading the JavaScript helpers.

For example:

## Setup

There's the easy way and the hard way to add JavaScript to a SharePoint page.

First, the easy way:

1. If you're using SharePoint 2013, disable the Minimal Download Strategy site feature.
2. Create a text file in SiteAssets, using SharePoint Designer. Call it myscripts.txt.
3. Seed the file with what you need for SJH.

```
code here
```

4. Add a simple SJH test to the file

```
code here
```

5. Add a content editor web part, and link it to the file you created in SiteAssets.

Reload your page and confirm that the test passes.

## Uses

SJH focuses on certain use cases. To request another, file an Issue on this GitHub repo.

### Get list items

### Add an item to a list

### Get the current user's e-mail address
