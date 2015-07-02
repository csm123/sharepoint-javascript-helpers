require('es6-promise').polyfill();

var SharePoint = {};

SharePoint.Utils = {};

SharePoint.Utils.GetContext = function(site) {
  if (site) {
    return new SP.ClientContext(site);
  } else {
    return new SP.ClientContext.get_current();
  }
};

SharePoint.UpdateListItem = function (options) {
  return new Promise(function(resolve, reject) {
    var options = options || {};
    var SPContext = SharePoint.Utils.GetContext(options.site);
    var oList = SPContext.get_web().get_lists().getByTitle(options.list);
    var oListItem = oList.getItemById(options.id);

    for (var key in options.data) {
      if (options.data.hasOwnProperty(key)) {
        oListItem.set_item(key, options.data[key]);
      }
    }

    oListItem.update();

    SPContext.executeQueryAsync(
        function() { resolve(); },
        SharePoint.Error
    );
  });
};

SharePoint.AddListItem = function (options) {
  return new Promise(function(resolve, reject) {
    var options = options || {};
    var SPContext = SharePoint.Utils.GetContext(options.site);
    var oList = SPContext.get_web().get_lists().getByTitle(options.list);
    var itemCreateInfo = new SP.ListItemCreationInformation();
    var oListItem = oList.addItem(itemCreateInfo);

    for (var key in options.data) {
      if (options.data.hasOwnProperty(key)) {
        oListItem.set_item(key, options.data[key]);
      }
    }

    oListItem.update();

    SPContext.load(oListItem); /* loading the item gets its ID */

    SPContext.executeQueryAsync(
        function() { resolve(oListItem.get_id()); }, /* return the ID */
        SharePoint.Error
    );
  });
};

SharePoint.Error = function(sender, args) {
  var message = args.get_message() || "";
  var stackTrace = args.get_stackTrace() || "";

  alert('An error has occurred.' + '\n\n' + message +
  stackTrace);
};

SharePoint.GetListItems = function(options) {
  return new Promise(function(resolve, reject) {
    var options = options || {};
    var SPContext = SharePoint.Utils.GetContext(options.site);
    var web = SPContext.get_web();
    var listObject = web.get_lists().getByTitle(options.list);
    var camlQuery = new SP.CamlQuery();

    camlQuery.set_viewXml(options.query);

    var ListItems = listObject.getItems(camlQuery);

    SPContext.load(ListItems, 'Include(' + options.fields + ')');

    SPContext.executeQueryAsync(function() {
      var listItemArray = [];
      var listItemEnumerator = ListItems.getEnumerator();

      while (listItemEnumerator.moveNext()) {
        var oListItem = listItemEnumerator.get_current();
        var listItemAsObject = {};
        for (index = 0; index < options.fields.length; ++index) {
          listItemAsObject[options.fields[index]] = oListItem.get_item(options.fields[index]);
        });
        listItemArray.push(listItemAsObject);
      }

      resolve(listItemArray);
    }, SharePoint.Error);

  });
};

SharePoint.GetCurrentUserEmail = function(options) {
  return new Promise(function(resolve, reject) {
    var options = options || {};
    var SPContext = SharePoint.Utils.GetContext(options.site);
    var web = SPContext.get_web();
    var currentUser = web.get_currentUser();
    SPContext.load(currentUser);
    SPContext.executeQueryAsync(
      function(sender, args) {
        resolve(currentUser.get_email());
      },
      SharePoint.Error);
  });
};
