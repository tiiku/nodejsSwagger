const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const idLength = 8;

/**
 * @swagger
 * components:
 *  schemas:
 *    Book:
 *      type: object
 *      required:
 *        - title
 *        - author
 *      properties:
 *        id:
 *          type: string
 *          description: The Auto Generated ID of the Book
 *        title:
 *          type: string
 *          description: The Book Title
 *        author:
 *          type: string
 *          description: The Book Author
 *      example:
 *        id: d5fE_asz
 *        title:  How to win friends and influence the people
 *        author: dale carnigie
 */

/**
 * @swagger
 * tags:
 *  name: Books
 *  description: The Book Managing API
 */

/**
 * @swagger
 * /books:
 *    get:
 *      summary: Return the list of all books
 *      tags:  [Books]
 *      responses:
 *        200:
 *          description: The list of all books
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Book'
 */

router.get("/", (req, res) => {
  const books = req.app.db.get("books");

  res.send(books);
});

/**
 * @swagger
 * /books/{id}:
 *    get:
 *       summary:  Get the book by id
 *       tags: [Books]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *             required: true
 *             description: The Book ID
 *       responses:
 *         200:
 *           description: The book description by ID
 *           contents:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Book'
 *         404:
 *           description: The book was not found.
 */

router.get("/:id", (req, res) => {
  const book = req.app.db.get("books").find({ id: req.params.id }).value();
  if (!book) {
    res.sendStatus(404);
  }
  res.send(book);
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */

router.post("/", (req, res) => {
  try {
    const book = {
      id: nanoid(idLength),
      ...req.body,
    };
    req.app.db.get("books").push(book).write();
    res.send(book);
  } catch (err) {
    return res.status(500).send(err);
  }
});

/**
 * @swagger
 * /books/{id}:
 *  put:
 *    summary: Update the book by ID
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description:  The Book ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was Updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Server Error
 */

router.put("/:id", (req, res) => {
  try {
    req.app.db
      .get("books")
      .find({ id: req.params.id })
      .assign(req.body)
      .write();
    res.send(req.app.db.get("books").find({ id: req.params.id }));
  } catch (err) {
    res.status(500).send(err);
  }
});
/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Remove The Book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */

router.delete("/:id", (req, res) => {
  req.app.db.get("books").remove({ id: req.params.id }).write();
  res.sendStatus(200);
});

module.exports = router;
