/*  SharePoint JavaScript Helpers
    Dependencies: lodash, jQuery
    IN DEVELOPMENT
*/

var SharePoint = {};

SharePoint.AddItem = function (site, list, data) {
  /* .resolve(item) */
  var dfd = $.Deferred();
  setTimeout(function() { dfd.resolve(true); console.log('done');}, 2000);

  return dfd.promise();
};

SharePoint.Error = function(sender, args) {
  alert('An error has occurred.' + '\n\n' + args.get_message() + args.get_stackTrace());
};

var Init = {};

/*
GetListItems
listName: the name of your list, as specified under the List Settings
query: a CAML query to determine which items to return. Specify null to
return all items.
fields: a comma-delimited list of fields to return
site: leave blank for current site, or specify a releative URL for the site
*/
SharePoint.GetListItems = function(listName, query,
  fields, site) {
  var dfd = $.Deferred(function() {
    var SPContext;
    if (site) {
      SPContext = new SP.ClientContext(site);
    } else {
      SPContext = new SP.ClientContext.get_current();
    }
    var web = SPContext.get_web();
    var list = web.get_lists().getByTitle(listName);
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(query);
    var ListItems = list.getItems(camlQuery);
    SPContext.load(ListItems, 'Include(' + fields + ')');
    SPContext.executeQueryAsync(function() {
      var listItemArray = [];
      var listItemEnumerator = ListItems.getEnumerator();
      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var listItemAsObject = {};
        _.each(fields, function(field) {
          listItemAsObject[field] = oListItem.get_item(field);
        });
        listItemArray.push(listItemAsObject);
      }
      dfd.resolve(listItemArray);
    }, SharePoint.Error);
  });
  return dfd.promise();
};

SharePoint.GetCurrentUserEmail = function() {
  var dfd = $.Deferred();
  var context = new SP.ClientContext('/');
  var website = context.get_web();
  var currentUser = website.get_currentUser();
  context.load(currentUser);
  context.executeQueryAsync(Function.createDelegate(this, function(sender, args) {
  dfd.resolve(currentUser.get_email().toLowerCase());
  }),
  Function.createDelegate(this, SharePoint.Error));
  return dfd.promise();
};
