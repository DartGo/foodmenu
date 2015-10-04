var PAGE_MARGIN = 16;
var lists = require("./menu.json");

var ios = tabris.device.get("platform") === "iOS";
var orientation = tabris.device.get("orientation");
console.log("os:" + ios); //iOS
console.log("orientation:" + orientation); 

var selectedList;

tabris.create("Drawer").append(tabris.create("PageSelector"));

var menuPage = createListsPage("All", "images/page_all_lists.png", function() {
  return true;
}).open();

createListsPage("Rice", "images/page_popular_lists.png", function(list) {
  return ( list.cat === 1 );
});

createListsPage("Fried & Other Rice", "images/page_popular_lists.png", function(list) {
  return ( list.cat === 2 );
});

createListsPage("Fried Noodles", "images/page_popular_lists.png", function(list) {
  return ( list.cat === 3 );
});

createListsPage("Soup", "images/page_popular_lists.png", function(list) {
  return ( list.cat === 4 );
});

createListsPage("Noodles", "images/page_popular_lists.png", function(list) {
  return ( list.cat === 5 );
});

/* 保留
tabris.create("Action", {
  title: "Settings",
  image: {src: "images/action_settings.png", scale: 3}
}).on("select", function() {
  createSettingsPage().open();
});
*/

//menuPage.open();

//function createBookListPage(title, image, filter) {
  /*return tabris.create("Page", {
    title: title,
    topLevel: true,
    image: {src: image, scale: 3}
  }).append(createBooksList(books.filter(filter)));*/
  //return createBookPage(books.filter(filter), title, image);
//}

function createListsPage(title, image, filter) {
  var filteredLists = lists.filter(filter);

  var page = tabris.create("Page", {
    topLevel: true, 
    title: title, 
    image: {src: image, scale: 3}
  });

  if (!filteredLists || filteredLists.length === 0) {
    console.log("can't get items....");
    return;
  }

  // 預設第一個項目
  //selectedBook = books[0];
  
  /* 明細 */
  // 將 details block 高度設為 0, 等按下清單項目時再顯示
  createSelectedListView(filteredLists[0])
    .set("layoutData", {top: 0, height: 0, left: 0, right: 0})
    .set("id", "detailsBlock")
    .appendTo(page);

  /* 清單 */
  createLists(filteredLists, page).set({
    layoutData: {top: "prev() 0", left: 0, right: 0, bottom: 0},
    background: "#F0F0F0"
  }).appendTo(page);

  /* 分隔線
  tabris.create("TextView", {
    layoutData: {height: 1, right: 0, left: 0, top: [detailsComposite, 0]},
    background: "rgba(0, 0, 0, 0.1)",
	text: "why?"
  }).appendTo(page);*/

  return page;
}

function createSelectedListView(list) {
  var details = tabris.create("Composite", {
    background: "white",
    highlightOnTouch: true
  }).on("tap", function() {
    showReadDetailsPage(details); //this
  });

  var imageView = tabris.create("ImageView", {
	  id: "coverImage",
    layoutData: {height: 160, width: 160, left: PAGE_MARGIN, top: PAGE_MARGIN},
    image: list.image,
    scaleMode: "fit"
  }).on("tap", function() {
	  showReadDetailsPage(details);
  }).appendTo(details);

  var titleTextView = tabris.create("TextView", {
	  id: "title",
    //markupEnabled: true,
    //text: "<b>" + book.title + "</b>",
	  text: list.title,
	  font: "18px",
    layoutData: {left: [imageView, PAGE_MARGIN], top: PAGE_MARGIN, right: PAGE_MARGIN}
  }).on("tap", function() {
	  showReadDetailsPage(details);
  }).appendTo(details);

  var authorTextView = tabris.create("TextView", {
	  id: "author",
    layoutData: {left: [imageView, PAGE_MARGIN], top: [titleTextView, PAGE_MARGIN], 
      right: PAGE_MARGIN},
    text: list.author
  }).on("tap", function() {
	  showReadDetailsPage(details);
  }).appendTo(details);

  tabris.create("TextView", {
	  id: "chinese",
    layoutData: {left: [imageView, PAGE_MARGIN], top: [authorTextView, PAGE_MARGIN]},
    textColor: "rgb(102, 153, 0)",
	  font: "24px",
    text: list.chinese
  }).on("tap", function() {
	  showReadDetailsPage(details);
  }).appendTo(details);

  return details;
}

function showReadDetailsPage(details) {
  lists.forEach(function(list) {
    if (list.title === details.find("#title").get("text")) {
      selectedList = list;
      return;
    }
  });
  // 另一個寫法，但會回傳 array
  // selectedList = lists.filter(function(list) {
  //   return list.title === details.find("#title").get("text")
  // })[0];
  createReadDetailsPage().open();
}

