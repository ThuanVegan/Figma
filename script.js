// Employee Model
class Employee {
    constructor(employee_name, employee_role, employee_type) {
        // Employee
        this.employee_name = employee_name;
        // Role
        this.employee_role = employee_role;
        // Employment Type
        this.employee_type = employee_type;
    }
}

// TimeKeepingModel
class TimeKeepingModel {
    constructor(date, status, employee, checkin, checkout) {
        // Date
        this.date = date;
        // Status
        this.status = status;
        // Refer to EmployeeModel
        this.employee = employee;
        // Check In
        this.checkin = checkin;
        // Check Out
        this.checkout = checkout;
    }
}

// Sample Data Generation
const employeeRoles = ['Developer', 'Designer', 'Manager', 'Tester'];
const employeeTypes = ['Full-Time', 'Part-Time', 'Contract'];
const statuses = ['Present', 'Absent', 'Late', 'On Leave'];

// Function to generate a random element from an array
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Generate sample employees
const employees = [
    new Employee('Lê Cẩm', getRandomElement(employeeRoles), getRandomElement(employeeTypes)),
    new Employee('Nguyễn Đăng Quang', getRandomElement(employeeRoles), getRandomElement(employeeTypes)),
    new Employee('Hồ Thị Ngọc Hoàng', getRandomElement(employeeRoles), getRandomElement(employeeTypes)),
    new Employee('Viên Thị Minh Hiếu', getRandomElement(employeeRoles), getRandomElement(employeeTypes)),
];

// Hàm tạo giờ ngẫu nhiên trong một khoảng thời gian cho trước
function getRandomTimeInRange(startHour, endHour) {
    const hours = String(Math.floor(Math.random() * (endHour - startHour + 1)) + startHour).padStart(2, '0'); // Random giờ từ startHour đến endHour
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0'); // Random phút (0 - 59)
    return `${hours}:${minutes}`;
}

// Tạo thời gian Check In và Check Out
function getRandomTime() {
    // Check In: Random từ 08:00 đến 12:00 (giả định giờ vào làm là buổi sáng)
    return getRandomTimeInRange(8, 12);
}

function getRandomCheckoutTime() {
    // Check Out: Random từ 17:00 đến 20:00 (giả định giờ tan làm có thể muộn)
    return getRandomTimeInRange(17, 20);
}

// Generate sample timekeeping records
const timeKeepingRecords = employees.map(employee => {
    const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const status = getRandomElement(statuses);
    const checkin = status === 'Present' || status === 'Late' ? getRandomTime() : null; // Check In ngẫu nhiên
    const checkout = checkin ? getRandomCheckoutTime() : null; // Check Out từ 17:00 trở đi
    return new TimeKeepingModel(date, status, employee, checkin, checkout);
});


function retrieveEmployeeRecords() {
    return employees;
}

function retrieveTimeKeepingRecords() {
    return timeKeepingRecords;
}

// ===== Write for data-list feature
// B1. Lấy dữ liệu từ server
const timeKeepings = retrieveTimeKeepingRecords();

// B2. Fill dữ liệu vào trong table body
// B2.1. Tìm ra được table body tag
const timeKeepingDataListElement = document.getElementById("time-keeping-data-list");

// B2.2. Đổ data từ timeKeepings vào timeKeepingDataListElement
function fillCheckInTime(checkIn) {
    if (checkIn == null) {
        return "-";
    }
    return checkIn;
}
function fillCheckOutTime(checkOut) {
    if (checkOut == null) {
        return "-";
    }
    return checkOut;
}

// Hàm chuyển đổi giờ HH:mm sang tổng số phút
function convertToMinutes(time) {
    if (!time) return 0; // Xử lý trường hợp null hoặc undefined
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

// Hàm tính overtime
function calculateOvertime(checkOut, endOfShift = "17:00") {
    const checkoutMinutes = convertToMinutes(checkOut);
    const endOfShiftMinutes = convertToMinutes(endOfShift);

    // Tính số phút overtime
    const overtimeMinutes = checkoutMinutes > endOfShiftMinutes
        ? checkoutMinutes - endOfShiftMinutes
        : 0;

    // Chuyển đổi số phút thành định dạng "Xh Ym"
    const hours = Math.floor(overtimeMinutes / 60);
    const minutes = overtimeMinutes % 60;
    return `${hours}h ${minutes}m`;
}

// Vòng lặp tính toán và hiển thị dữ liệu
for (let index = 0; index < timeKeepings.length; index++) {
    const timeKeeping = timeKeepings[index];

    // Tính toán overtime
    const overtime = calculateOvertime(timeKeeping.checkout, "17:00");

    // Fill dữ liệu vào trong timeKeepingDataListElement
    const timeKeepingfilled = document.createElement("tr");
    
    // Lấy class CSS cho employee_type
    let employeeTypeClass = '';
    if (timeKeeping.employee.employee_type === 'Full-Time') {
        employeeTypeClass = 'full-time';
    } else if (timeKeeping.employee.employee_type === 'Part-Time') {
        employeeTypeClass = 'part-time';
    } else if (timeKeeping.employee.employee_type === 'Contract') {
        employeeTypeClass = 'contract';
    } 

    // Lấy class CSS cho status
    let statusClass = '';
    if (timeKeeping.status === 'Present') {
        statusClass = 'present';
    } else if (timeKeeping.status === 'Absent') {
        statusClass = 'absent';
    } else if (timeKeeping.status === 'Late') {
        statusClass = 'late';
    } else if (timeKeeping.status === 'On Leave') {
        statusClass = 'on-leave';
    }
    
    timeKeepingfilled.innerHTML = `
        <td>13/01</td>
        <td class="employee-cell">
            <img src="./Image/image 1.png" alt="" class="employee-avatar">
            <span>${timeKeeping.employee.employee_name}</span>
        </td>
        <td>${timeKeeping.employee.employee_role}</td>
        <td>
            <span class="tag ${employeeTypeClass}">${timeKeeping.employee.employee_type}</span>
        </td>
        <td>
            <span class="tag ${statusClass}">${timeKeeping.status}</span>
        </td>
        <td>${fillCheckInTime(timeKeeping.checkin)}</td>
        <td>${fillCheckOutTime(timeKeeping.checkout)}</td>
        <td>${overtime}</td>
    `;

    timeKeepingDataListElement.appendChild(timeKeepingfilled);
}
