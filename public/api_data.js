define({ "api": [
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./public/main.js",
    "group": "/home/santhosh/Desktop/pocs/Game21/public/main.js",
    "groupTitle": "/home/santhosh/Desktop/pocs/Game21/public/main.js",
    "name": ""
  },
  {
    "type": "GET",
    "url": "/game/game_id/dealer",
    "title": "Request to draw cards to Dealer from current deck",
    "name": "Dealer_Twist",
    "group": "Game21",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_id",
            "description": "<p>Game/Round Unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 Ok\n  {  \n    \"message\" : \"\"  \n    \"result\": {}\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"message\": \"\"\n}\nHTTP/1.1 500 Internal server error\n{\n  \"message\": \"\"\n}\nHTTP/1.1 400 Bad request\n{\n  \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/dealer.js",
    "groupTitle": "Game21"
  },
  {
    "type": "POST",
    "url": "/game/new_game",
    "title": "Request to start New Game which sends the game id, players details",
    "name": "NewGame",
    "group": "Game21",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "player_count",
            "defaultValue": "1",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n  {  \n      \"message\": \"Game is been initiated\",\n      \"game_id\": \"5eea239de9f3d6628a05e45b\",\n      \"players\": []\n   }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"message\": \"\"\n}\nHTTP/1.1 500 Internal server error\n{\n  \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/new_game.js",
    "groupTitle": "Game21"
  },
  {
    "type": "GET",
    "url": "/game/player_id",
    "title": "Request to get the history for a given player",
    "name": "Player_History",
    "group": "Game21",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "player_id",
            "description": "<p>Player unique name.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 Ok\n  {  \n      \"player\": {}\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"message\": \"\"\n}\nHTTP/1.1 404 No Record Found\n{\n  \"message\": \"\"\n}\nHTTP/1.1 400 Bad request\n{\n  \"message\": \"\",\n  \"error\" : {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/player_history.js",
    "groupTitle": "Game21"
  },
  {
    "type": "PUT",
    "url": "/game/game_id/save",
    "title": "Request to save the state after each rounds",
    "name": "Save",
    "group": "Game21",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_id",
            "description": "<p>Game/Round Unique ID.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Input:",
          "content": "{\n  \"game_status\": \"done\", //game_status provided from the dealer API\n  \"game_end_status\" : [] //game_end_status provided from the dealer API\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 Ok\n  {  \n    \"message\" : \"\"  \n    \"result\": {}\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"message\": \"\"\n}\nHTTP/1.1 500 Internal server error\n{\n  \"message\": \"\"\n}\nHTTP/1.1 400 Bad request\n{\n  \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/save.js",
    "groupTitle": "Game21"
  },
  {
    "type": "GET",
    "url": "/game/stand/game_id/player_id",
    "title": "Request to stand the player after the twist",
    "name": "Stand",
    "group": "Game21",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_id",
            "description": "<p>Game/Round Unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "player_id",
            "description": "<p>Player unique name.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 Ok\n  {  \n    \"message\" : \"\"  \n    \"player\": {}\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"message\": \"\"\n}\nHTTP/1.1 500 Internal server error\n{\n  \"message\": \"\"\n}\nHTTP/1.1 400 Bad request\n{\n  \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/stand.js",
    "groupTitle": "Game21"
  },
  {
    "type": "GET",
    "url": "/game/twist/game_id/player_id",
    "title": "Request to draw cards to specific player from current deck",
    "name": "Twist",
    "group": "Game21",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "game_id",
            "description": "<p>Game/Round Unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "player_id",
            "description": "<p>Player unique name.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 Ok\n  {  \n      \"player\": [],\n      \"message\" : \"\"\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"message\": \"\"\n}\nHTTP/1.1 500 Internal server error\n{\n  \"message\": \"\"\n}\nHTTP/1.1 400 Bad request\n{\n  \"message\": \"\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./controllers/twist.js",
    "groupTitle": "Game21"
  }
] });
