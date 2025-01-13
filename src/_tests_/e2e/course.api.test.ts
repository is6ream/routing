import request from 'supertest'
import { app, HTTP_STATUSES } from '../../Index'
import { title } from 'process'

describe('/products', () => {
  beforeAll(async () => {
    await request(app).delete('/__test__/data')
  });

  it('should return 200 and empty array', async () => {
    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [])
  })


  it('should return 404 for not existing course', async () => {
    await request(app)
      .get('/products/4')
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it('should not create product with incorrect input data', async () => {
    await request(app)
      .post('/products')
      .send({ title: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [])
  })

  let createdProduct: any = null;
  it('should create product with correct input data', async () => {
    const createResponse = await request(app)
      .post('/products')
      .send({ title: 'potato' })
      .expect(HTTP_STATUSES.CREATED_201)

    createdProduct = createResponse.body

    expect(createdProduct).toEqual({
      id: expect.any(Number),
      title: 'potato'
    })
    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [createdProduct])
  })


  let createdProduct2: any = null;

  it('create one more course', async () => {
    const createResponse = await request(app)
      .post('/products')
      .send({ title: 'garlick' })
      .expect(HTTP_STATUSES.CREATED_201)

    createdProduct2 = createResponse.body

    expect(createdProduct2).toEqual({
      id: expect.any(Number),
      title: 'garlick'
    })
    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [createdProduct, createdProduct2])

    it('should not update product with incorrect input data', async () => {
      await request(app)
        .post('/products/' + createdProduct.id)
        .send({ title: '' })
        .expect(HTTP_STATUSES.BAD_REQUEST_400)

      await request(app)
        .get('/products')
        .expect(HTTP_STATUSES.OK_200, createdProduct)
    })


    it('should not update product that not exist', async () => {
      await request(app)
        .post('/products/' + -100)
        .send({ title: 'good title' })
        .expect(HTTP_STATUSES.NOT_FOUND_404)

    })

    it('should update product with correct input data', async () => {
      await request(app)
        .post('/products/' + createdProduct.id)
        .send({ title: 'good new title' })
        .expect(HTTP_STATUSES.NO_CONTENT_204);
    })

    await request(app)
      .get('/products/' + createdProduct.id)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdProduct,
        title: 'good new title'
      })

    await request(app)
      .get('/courses/' + createdProduct2.id)
      .expect(HTTP_STATUSES.OK_200, createdProduct2)

  })

  it('should delete both products', async () => {
    await request(app)
      .delete('/courses' + createdProduct.id)
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app)
      .get('/courses' + createdProduct.id)
      .expect(HTTP_STATUSES.NOT_FOUND_404)

    await request(app)
      .delete('/courses' + createdProduct2.id)
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app)
      .get('/courses' + createdProduct2.id)
      .expect(HTTP_STATUSES.NOT_FOUND_404)

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, [])
  })

})










//34






