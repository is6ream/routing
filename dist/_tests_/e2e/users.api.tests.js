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
describe('/', () => {
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
    it('should not create product with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .post('/courses')
            .send({ title: '' })
            .expect(app_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(app_1.HTTP_STATUSES.OK_200, []);
    }));
    let createdProduct = null;
    it('should create product with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(app_1.app)
            .post('/courses')
            .send({ title: 'ux' })
            .expect(app_1.HTTP_STATUSES.CREATED_201);
        createdProduct = createResponse.body;
        expect(createdProduct).toEqual({
            id: expect.any(Number),
            title: 'ux'
        });
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(app_1.HTTP_STATUSES.OK_200, [createdProduct]);
    }));
    let createdProduct2 = null;
    it('create one more course', () => __awaiter(void 0, void 0, void 0, function* () {
        const createResponse = yield (0, supertest_1.default)(app_1.app)
            .post('/courses')
            .send({ title: 'ui' })
            .expect(app_1.HTTP_STATUSES.CREATED_201);
        createdProduct2 = createResponse.body;
        expect(createdProduct2).toEqual({
            id: expect.any(Number),
            title: 'ui'
        });
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(app_1.HTTP_STATUSES.OK_200, [createdProduct, createdProduct2]);
        it('should not update product with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app)
                .post('/courses/' + createdProduct.id)
                .send({ title: '' })
                .expect(app_1.HTTP_STATUSES.BAD_REQUEST_400);
            yield (0, supertest_1.default)(app_1.app)
                .get('/courses')
                .expect(app_1.HTTP_STATUSES.OK_200, createdProduct);
        }));
        it('should not update product that not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app)
                .post('/courses/' + -100)
                .send({ title: 'good title' })
                .expect(app_1.HTTP_STATUSES.NOT_FOUND_404);
        }));
        it('should update product with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.app)
                .post('/courses/' + createdProduct.id)
                .send({ title: 'good new title' })
                .expect(app_1.HTTP_STATUSES.NO_CONTENT_204);
        }));
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdProduct.id)
            .expect(app_1.HTTP_STATUSES.OK_200, Object.assign(Object.assign({}, createdProduct), { title: 'good new title' }));
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdProduct2.id)
            .expect(app_1.HTTP_STATUSES.OK_200, createdProduct2);
    }));
    it('should delete both courses', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .delete('/courses' + createdProduct.id)
            .expect(app_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses' + createdProduct.id)
            .expect(app_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(app_1.app)
            .delete('/courses' + createdProduct2.id)
            .expect(app_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses' + createdProduct2.id)
            .expect(app_1.HTTP_STATUSES.NOT_FOUND_404);
        yield (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(app_1.HTTP_STATUSES.OK_200, []);
    }));
});
//34
//# sourceMappingURL=users.api.tests.js.map