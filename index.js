const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const low = require('lowdb');
const booksRouter = require('./routes/books');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');



const PORT = process.env.PORT || 4000;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "library API",
            version: "1.0.0",
            description: "A simple express library API"
        },
        servers: [
            {
                url: "http://localhost:4000"
            }
        ],
    },
    apis: ["./routes/*.js"]

}

const specs = swaggerJsDoc(options);
const app = express();
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
const fileSync = require('lowdb/adapters/fileSync');

const adapter = new fileSync('db.json');
const db = low(adapter);

db.defaults({ book: [] }).write()

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/books', booksRouter);

app.listen(PORT, () => console.log(`The Server is running on port ${PORT}`));
