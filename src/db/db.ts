
type CourseType = {
    id: number,
    title: string,
    studentsCount: number
}

export const db: DBType = {
    
}

export type DBType = { courses: CourseType[]}
