const express = require("express");

const router = express.Router();

const db = require("../config/db");

const auth =
require("../middleware/authMiddleware");

router.get("/", auth, (req, res) => {

  const userId = req.user.id;

  const sql = `
    SELECT notes.*,
    categories.name AS category_name
    FROM notes
    JOIN categories
    ON notes.category_id = categories.id
    WHERE notes.user_id = ?
  `;

  db.query(sql, [userId], (err, data) => {

    if (err) {

      return res.status(500).json(err);

    }

    res.status(200).json(data);

  });

});

router.get("/:id", auth, (req, res) => {

  const id = req.params.id;

  const userId = req.user.id;

  const sql =
  "SELECT * FROM notes WHERE id=? AND user_id=?";

  db.query(sql, [id, userId], (err, data) => {

    if (err) {

      return res.status(500).json(err);

    }

    if (!data.length) {

      return res.status(404).json({

        message: "Note Not Found"

      });

    }

    res.status(200).json(data[0]);

  });

});

router.post("/", auth, (req, res) => {

  const { title, content, category_id }
  = req.body;

  const userId = req.user.id;

  const sql = `
    INSERT INTO notes
    (title,content,user_id,category_id)
    VALUES(?,?,?,?)
  `;

  db.query(

    sql,

    [title, content, userId, category_id],

    (err) => {

      if (err) {

        return res.status(500).json(err);

      }

      res.status(201).json({

        message: "Note Created"

      });

    }

  );

});

router.put("/:id", auth, (req, res) => {

  const noteId = req.params.id;

  const userId = req.user.id;

  const { title, content, category_id }
  = req.body;

  const checkSql =
  "SELECT * FROM notes WHERE id=? AND user_id=?";

  db.query(checkSql, [noteId, userId], (err, data) => {

    if (err) {

      return res.status(500).json(err);

    }

    if (!data.length) {

      return res.status(403).json({

        message:"Not Authorized"

      });

    }

    const updateSql = `
      UPDATE notes
      SET title=?,content=?,category_id=?
      WHERE id=?
    `;

    db.query(

      updateSql,

      [title, content, category_id, noteId],

      (err) => {

        if (err) {

          return res.status(500).json(err);

        }

        res.status(200).json({

          message:"Note Updated"

        });

      }

    );

  });

});

router.delete("/:id", auth, (req, res) => {

  const noteId = req.params.id;

  const userId = req.user.id;

  const sql =
  "DELETE FROM notes WHERE id=? AND user_id=?";

  db.query(

    sql,

    [noteId, userId],

    (err, result) => {

      if (err) {

        return res.status(500).json(err);

      }

      if (result.affectedRows === 0) {

        return res.status(403).json({

          message:"Not Authorized"

        });

      }

      res.status(200).json({

        message:"Note Deleted"

      });

    }

  );

});


module.exports = router;