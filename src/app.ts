import express, { Request, Response } from 'express';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from './types';
import { CourseCreateInputModel } from './models/CreateCoursesModel';
import { UpdateCourseModel } from './models/UpdateCoursesModel';
import { GetCoursesQueryModel } from './models/QueryCoursesModel';
import { CourseViewModel } from './models/CourseViewModel';
import { URIParamsCourseIDModel } from './models/URIParamsCourseIDModel'
import { title } from 'process';
import { create } from 'domain';
import { log } from 'console';
import { addCourseRoutes } from './routes/routes';

export const app = express()

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

const jsonBodyMiddleware = express.json() //преобразует тело запроса (JSON) в JS-объект и помещает его в req.body
app.use(jsonBodyMiddleware) //добавляет указанные middleware ко всем маршрутам приложения

type CourseType = {
    id: number,
    title: string,
    studentsCount: number
}
 export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title,
        studentsCount: dbCourse.studentsCount
    }
}
 addCourseRoutes(app)
