# 学生成绩管理系统 API 文档

## 项目概述

学生成绩管理系统是一个基于前端技术的学生信息管理平台，提供完整的RESTful风格的API接口，便于与其他系统集成。

## 基础信息

- **基础URL**: 本地存储（无服务器端API）
- **数据格式**: JSON
- **认证方式**: 无（本地应用）

## 学生管理 API

### 获取所有学生

```javascript
const students = studentManager.getAllStudents();
```

**返回格式**:

```json
[
{
"id": "1640995200000",
"name": "张三",
"studentId": "2021001",
"class": "高一(1)班",
"grade": "高一",
"createdAt": "2021-12-31T16:00:00.000Z",
"updatedAt": "2021-12-31T16:00:00.000Z"
}
]
```

### 根据ID获取学生

```javascript
const student = studentManager.getStudent(studentId);
```

**参数**:

- `studentId` (string): 学生ID

**返回格式**:

```json
{
"id": "1640995200000",
"name": "张三",
"studentId": "2021001",
"class": "高一(1)班",
"grade": "高一",
"createdAt": "2021-12-31T16:00:00.000Z",
"updatedAt": "2021-12-31T16:00:00.000Z"
}
```

### 添加学生

```javascript
const studentData = {
name: "张三",
studentId: "2021001",
class: "高一(1)班",
grade: "高一"
};
const success = studentManager.addStudent(studentData);
```

**参数**:

- `name` (string): 学生姓名（必填）

- `studentId` (string): 学号（必填）
- `class` (string): 班级（必填）
- `grade` (string): 年级（可选）

**返回格式**:

```json
{
"id": "1640995200000",
"name": "张三",
"studentId": "2021001",
"class": "高一(1)班",
"grade": "高一",
"createdAt": "2021-12-31T16:00:00.000Z",
"updatedAt": "2021-12-31T16:00:00.000Z"
}

```

### 更新学生

```javascript
const studentData = {
name: "张三丰",
class: "高一(2)班"
};
const success = studentManager.updateStudent(studentId, studentData);

```

**参数**:

- `studentId` (string): 学生ID（必填）

- `studentData` (object): 更新的学生数据（可选字段）

### 删除学生

```javascript
const success = studentManager.deleteStudent(studentId);
```

**参数**:

- `studentId` (string): 学生ID（必填）

**注意事项**: 删除学生将同时删除其所有成绩记录

### 计算学生平均分

```javascript
const averageScore = studentManager.calculateAverageScore(studentId);

```

**参数**:

- `studentId` (string): 学生ID

**返回格式**:

```json
85.5

```

### 获取学生统计信息

```javascript
const statistics = studentManager.getStatistics();

```

**返回格式**:

```json

{
"total": 50,
"grades": 3,
"classes": 5,
"gradeDistribution": {
"高一": 20,
"高二": 15,
"高三": 15
}
}

```

## 成绩管理 API

### 获取所有成绩

```javascript
const grades = gradeManager.grades;

```

**返回格式**:

```json

[
{
"id": "1640995200000",
"studentId": "1640995200000",
"examType": "期中考试",
"examDate": "2021-12-31",
"chineseScore": 85,
"mathScore": 90,
"englishScore": 88,
"createdAt": "2021-12-31T16:00:00.000Z",
"updatedAt": "2021-12-31T16:00:00.000Z"
}
]

```

### 根据ID获取成绩

```javascript
const grade = gradeManager.getGrade(gradeId);

```

**参数**:

- `gradeId` (string): 成绩记录ID

**返回格式**:

```json
{
"id": "1640995200000",
"studentId": "1640995200000",
"examType": "期中考试",
"examDate": "2021-12-31",
"chineseScore": 85,
"mathScore": 90,
"englishScore": 88,
"createdAt": "2021-12-31T16:00:00.000Z",
"updatedAt": "2021-12-31T16:00:00.000Z"
}

```

### 获取学生所有成绩

```javascript
const studentGrades = gradeManager.getStudentGrades(studentId);

```

**参数**:

- `studentId` (string): 学生ID
**返回格式**:

```json
[
{
"id": "1640995200000",
"studentId": "1640995200000",
"examType": "期中考试",
"examDate": "2021-12-31",
"chineseScore": 85,
"mathScore": 90,
"englishScore": 88,
"createdAt": "2021-12-31T16:00:00.000Z",
"updatedAt": "2021-12-31T16:00:00.000Z"
}
]

```

### 添加成绩

```javascript
const gradeData = {
studentId: "1640995200000",
examType: "期中考试",
examDate: "2021-12-31",
chineseScore: 85,
mathScore: 90,
englishScore: 88
};
const success = gradeManager.addGrade(gradeData);

```

**参数**:

- `studentId` (string): 学生ID（必填）
- `examType` (string): 考试类型（必填）
- `examDate` (string): 考试日期（必填，格式：YYYY-MM-DD）
- `chineseScore` (number): 语文成绩（可选，默认0）
- `mathScore` (number): 数学成绩（可选，默认0）
- `englishScore` (number): 英语成绩（可选，默认0）
**返回格式**:

