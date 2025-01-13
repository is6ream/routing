"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Создаем приложение express
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const products = [{ id: 1, title: 'tomato' }, { id: 2, title: 'orange' }, { id: 3, title: 'apple' }];
const addresses = [{ id: 1, value: 'Mira 11' }, { id: 2, value: 'Gafuri 52' }];
app.use(express_1.default.json()); // Для обработки JSON данных
app.get('/products', (req, res) => {
    if (req.query.title) {
        let searchString = req.query.title.toString();
        res.send(products.filter(p => p.title.indexOf(searchString) > -1));
    }
    else {
        res.send(products);
    }
});
app.post('/products', (req, res) => {
    const newProduct = {
        id: Math.floor(Math.random() * 100),
        title: req.body.title
    };
    products.push(newProduct);
    res.status(201).send(newProduct);
});
app.get('/products/:id', (req, res) => {
    let product = products.find(p => p.id === +req.params.id);
    if (product) {
        res.send(product);
    }
    else {
        res.sendStatus(404);
    }
});
app.put('/products/:id', (req, res) => {
    let product = products.find(p => p.id === +req.params.id);
    if (product) {
        product.title = req.body.title;
        res.send(product);
    }
    else {
        res.sendStatus(404);
    }
});
app.delete('/products/:id', (req, res) => {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === +req.params.id) {
            products.splice(i, 1); // Удаляет продукт из массива
            res.sendStatus(204); // Отправляет статус 204 (No Content)
            return; // Завершает выполнение функции
        }
    }
    res.sendStatus(404); // Отправляет статус 404 (Not Found), если продукт не найден
});
app.get('/addresses', (req, res) => {
    console.log('Received request for /addresses'); // Логируем запрос
    res.json(addresses); // Возвращаем адреса в формате JSON
});
app.get('/addresses/:id', (req, res) => {
    let address = addresses.find(p => p.id === +req.params.id);
    if (address) {
        res.send(address);
    }
    else {
        res.send(404);
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//express 03 27^00
//39:39
//# sourceMappingURL=Index.js.map