require("es6-promise").polyfill();

SJH = {};

SJH.Config = {errorAlerts: true};

SJH.Utils = {};

SJH.Utils.getContext = function(site) {
  if (site) {
    return new SP.ClientContext(site);
  } else {
    return new SP.ClientContext.get_current();
  }
};

SJH.spread = function(callback) {
  /* From Axios - https://github.com/mzabriskie/axios/ */
  return function (arr) {
    callback.apply(null, arr);
  };
};

SJH.all = function (promises) {
  /* From Axios - https://github.com/mzabriskie/axios/ */
  return Promise.all(promises);
};

SJH.addListItem = function (options) {
  return new Promise(function(resolve, reject) {
    var context = SJH.Utils.GetContext(options.site);
    var list = context.get_web().get_lists().getByTitle(options.list);
    var itemCreateInfo = new SP.ListItemCreationInformation();
    var listItem = list.addItem(itemCreateInfo);

    for (var key in options.data) {
      if (options.data.hasOwnProperty(key)) {
        listItem.set_item(key, options.data[key]);
      }
    }

    listItem.update();

    context.load(listItem); /* loading the item gets its ID */

    context.executeQueryAsync(
        function() { resolve(listItem.get_id()); }, /* return the ID */
        SJH.Error
    );
  });
};

SJH.getlistItems = function(options) {
  return new Promise(function(resolve, reject) {
    var context = SJH.Utils.GetContext(options.site);
    var web = context.get_web();
    var listObject = web.get_lists().getByTitle(options.list);

    var camlQuery = new SP.CamlQuery();

    camlQuery.set_viewXml(options.query);

    var listItems = listObject.getItems(camlQuery);

    context.load(listItems, "Include(" + options.fields + ")");

    context.executeQueryAsync(function() {
      var listItemArray = [];
      var listItemEnumerator = listItems.getEnumerator();

      while (listItemEnumerator.moveNext()) {
        var listItem = listItemEnumerator.get_current();
        var listItemAsObject = {};
        for (index = 0; index < options.fields.length; ++index) {
          if (options.fields[index].toLowerCase() == "id") {
            listItemAsObject[options.fields[index]] = listItem.get_id();
          } else if (options.fields[index].toLowerCase() == "displayname") {
            listItemAsObject[options.fields[index]] = listItem.get_displayName();
          } else {
            listItemAsObject[options.fields[index]] = listItem.get_item(options.fields[index]);
          }        
        }
        listItemAsObject.object = listItem;
        listItemArray.push(listItemAsObject);
      }
      resolve(listItemArray);

    }, SJH.Error);

  });
};

SJH.updateListItem = function (options) {
  return new Promise(function(resolve, reject) {
    var context = SJH.Utils.GetContext(options.site);
    var list = context.get_web().get_lists().getByTitle(options.list);
    var listItem = list.getItemById(options.id);

    for (var key in options.data) {
      if (options.data.hasOwnProperty(key)) {
        listItem.set_item(key, options.data[key]);
      }
    }

    listItem.update();

    context.executeQueryAsync(
        function() { resolve(); },
        SJH.Error
    );
  });
};

SJH.deleteListItem = function (options) {
  return new Promise(function(resolve, reject) {
    var context = SJH.Utils.GetContext(options.site);
    var list = context.get_web().get_lists().getByTitle(options.list);
    var listItem = list.getItemById(options.id);

    listItem.deleteObject();

    context.executeQueryAsync(
        function() { resolve(); },
        SJH.Error
    );
  });
};

SJH.getCurrentUserEmail = function(options) {
  return new Promise(function(resolve, reject) {
    var context = SJH.Utils.GetContext((options && options.site) || null);
    var web = context.get_web();
    var currentUser = web.get_currentUser();

    context.load(currentUser);

    context.executeQueryAsync(
      function(sender, args) {
        resolve(currentUser.get_email());
      },
      SJH.Error);
  });
};

SJH.error = function(sender, args) {
  var message = args.get_message() || "";
  var stackTrace = args.get_stackTrace() || "";

  if (SJH.Config.errorAlerts) {
    alert("An error has occurred." + '\n\n' + message +
    stackTrace);
  }

  sender.reject(message, stackTrace);
};