/* 保留
function createTabFolder() {
  var tabFolder = tabris.create("TabFolder", {tabBarLocation: "top", paging: true});
  var relatedTab = tabris.create("Tab", {title: "Related"}).appendTo(tabFolder);
  createBooksList(books).appendTo(relatedTab);
  var commentsTab = tabris.create("Tab", {title: "Comments"}).appendTo(tabFolder);
  tabris.create("TextView", {
    layoutData: {left: PAGE_MARGIN, top: PAGE_MARGIN, right: PAGE_MARGIN},
    text: "Great Book."
  }).appendTo(commentsTab);
  return tabFolder;
}*/

function createLists(lists, page) {
  return tabris.create("CollectionView", {
    layoutData: {left: 0, right: 0, top: 0, bottom: 0},
    itemHeight: 72,
    items: lists,
    initializeCell: function(cell) {
      var imageView = tabris.create("ImageView", {
        layoutData: {left: PAGE_MARGIN, centerY: 0, width: 32, height: 48},
        scaleMode: "fit"
      }).appendTo(cell);

      var titleTextView = tabris.create("TextView", {
        layoutData: {left: 64, right: PAGE_MARGIN, top: PAGE_MARGIN},
        markupEnabled: true,
        textColor: "#4a4a4a"
      }).appendTo(cell);

      var authorTextView = tabris.create("TextView", {
        layoutData: {left: 64, right: PAGE_MARGIN, top: [titleTextView, 4]},
        textColor: "#7b7b7b"
      }).appendTo(cell);

      cell.on("change:item", function(widget, list) {
        imageView.set("image", list.image);
        titleTextView.set("text", list.title);
        authorTextView.set("text", list.author);
      });
    }
  }).on("select", function(target, list) {	  
  	selectedList = list;
  	
  	page.find("#coverImage").set("image", list.image);
  	page.find("#title").set({"text": list.title, "font": "18px"});
  	page.find("#author").set("text", list.author);
  	page.find("#chinese").set("text", list.chinese);

    // 顯示 details block
    page.find("#detailsBlock").set("height", 190).on("resize", function() {});
    animateInScaleUp(page.find("#detailsBlock"), 100);
  });
}

function createReadDetailsPage() {
  var page = tabris.create("Page");

  if (!ios) 
	  page.set("title", selectedList.title);

  var scrollView = tabris.create("ScrollView", {
    layoutData: {left: 0, right: 0, top: 0, bottom: 0},
    direction: "vertical"
  }).appendTo(page);

  tabris.create("TextView", {
    layoutData: {top: PAGE_MARGIN, centerX: 0},
    textColor: "rgba(0, 0, 0, 0.5)",
    text: selectedList.chinese,
	font: "24px"
  }).appendTo(scrollView);

  tabris.create("ImageView", {
    layoutData: {left: PAGE_MARGIN, top: "prev() 10", right: PAGE_MARGIN},
    image: selectedList.image,
    scaleMode: "auto"
  }).appendTo(scrollView);

  return page;
}

function animateInScaleUp(widget, delay) {
  widget.set("opacity", 0.0);
  widget.animate({
    opacity: 1.0,
    transform: {scaleX: 1.0, scaleY: 1.0}
  }, {
    delay: delay,
    duration: 200,
    easing: "ease-in"
  });
}

/*
function createSettingsPage() {
  var page = tabris.create("Page", {
    title: "License"
  });
  var settingsTextView = tabris.create("TextView", {
    text: "Book covers come under CC BY 2.0",
    layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: PAGE_MARGIN}
  }).appendTo(page);
  var url = "https://www.flickr.com/photos/ajourneyroundmyskull/sets/72157626894978086/";
  var linkTextView = tabris.create("TextView", {
    text: "<a href=\"" + url + "\">Covers on flickr</a>",
    markupEnabled: true,
    layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: [settingsTextView, 10]}
  }).appendTo(page);
  tabris.create("TextView", {
    text: "<i>Authors of book covers:</i><br/>" +
      "Paula Rodriguez - 1984<br/>" +
      "Marc Storrs and Rob Morphy - Na Tropie Nieznanych<br/>" +
      "Cat Finnie - Stary Czlowiek I Morze<br/>" +
      "Andrew Brozyna - Hobbit<br/>" +
      "Viacheslav Vystupov - Wojna Swiatow<br/>" +
      "Marc Storrs and Rob Morphy - Zegar Pomaranczowy Pracz<br/>" +
      "Andrew Evan Harner - Ksiega Dzungli",
    markupEnabled: true,
    layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: [linkTextView, 10]}
  }).appendTo(page);
  return page;
}*/