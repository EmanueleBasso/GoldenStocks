db = db.getSiblingDB("GoldenStock");
db.createCollection("WikipediaCache", {autoIndexId: true});
db.WikipediaCache.createIndex({societyName: 1}, {unique: true, name: "societyName"});