// // employee-detail-view.entity.ts

// import { ViewEntity, ViewColumn } from 'typeorm';

// @ViewEntity({
//     name: 'employee_detail_view',
//     expression: `
//         SELECT e.id AS employee_id, e.name AS employee_name, e.age, d.name AS department_name
//         FROM employees e
//         INNER JOIN departments d ON e.department_id = d.id
//     `
// })
// export class EmployeeDetailView {
//     @ViewColumn()
//     employee_id: number;

//     @ViewColumn()
//     employee_name: string;

//     @ViewColumn()
//     age: number;

//     @ViewColumn()
//     department_name: string;
// }
