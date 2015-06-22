# SharePoint JavaScript Helpers

**IN DEVELOPMENT, NOT READY FOR PRODUCTION USE**

SharePoint JavaScript Helpers (SJH) makes it easier to work with SharePoint lists through JavaScript.

SJH returns promises and then standard JavaScript objects, not SharePoint enumerators or other exotic creatures, so it's easy to incorporate into your code.

This was built to be fully compatible with popular front-end libraries like React JS. Join the future of SharePoint front-end development.

## Promise, what?

When you query the SharePoint API, the response is not immediate. Once the response comes back, you'll want to do something with it.

A promise tells SJH what to do once the response comes back.

## Compatibility

SharePoint:

- SharePoint 2010, 2013, or Office 365

JavaScript Libraries:

- jQuery

## Easy Setup

These steps work in SharePoint 2010, 2013, and Office 365.

If you're using SharePoint 2013 or Office 365, disable the Minimal Download Strategy site feature.

Create a text file in SiteAssets, using SharePoint Designer. Call it myscripts.txt.

Seed the file with what you need for SJH, then add a test.

```
<!-- Begin SJH initialization -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="https://rawgit.com/csm123/sharepoint-javascript-helpers/master/sharepoint-javascript-helpers.js"></script>
<!-- End SJH initialization -->

<!-- Begin SJH test -->
<div id="sjh-test"></div>
<script>
SP.SOD.executeFunc("sp.js");
ExecuteOrDelayUntilScriptLoaded(sjhTest, "sp.js");
function sjhTest() {
	SharePoint.GetCurrentUserEmail().done(function(user) {
    $("#sjh-test").html("<p>Test succeeded. Hello, " + user + "!</p>");
    });
}
</script>
<!-- End SJH test -->
```

Add a content editor web part, and link it to the file you created in SiteAssets.

Reload your page and confirm that the test passes. You should see a message inside the content editor web part with your e-mail address.

## Uses

SJH focuses on certain use cases. To request another, file an Issue on this GitHub repo.

### Get list items

```javascript
SharePoint.GetListItems(ListName, Query, Fields, Site)
```

**ListName**
  ***Required***
  The name of the list on SharePoint, as it appears in the list URL.

  ex. "Documents"

**Query**
  ***Optional***
  A query to filter, sort, or limit the list items returned. It is written in CAML, Microsoft's preferred method for querying SharePoint lists.

  Example:

  ```
  '<View><Query><Where><Eq><FieldRef Name=\'Active\'/>' +
    '<Value Type=\'Boolean\'>1</Value></Eq></Where></Query></View>'"
  ```

  See [more examples of CAML](http://sharepoint-works.blogspot.com/2012/05/caml-query-tutorial-for-sharepoint.html).

  To return all items, type null (with no quotes) in place of a query.

**Fields**
  ***Required***
  An array of fields to retrieve from the list.

  ex. ["Title", "Description"]

**Site**
  ***Optional***
  The relative URL of the SharePoint site containing the list.

  ex. "/CoolStuff"

  To use the current site, type null (with no quotes).

#### In practice:

Create a custom list called Test. It will start with just one column, Title.

Call GetListItems, and specify what happens when the items are returned.

```javascript
SharePoint.GetListItems("Test", null, ["Title"], null).done(function(items) {
  alert("Read list item test succeed. Here are the items from Test: " +
    _.pluck(items, "Title").join(", "));
});
```

### Add an item to a list



### Get the current user's e-mail address

SharePoint.GetCurrentUserEmail().done(
  function(email) {
    alert("Your e-mail address is " + email);
  }
  );

## Inspirations

- Microsoft's [quick reference to SharePoint's JavaScript Client Side Object Model](https://msdn.microsoft.com/en-us/library/office/jj163201.aspx), which powers SJH.
- [SPServices](https://spservices.codeplex.com/), for pioneering and continuing to provide excellent JavaScript helpers for SharePoint.
