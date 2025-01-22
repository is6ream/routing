import express, { Request, Response } from 'express';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from './types';
import { CourseCreateInputModel } from './models/CreateCoursesModel';
import { UpdateCourseModel } from './models/UpdateCoursesModel';
import { GetCoursesQueryModel } from './models/QueryCoursesModel';
import { CourseViewModel } from './models/CourseViewModel';
import { URIParamsCourseIDModel } from './models/URIParamsCourseIDModel'
import { title } from 'process';
import { create } from 'domain';

export const app = express()
const port = 3000

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

const db: { courses: CourseType[] } = {
    courses: [
        { id: 1, title: 'front-end', studentsCount: 10 },
        { id: 2, title: 'back-end', studentsCount: 10 },
        { id: 3, title: 'automation-qa', studentsCount: 10 },
        { id: 4, title: 'devops', studentsCount: 10 },
    ]
}

const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

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
    const foundCourse = db.courses.find(c => c.id = +req.params.id)

    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }

    res.json(getCourseViewModel(foundCourse))
})

app.post('/courses', (req: RequestWithBody<CourseCreateInputModel>,
    res: Response<CourseViewModel>) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
    }
    const createdCourse: CourseType = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 0
    }

    db.courses.push(createdCourse)

    res
        .sendStatus(HTTP_STATUSES.CREATED_201)
        .json(getCourseViewModel(createdCourse))
})


app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIDModel>,
    res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIDModel,
    UpdateCourseModel>,
    res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
    }
    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    foundCourse.title = req.body.title

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

//остановился на рассмотрении метода пут


app.delete('/__test/data', (req, res) => {
    db.courses = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

export const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})