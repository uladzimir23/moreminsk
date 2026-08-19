/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3819339800",
        "hidden": false,
        "id": "_clone_U3k4",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "yacht",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_kAfo",
        "max": 0,
        "min": 0,
        "name": "date",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_jr5F",
        "max": 0,
        "min": 0,
        "name": "start",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_NYDP",
        "max": 0,
        "min": 0,
        "name": "end",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "_clone_IdpY",
        "maxSelect": 1,
        "name": "status",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "booked",
          "blocked",
          "tentative"
        ]
      },
      {
        "hidden": false,
        "id": "_clone_fCVp",
        "name": "archived",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      }
    ],
    "id": "pbc_3751492716",
    "indexes": [],
    "listRule": "",
    "name": "availability",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT id, yacht, date, start, end, status, archived FROM bookings WHERE archived = false",
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3751492716");

  return app.delete(collection);
})
