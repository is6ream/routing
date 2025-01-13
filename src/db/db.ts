export type UserType = {
    id: number
    userName: string
}

export type CourseType = {
    id: number,
    title: string,
    studentsCount: number
}

export type StudentCourseBinding = {
    studentId: number
    courseId: number,
    date: Date
}
export const db: DBtype = {
    courses: [
        {id: 1, title: 'front-end', studentsCount: 10},
        {id: 2, title: 'back-end', studentsCount: 10},
        {id: 3, title: 'automation qa', studentsCount: 10},
        {id: 4, title: 'devops', studentsCount: 10},
    ],
    users: [
        {id: 1, userName: 'dimych'},
        {id: 2, userName: 'Danil'}
    ],
    studentCourseBindings: [
        {studentId: 1, courseId: 1, date: new Date(2025,1,1)},
        {studentId: 1, courseId: 2, date: new Date(2025,1,1)},
        {studentId: 2, courseId: 2, date: new Date(2025,1,1)},
    ]
}

export type DBtype = {
    courses: CourseType[],
    users: UserType[],
    studentCourseBindings: StudentCourseBinding[]
}