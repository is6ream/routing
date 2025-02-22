"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
describe('/courses', () => {
    let createdCourse = null;
    let createdCourse2 = null;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).delete('/__test__/data');
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(app_1.HTTP_STATUSES.OK_200, []);
    }));
    it('should return 404 for not existing course', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses/4')
            .expect(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should not create course with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: '' };
        yield (0, supertest_1.default)(app_1.app)
            .post('/courses')
            .send(data)
            .expect(app_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(app_1.HTTP_STATUSES.OK_200, []);
    }));
    it('should create course with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'ux' };
        const createResponse = yield (0, supertest_1.default)(app_1.app)
            .post('/courses')
            .send(data)
            .expect(app_1.HTTP_STATUSES.CREATED_201), createdCourse = createResponse.body;
        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: 'ux',
            studentsCount: null
        });
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(app_1.HTTP_STATUSES.OK_200, [createdCourse]);
    }));
    it('should create one more course', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'ui' };
        const createResponse = yield (0, supertest_1.default)(app_1.app)
            .post('/courses')
            .send(data)
            .expect(app_1.HTTP_STATUSES.CREATED_201);
        createdCourse2 = createResponse.body;
        expect(createdCourse2).toEqual({
            id: expect.any(Number),
            title: data.title,
            studentsCount: null
        });
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(app_1.HTTP_STATUSES.OK_200, [createdCourse, createdCourse2])
            .then(response => {
            expect(response.body).toContainEqual(createdCourse);
            expect(response.body).toContainEqual(createdCourse2);
        });
    }));
    it('should update course with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: 'good new title' };
        yield (0, supertest_1.default)(app_1.app)
            .put('/courses/' + createdCourse.id)
            .send(data)
            .expect(app_1.HTTP_STATUSES.OK_200);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourse.id)
            .expect(app_1.HTTP_STATUSES.OK_200, Object.assign(Object.assign({}, createdCourse), { title: 'good new title' }));
    }));
    it('should not update course with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = { title: '' };
        yield (0, supertest_1.default)(app_1.app)
            .put(`/courses/${createdCourse.id}`)
            .send(data)
            .expect(app_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(app_1.HTTP_STATUSES.OK_200, [createdCourse, createdCourse2]);
    }));
    it('should not update course that does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .put('/courses/' + -100)
            .send({ title: 'good title' })
            .expect(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should delete both courses', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete('/courses/' + createdCourse.id)
            .expect(app_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourse.id)
            .expect(app_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(app_1.app)
            .delete('/courses/' + createdCourse2.id)
            .expect(app_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourse2.id)
            .expect(app_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
});
//сделать маппинг
//# sourceMappingURL=course.api.test.js.map