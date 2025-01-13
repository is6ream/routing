import express, { Request, Response } from 'express';
import { serialize } from 'v8';
import bodyParser from "body-parser";

// Создаем приложение express
export const app = express();

const port = process.env.PORT || 5000;

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404
}

let products = [{ id: 1, title: 'tomato' }, { id: 2, title: 'orange' }, { id: 3, title: 'apple' }];
let addresses = [{ id: 1, value: 'Mira 11' }, { id: 2, value: 'Gafuri 52' }];

app.use(express.json()); // Для обработки JSON данных

app.get('/products', (req: Request, res: Response) => {
  if (req.query.title) {
    let searchString = req.query.title.toString();
    res.send(products.filter(p => p.title.indexOf(searchString) > -1))
  } else {
    res.send(products)
  }
})

app.post('/products', (req: Request, res: Response) => {

  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    return;
  }
  const newProduct = {
    id: Math.floor(Math.random() * 100),
    title: req.body.title
  };

  products.push(newProduct);


  res.status(HTTP_STATUSES.CREATED_201).send(newProduct);
});

app.get('/products/:id', (req: Request, res: Response) => {
  let product = products.find(p => p.id === +req.params.id)
  if (product) {
    res.send(product)
  } else {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }
});

app.put('/products/:id', (req: Request, res: Response) => {
  let product = products.find(p => p.id === +req.params.id)
  if (product) {
    product.title = req.body.title
    res.send(product)
  } else {
    res.sendStatus(404)
  }
});

app.delete('/products/:id', (req: Request, res: Response) => {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === +req.params.id) {
      products.splice(i, 1); // Удаляет продукт из массива
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204); // Отправляет статус 204 (No Content)
      return; // Завершает выполнение функции
    }
  }
  res.sendStatus(HTTP_STATUSES.NOT_FOUND_404); // Отправляет статус 404 (Not Found), если продукт не найден
});

app.get('/addresses', (req: Request, res: Response) => {
  console.log('Received request for /addresses'); // Логируем запрос
  res.json(addresses); // Возвращаем адреса в формате JSON
});
app.get('/addresses/:id', (req: Request, res: Response) => {
  let address = addresses.find(p => p.id === +req.params.id)
  if (address) {
    res.send(address)
  } else {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }
});

app.delete('/__test__/data',(req,res) => {
  products = [];
  addresses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//express 03 27^00
//39:39