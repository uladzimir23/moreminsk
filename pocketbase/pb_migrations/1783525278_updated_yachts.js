/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3819339800")

  // add field
  collection.fields.addAt(20, new Field({
    "hidden": false,
    "id": "file142008537",
    "maxSelect": 12,
    "maxSize": 5242880,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif"
    ],
    "name": "photos",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "320x320"
    ],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3819339800")

  // remove field
  collection.fields.removeById("file142008537")

  return app.save(collection)
})