```json
{
"id": "1640995200000",
"studentId": "1640995200000",
"examType": "期中考试",
"examDate": "2021-12-31",
"chineseScore": 85,
"mathScore": 90,
"englishScore": 88,
"createdAt": "2021-12-31T16:00:00.000Z",
"updatedAt": "2021-12-31T16:00:00.000Z"
}

```

### 更新成绩

```javascript
const gradeData = {
chineseScore: 90,
mathScore: 95
};
const success = gradeManager.updateGrade(gradeId, gradeData);

```

**参数**:

- `gradeId` (string): 成绩记录ID（必填）

- `gradeData` (object): 更新的成绩数据（可选字段）

### 删除成绩

```javascript
const success = gradeManager.deleteGrade(gradeId);
```

**参数**:

- `gradeId` (string): 成绩记录ID（必填）

### 计算学生平均分

```javascript
const average = gradeManager.calculateAverage(studentId);
```

**参数**:

- `studentId` (string): 学生ID
**返回格式**:

```json
87.67
```

### 获取成绩统计信息

```javascript
const statistics = gradeManager.getStatistics();
```

**返回格式**:

```json
{
"totalGrades": 100,
"averageGrade": "82.5",
"highestGrade": "98.0",
"lowestGrade": "45.0"
}
```

### 获取成绩分布

```javascript
const distribution = gradeManager.getGradeDistribution();
```

**返回格式**:

```json
{
"优秀(90-100)": 20,
"良好(80-89)": 30,
"中等(70-79)": 25,
"及格(60-69)": 20,
"不及格(0-59)": 5
}
```

### 获取科目平均分

```javascript
const averages = gradeManager.getSubjectAverages();
```

**返回格式**:

```json
["85.2", "82.7", "89.1"]
```

## 数据导入导出 API

### 导入学生数据

```javascript
const studentsData = [
{
name: "张三",
studentId: "2021001",
class: "高一(1)班",
grade: "高一"
}
];
const success = studentManager.importStudents(studentsData);
```

### 导出学生数据

```javascript
studentManager.exportStudents();
```

### 导出成绩数据

```javascript
gradeManager.exportGrades();
```

### 导出所有数据

```javascript
app.exportAllData();
```

## 系统控制 API

### 保存所有数据

```javascript
const success = app.saveAllData();
```

### 获取系统信息

```javascript
const systemInfo = app.getSystemInfo();
```

**返回格式**:

```json
{
"userAgent": "Mozilla/5.0...",
"language": "zh-CN",
"platform": "Win32",
"cookieEnabled": true,
"onLine": true,
"screen": {
"width": 1920,
"height": 1080,
"colorDepth": 24
},
"viewport": {
"width": 1920,
"height": 1080
},
"localStorage": {
"available": true,
"usage": 15.6
}
}
```

### 获取应用统计

```javascript
const appStats = app.getAppStatistics();
```

**返回格式**:

```json
{
"students": 50,
"grades": 100,
"classes": 5,
"examTypes": 4,
"localStorageSize": 15.6,
"systemInfo": {...}
}
```

### 显示通知

```javascript
app.showNotification("操作成功", "success");
```

**参数**:

- `message` (string): 通知消息
- `type` (string): 通知类型（success, error, warning, info）

### 清理缓存数据

```javascript
app.clearCache();
```

### 重置系统

```javascript
app.resetSystem();
```

## 常量定义

### 成绩等级常量

```javascript
const GRADE_CONSTANTS = {
PASSING_GRADE: 60,
EXCELLENT_GRADE: 90,
GOOD_GRADE: 80,
FAIR_GRADE: 70
};
```

## 错误处理

### 常见错误类型

1. **数据验证错误**: 必填字段缺失或数据格式不正确
2. **重复数据错误**: 学号或成绩记录重复
3. **存储错误**: localStorage 不可用或空间不足
4. **网络错误**: 离线状态下无法同步数据

### 错误处理示例

```javascript
try {
const success = studentManager.addStudent(studentData);
if (success) {
console.log('学生添加成功');
}
} catch (error) {
console.error('添加学生失败:', error);
app.showNotification('添加学生失败: ' + error.message, 'error');
}
```

## 性能优化建议

1. **批量操作**: 大量数据操作时使用批量方法
2. **缓存机制**: 利用 localStorage 缓存常用数据
3. **异步处理**: 复杂计算使用 setTimeout 异步执行
4. **分页加载**: 大量数据时分页显示

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 安全注意事项

1. **数据验证**: 所有用户输入都需要验证
2. **XSS防护**: 使用 escapeHtml 方法转义HTML
3. **CSRF保护**: 避免在URL中暴露敏感信息
4. **数据备份**: 定期导出重要数据

## 版本信息

- **当前版本**: 1.0.0
- **API版本**: v1
- **最后更新**: 2025-11-30
