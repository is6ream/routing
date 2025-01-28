import { db } from '../db/db';
import { UpdateCourseModel } from './../models/UpdateCoursesModel';
import { CourseViewModel } from './../models/CourseViewModel';
import { app, HTTP_STATUSES } from './../app';
import { URIParamsCourseIDModel } from "../models/URIParamsCourseIDModel";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "../types";
import { Response, Request } from 'express';
import { Express } from 'express';

interface CourseType {
    id: number;
    title: string;
    studentsCount: number;
}
export { HTTP_STATUSES } from '../app'
import { getCourseViewModel } from '../app'
import { CourseCreateInputModel } from '../models/CreateCoursesModel';
import { GetCoursesQueryModel } from '../models/QueryCoursesModel';

export const addCourseRoutes = (app: Express) => {


    app.get('/courses', (req: RequestWithQuery<GetCoursesQueryModel>,
        res: Response<CourseViewModel[]>) => {
        let foundCourses = db.courses

        if (req.query.title) {
            foundCourses = foundCourses
                .filter(c => c.title.indexOf(req.query.title) > -1)
        }
        res.json(foundCourses.map(getCourseViewModel))
    })

    app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIDModel>,
        res: Response<CourseViewModel>) => {
        const foundCourse = db.courses.find(c => c.id === +req.params.id)

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        res.json(getCourseViewModel(foundCourse))
    })

    app.post('/courses', (req: RequestWithBody<CourseCreateInputModel>, res: Response<CourseViewModel>) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
            return;
        }

        const createdCourse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 10
        };

        db.courses.push(createdCourse);

        res.status(HTTP_STATUSES.CREATED_201).json(getCourseViewModel(createdCourse));
    });


    app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIDModel>,
        res: Response) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIDModel,
        UpdateCourseModel>,
        res: Response) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }
        console.log(db.courses, ' db.courses before update')
        const foundCourseId = db.courses.findIndex(c => c.id === +req.params.id)
        console.log(foundCourseId, ' foundCourseId')
        if (foundCourseId === -1) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        db.courses[foundCourseId].title = req.body.title
        //foundCourse.title = req.body.title
        console.log(db.courses, 'after update')
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    //остановился на рассмотрении метода пут


    app.delete('/__test__/data', (req: Request, res: Response) => {
        db.courses = []
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })


}