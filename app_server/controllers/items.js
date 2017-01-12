var db = require("nano")("http://192.168.148.134:5984").use("testdb");

module.exports.itemsList = function(req, res){
    db.view('viewByAuthor', 'view_by_author',  function (err, body, header) {
        if (err) {
            console.log("[Querying books failed]", err); }
        else {
            //console.log("[Books queried. Response:]", JSON.stringify(body));
        }
        renderHomepage(req, res, body);
    });
};

var renderHomepage = function(req, res, responseBody){
    var message;
    //console.dir(responseBody.rows);
    if (!(responseBody.rows instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.rows.length) {
            message = "No items in database";
        }
    }
    res.render('items-list', {
        title: 'CouchDB + Nodejs + Express + Nano + Pug',
        pageHeader: {
            title: 'CouchDB + Nodejs + Express + Nano + Pug',
            strapline: 'Quick CRUD test'
        },
        items: responseBody.rows,
        message: message
    });
};

var renderDetailPage = function (req, res, itemDetail) {
    res.render('item-detail', {
        title: itemDetail.Title,
        pageHeader: {title: itemDetail.Title},
        item: itemDetail
    });
};

module.exports.itemInfo = function(req, res){
    getItemInfo(req, res, function(req, res, responseData) {
        // pass the following named callback function to the getItemInfo Function
        renderDetailPage(req, res, responseData);
    });
};

var getItemInfo = function (req, res, callback) {
    db.get(req.params.itemid, { revs_info: true }, function (err, body) {
        if (!err) {
            console.log("[Document retrieved]", JSON.stringify(body));
            callback(req, res, body);
        } else {
            console.log("[Error retrieving document]", JSON.stringify(body));
        }
    });
};

module.exports.addItem = function(req, res){
    res.render('item-form');
};

module.exports.doAddItem = function(req, res){
    var newItem = {
        Title: req.body.title,
        Author: req.body.author,
        ISBN: req.body.ISBN,
        Type: req.body.type,
        Updated: new Date
    };
    db.insert(newItem, function(err, body, header) {
        if(err) {
            console.log("[Inserting item failed]", err);
        } else {
            console.log("[Item inserted.]", JSON.stringify(body));
            res.redirect('/item/' + body.id);
        }
    });
};

module.exports.deleteItem = function(req, res){
    db.get(req.params.itemid, function (error, existingDoc) {
        if (!error) {
            db.destroy(req.params.itemid, existingDoc._rev, function (err, body, header) {
                if (!err) {
                    console.log("[Item deleted]", JSON.stringify(body));
                    res.redirect('/');
                } else {
                    console.log("[Failed to delete]", err);
                }
            })
        }
    })
};

module.exports.updateItem = function(req, res){
    db.get(req.params.itemid, function (error, existingDoc) {
        if (!error) {
            existingDoc.Updated = new Date;
            db.insert(existingDoc, existingDoc._id, function (err, body, header) {
                if (!err) {
                    console.log("[Item updated]", JSON.stringify(body));
                    res.redirect('/item/' + existingDoc._id);
                } else {
                    console.log("[Failed to update]", err);
                }
            })
        }
    })
};