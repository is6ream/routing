"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.db = {
    courses: [
        { id: 1, title: 'front-end', studentsCount: 10 },
        { id: 2, title: 'back-end', studentsCount: 10 },
        { id: 3, title: 'automation qa', studentsCount: 10 },
        { id: 4, title: 'devops', studentsCount: 10 },
    ],
    users: [
        { id: 1, userName: 'dimych' },
        { id: 2, userName: 'Danil' }
    ],
    studentCourseBindings: [
        { studentId: 1, courseId: 1, date: new Date(2025, 1, 1) },
        { studentId: 1, courseId: 2, date: new Date(2025, 1, 1) },
        { studentId: 2, courseId: 2, date: new Date(2025, 1, 1) },
    ]
};
//# sourceMappingURL=db.js.map