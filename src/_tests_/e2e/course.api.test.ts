import request from 'supertest'
import { CourseCreateInputModel } from '../../models/CreateCoursesModel'
import { UpdateCourseModel } from '../../models/UpdateCoursesModel'
import { app, HTTP_STATUSES } from '../../app'
import { CreateContextOptions } from 'vm'
import { title } from 'process'
import exp from 'constants'
import { countReset } from 'console'

const getRequest = () => {
  return request(app)
}


describe('/course', () => {
  beforeAll(async () => {
    await getRequest().delete('/__test__/data')
  })

  it('should return 200 and empty array', async () => {
    await getRequest()
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, [])
  })

  it('should return 404 for not existing course', async () => {
    await getRequest()
      .get('/courses/1')
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it('shouldn not create course with incorrect input data', async () => {
    const data: CourseCreateInputModel = { title: '' }

    await request(app)
      .post('/courses')
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, [])
  })

  let createdCourse1: any = null
  it('should create course with correct input data', async () => {
    const data: CourseCreateInputModel = { title: 'it-incubator backend' }

    const createResponse = await request(app)
      .post('/courses')
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201)

    createdCourse1 = createResponse.body

    expect(createdCourse1).toEqual({
      id: expect.any(Number),
      title: 'it-incubator backend'
    })

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, [createdCourse1])
  })

  let createdCourse2: any = null;
  it('create one more course', async () => {
    const data: CourseCreateInputModel = { title: 'it-incubator frontend' }

    const createResponse = await request(app)
      .post('/courses')
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201)

    createdCourse2 = createResponse.body

    expect(createdCourse2).toEqual({
      id: expect.any(Number),
      title: data.title
    })
    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
  }
  //почему здесь мы ожидаем не второй созданный курс, а оба
  )

  it('should not update course with incorrect input data', async () => {
    const data: CourseCreateInputModel = { title: '' }

    await request(app)
      .put('/courses' + createdCourse1.id)
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

      await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, createdCourse1)
  })

  it('should update course wiith correct input data', async () => {
    const data: UpdateCourseModel = { title: 'good new title'}

    await request(app)
    .put('/courses/' + createdCourse1.id)
    .expect(HTTP_STATUSES.OK_200, {
      ...createdCourse1,
      title: data.title
    }) //разобраться с раскукоживанием

    await request(app)
    .get('/courses/' + createdCourse2.id)
    .expect(HTTP_STATUSES.OK_200, createdCourse2)
  })

  it('should delete both courses', async() => {
    await request(app)
    .delete('/courses/' + createdCourse1.id)
    .expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app)
    .get('/courses/' + createdCourse1.id)
    .expect(HTTP_STATUSES.NOT_FOUND_404)

    await request(app)
    .get('/courses/' + createdCourse2.id)
    .expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app)
    .get('/courses/' + createdCourse2.id)
    .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  afterAll(done => {
    done()
  })
})

//7:17 routing