# SharePoint JavaScript Helpers

**IN DEVELOPMENT, NOT READY FOR PRODUCTION USE**

SharePoint JavaScript Helpers (SJH) makes it easier to work with SharePoint lists through JavaScript.

## Capabilities

SJH's simple features can be combined to produce complex SharePoint-based applications.

- Get list items
- Add list item
- Update list item
- Get the current user's e-mail address

## Compatibility

- SharePoint 2010, 2013, and Office 365
- Today's web browsers including IE 8 and above

## Easy Setup

1. If you're using SharePoint 2013 or Office 365, disable the Minimal Download Strategy site feature on any sites using this script. The option to disable MDS is under Site Settings > Site Features. Alternatively, you can [optimize your JavaScript to be compatible with MDS](https://msdn.microsoft.com/en-us/library/office/dn456543.aspx), but that is outside the scope of this library.

2. Copy sjh.js (in the `dist` folder above) to SiteAssets.

3. Create an HTML file in SiteAssets, and link it to a content editor web part on a page. In that HTML file, place the following code:
  ```html
    <script src="../SiteAssets/sjh.js"></script>
    <script>
        SP.SOD.executeFunc("sp.js");
        ExecuteOrDelayUntilScriptLoaded(YOUR_FUNCTION_NAME_HERE, "sp.js");
    </script>
  ```
Replace `YOUR_FUNCTION_NAME_HERE` with any SJH code you'd like to run on load. If no SJH code needs to run on load, remove that line. 
You may need to adjust the path to sjh.js. The path above assumes the content editor web part is in SitePages or Pages.

## Uses

SJH focuses on certain use cases. To request another, file an Issue on this GitHub repo.

**All example code below can be placed after the Easy Setup code above, within the same content editor web part.**

### Get list items

```javascript
SJH.GetListItems({
    list: "Test",	/* The name of the list on SharePoint, as it appears in the list URL. */
    fields: ["Title"],	/* An array of fields to retrieve from the list. */
    query: "<View><Query><Where><Eq><FieldRef Name='Active'/><Value Type='Boolean'>1</Value></Eq></Where></Query></View>",	 	/* OPTIONAL: A query to filter, sort, or limit the list items returned. It is written in CAML, Microsoft's preferred method for querying SharePoint lists. Leave this out to return all. */
    site: "/SomeSite"	/* The relative URL of the SharePoint site containing the list. Leave this out to use the current site. */
}).then(function(items) {
    /* Do something with the array 'items' */
});
```

#### Example

Before running the code below, create a custom list called Test. It will start with just one column, Title. Add a couple of items to the list.

```javascript
SJH.getListItems({
    list: "Test",
    fields: ["Title"]
}).then(function(items) {
    var itemsAsList = $.map(items, function(item) {
        return item["Title"];
    }).join(", ");
    alert("Read list item test succeed. Here are the items from Test: " +
        itemsAsList);
});
```

#### Special fields

Here are some quirky SharePoint fields that come with most lists. Include these in the fields, and SJH will include them in the results:

- Id
- DisplayName: In a document library, this is the file name without the extension. For a list, it's the item's title.
- EncodedAbsUrl: In a document library, this is the URL to open the document. For a list, it's generally not useful.

### Add list item

```javascript
SJH.addListItem({
    list: "Test",	/* The name of the list on SharePoint, as it appears in the list URL. */
    data: {	/* The data you'd like to add, as a JavaScript object. Field names must match the system names of the fields (see section below called List and Field Names. */
        Title: "my new item",
        Description: "This item rocks"
    },
    site: "/SomeSite"	/* The relative URL of the SharePoint site containing the list. Leave this out to use the current site. */
}).then(function(id) {
    /* Do something once this succeeds */
});
```

#### Example

Create a custom list called Test. It will start with just one column, Title.

```javascript
SJH.addListItem({
    list: "Test",
    data: {
        Title: "my new item"
    }
}).then(function(id) {
    alert("Item added. Its ID is " + id.toString());
});
```

### Update an item in a list

```javascript
SJH.updateListItem({
    list: "Test",	/* The name of the list on SharePoint, as it appears in the list URL. */
    id: 1,	/* The ID of the list item to update */
    data: {	/* The data you'd like to update, as a JavaScript object. Field names must match the system names of the fields (see section below called List and Field Names. */
        Title: "my updated item"
    },
    site: "/SomeSite"	/* The relative URL of the SharePoint site containing the list. Leave this out to use the current site. */
}).then(function() {
    /* Do something once this succeeds */
});
```

