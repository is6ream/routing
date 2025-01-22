import request from 'supertest';
import { app, HTTP_STATUSES } from '../../app';
import { CourseCreateInputModel } from '../../models/CreateCoursesModel';
import { UpdateCourseModel } from '../../models/UpdateCoursesModel';

let createdCourse: any = null;
let createdCourse2: any = null;

beforeEach(async () => {
  await request(app).delete('/__test__/data'); // Очистка базы перед началом тестов
});

describe('/courses', () => {
  beforeAll(async () => {
    await request(app).delete('/__test__/data');
  });

  it('should return 200 and empty array', async () => {
    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, []);
  });

  it('should return 404 for not existing course', async () => {
    await request(app)
      .get('/courses/4')
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('should not create course with incorrect input data', async () => {
    const data: CourseCreateInputModel = { title: '' };
    await request(app)
      .post('/courses')
      .send(data)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, []);
  });

  it('should create course with correct input data', async () => {
    const data: CourseCreateInputModel = { title: 'ux' };
    const createResponse = await request(app)
      .post('/courses')
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);
    createdCourse = createResponse.body;

    expect(createdCourse).toEqual({
      id: expect.any(Number),
      title: 'ux',
      studentsCount: 10
    });

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, [createdCourse]);
  });

  it('should create one more course', async () => {
    const data: CourseCreateInputModel = { title: 'ui'};
    const createResponse = await request(app)
      .post('/courses')
      .send(data)
      .expect(HTTP_STATUSES.CREATED_201);
    createdCourse2 = createResponse.body;

    expect(createdCourse2).toEqual({
      id: expect.any(Number),
      title: 'ui',
      studentsCount: 10
    });

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, [createdCourse, createdCourse2]);
  });

  it('should update course with correct input data', async () => {
    await request(app)
      .put('/courses/' + createdCourse.id)
      .send({ title: 'updated title' })
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get('/courses/' + createdCourse.id)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdCourse,
        title: 'updated title'
      });
  });

  it('should not update course with incorrect input data', async () => {
    await request(app)
      .put('/courses/' + createdCourse.id)
      .send({ title: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, [createdCourse, createdCourse2]);
  });

  it('should not update course that does not exist', async () => {
    await request(app)
      .put('/courses/' + -100)
      .send({ title: 'good title' })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('should delete both courses', async () => {
    let createResponse = await request(app)
      .post('/courses')
      .send({ title: 'Course 1' })
      .expect(HTTP_STATUSES.CREATED_201);
    const createdCourse1 = createResponse.body;

    createResponse = await request(app)
      .post('/courses')
      .send({ title: 'Course 2' })
      .expect(HTTP_STATUSES.CREATED_201);
    const createdCourse2 = createResponse.body;

    await request(app)
      .delete('/courses/' + createdCourse1.id)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .delete('/courses/' + createdCourse2.id)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get('/courses')
      .expect(HTTP_STATUSES.OK_200, []);
  });
});
