//Setting up connection to mongodb

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

// const monggoConnect = (callback) => {
//   MongoClient.connect(
//     "mongodb+srv://marioreyhan:babanggoreng@cluster0.qumrgtk.mongodb.net/Shop?retryWrites=true&w=majority"
//   )
//     .then((client) => {
//       _db = client.db();
//       callback()
//     })
//     .catch((err) => {
//       console.log(err);
//       throw err;
//     });
// };

// const getDb = () => {
//   if (_db) {
//     return _db;
//   }

//   throw 'No database found';
// }

// exports.monggoConnect = monggoConnect;
// exports.getDb = getDb