#### Example

Create a custom list called Test.

```javascript
SJH.addListItem({
    list: "Test",
    data: {
        Title: "test item"
    }
}).then(function(id) {
    /* AddListItem returns the ID of the item added, which we'll use to update that item */
    SJH.updateListItem({
        list: "Test",
        id: id,
        data: {
            Title: "updated test item"
        }
    }).then(function() {
        alert("Item added and updated");
    });
});
```

### Delete list item

```javascript
SJH.deleteListItem({
    list: "Test",   /* The name of the list on SharePoint, as it appears in the list URL. */
    id: 1, / * The ID of the list item to delete */
    site: "/SomeSite"   /* The relative URL of the SharePoint site containing the list. Leave this out to use the current site. */
}).then(function() {
    /* Do something once this succeeds */
});
```

### Get the current user's e-mail address

```javascript
SJH.getCurrentUserEmail({
    site: "/SomeSite"	 /* OPTIONAL: The current site is used if this is not specified. */
}).then(function(email) {
    /* Do something with the email address in email */
});
```

#### Example

```javascript
SJH.getCurrentUserEmail().then(function(email) {
    alert("Hi! Your e-mail address is " + email + ".");
});
```

## Perform multiple actions

### At the same time (simultaneously)

With this method, your code under `then` is executed after all of the specified actions are completed.

```javascript
var getSomeItems = function() {
    return SJH.getListItems({
        list: "Some list",
        fields: ["Title"]
    });
};

var getMoreItems = function() {
    return SJH.getListItems({
        list: "Another list",
        fields: ["Title"]
    });
};

SJH.all([getSomeItems, getMoreItems])
    .then(SJH.spread(function(someItems, moreItems) {
        alert("I got " + someItems.length + " items from some list and "
        + moreItems.length + " items from another list!");
    }));
```

### One after the other (sequentially)

See the example above of updating an item in a list.

## React

SJH's simplicity makes it compatible with modern JavaScript libraries like [React](http://facebook.github.io/react/).

Here's is SJH and React combined, ready to run in a content editor web part:

```html
<script src="https://fb.me/react-0.13.3.js"></script>
<script src="https://fb.me/JSXTransformer-0.13.3.js"></script>
<script src="../SiteAssets/sjh.js"></script>

<div id="sjh-test-react"></div>

<script type="text/jsx">
var Test = React.createClass({
  getInitialState: function() {
    return {items: []};
  },
  componentWillMount: function() {
    SJH.getListItems({list: "Test", fields: ["Title"]}).then(function(items) {
        this.setState({items: items});
    }.bind(this));
  },
  render: function() {
	var items = this.state.items.map(function(item) {
		return <li>{item.Title}</li>;
	});
	return (
	<div>
		<p>Here are the items in the list, rendered with React:</p>
		<ul>
			{items}
		</ul>
	</div>
	);
  }
});

var renderTest = function() {
    React.render(<Test items={items}/>, document.getElementById("sjh-test-react"));
}

SP.SOD.executeFunc("sp.js");
ExecuteOrDelayUntilScriptLoaded(renderTest, "sp.js");
</script>
```

To be production ready, you'll need to compile the JSX to JavaScript and use the minified version of React.

## List and field names

Always use a list's **current** title, as specified in List Settings.

Always use a field's **system** name, which is often different from its displayed name. To find a field's system name, go to List Settings and click on that field. The field's system name will be in the URL.

## Errors

SharePoint-specific errors will result in a popup alert, helpful for debugging. Any other errors that SJH encounters will be thrown to the console. You're best off using Google Chrome and its console to debug your JavaScript.

To disable error alerts, add this right after the `<script>` tag for sjh.js:

```javascript
SJH.Config.errorAlerts = false;
```

You can catch errors in your own code and do with them what you wish by using `catch`. The syntax below is a bit odd, but makes this code IE 8 compatible.

```javascript
SJH.getListItems({list: "Test", fields: ["Title"]}).then(
	function(items) {
		/* do something on success */
	})
["catch"](
	function(err) { 
		/* Do something with the error in err */ 
	});
```

## Roadmap

For upcoming features, see the Issues tab. Feel free to submit your own!

## Inspirations

- Microsoft's [quick reference to SharePoint's JavaScript Client Side Object Model](https://msdn.microsoft.com/en-us/library/office/jj163201.aspx), which powers SJH.
- [SPServices](https://spservices.codeplex.com/), for pioneering and continuing to provide excellent JavaScript helpers for SJH.
