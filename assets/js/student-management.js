// 学生管理模块
class StudentManager {
constructor() {
this.students = this.loadStudents();
this.currentEditId = null;
this.filteredStudents = [...this.students];
this.init();
}
// 初始化
init() {
this.renderStudentList();
this.setupEventListeners();
this.populateClassFilter();
this.updateStudentFilter();
}
// 设置事件监听器
setupEventListeners() {
// 搜索功能
const searchInput = document.getElementById('studentSearch');
if (searchInput) {
searchInput.addEventListener('input', (e) => {
this.filterStudents();
});
}
// 班级筛选
const classFilter = document.getElementById('classFilter');
if (classFilter) {
classFilter.addEventListener('change', () => {
this.filterStudents();
});
}
// 模态框事件
const studentModal = document.getElementById('studentModal');
if (studentModal) {
studentModal.addEventListener('hidden.bs.modal', () => {
this.resetForm();
});
}
}
// 加载学生数据
loadStudents() {
try {
const data = localStorage.getItem('students');
return data ? JSON.parse(data) : [];
} catch (error) {
console.error('Error loading students:', error);
this.showNotification('加载学生数据失败', 'error');
return [];
}
}
// 保存学生数据
saveStudents() {
try {
localStorage.setItem('students', JSON.stringify(this.students));
return true;
} catch (error) {
console.error('Error saving students:', error);
this.showNotification('保存学生数据失败', 'error');
return false;
}
}
// 渲染学生列表
renderStudentList() {
const studentList = document.getElementById('studentList');
if (!studentList) return;
if (this.filteredStudents.length === 0) {
studentList.innerHTML = `
<tr>
<td colspan="6" class="text-center">
<div class="empty-state">
<i class="fas fa-user-graduate"></i>
<p>暂无学生数据</p>
</div>
</td>
</tr>
`;
return;
}
studentList.innerHTML = this.filteredStudents.map(student => {
const averageScore = this.calculateAverageScore(student.id);
return `
<tr>
<td>
<div class="d-flex align-items-center">
<div class="avatar me-2">
<i class="fas fa-user-circle text-primary" style="font-size: 1.2rem;"></i>
</div>
<span class="fw-medium">${this.escapeHtml(student.name)}</span>
</div>
</td>
<td>
<span class="badge bg-secondary">${this.escapeHtml(student.studentId)}</span>
</td>
<td>${this.escapeHtml(student.class)}</td>
<td>${this.escapeHtml(student.grade || '未设置')}</td>
<td>
<span class="badge ${this.getScoreBadgeClass(averageScore)}">
${averageScore || 'N/A'}
</span>
</td>
<td>
<div class="btn-group" role="group">
<button class="btn btn-sm btn-outline-primary" 
onclick="studentManager.editStudent('${student.id}')" 
title="编辑">
<i class="fas fa-edit"></i>
</button>
<button class="btn btn-sm btn-outline-danger" 
onclick="studentManager.deleteStudent('${student.id}')" 
title="删除">
<i class="fas fa-trash"></i>
</button>
</div>
</td>
</tr>
`;
}).join('');
}
// 计算学生平均分
calculateAverageScore(studentId) {
const grades = gradeManager.getStudentGrades(studentId);
if (grades.length === 0) return null;
const totalScores = grades.map(grade => {
const subjects = ['chineseScore', 'mathScore', 'englishScore'];
const validScores = subjects.map(subject => parseFloat(grade[subject]) || 0);
return validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
});
const average = totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length;
return average.toFixed(1);
}
// 获取分数徽章样式类
getScoreBadgeClass(score) {
if (!score) return 'bg-secondary';
const numScore = parseFloat(score);
if (numScore >= 90) return 'bg-success';
if (numScore >= 80) return 'bg-primary';
if (numScore >= 70) return 'bg-info';
if (numScore >= 60) return 'bg-warning';
return 'bg-danger';
}
// 添加学生
addStudent(studentData) {
// 验证学号是否已存在
if (this.students.some(s => s.studentId === studentData.studentId)) {
this.showNotification('学号已存在，请使用不同的学号', 'error');
return false;
}
const student = {
id: Date.now().toString(),
...studentData,
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString()
};
this.students.push(student);
if (this.saveStudents()) {
this.filteredStudents = [...this.students];
this.renderStudentList();
this.updateStudentFilter();
this.populateClassFilter();
this.showNotification('学生添加成功', 'success');
return true;
}
return false;
}
// 更新学生
updateStudent(id, studentData) {
const index = this.students.findIndex(s => s.id === id);
if (index === -1) {
this.showNotification('学生不存在', 'error');
return false;
}
// 验证学号是否已存在（排除当前学生）
const existingStudent = this.students.find(s => s.studentId === studentData.studentId && s.id !== id);
if (existingStudent) {
this.showNotification('学号已存在，请使用不同的学号', 'error');
return false;
}
this.students[index] = { 
...this.students[index], 
...studentData,
updatedAt: new Date().toISOString()
};
if (this.saveStudents()) {
this.filteredStudents = [...this.students];
this.renderStudentList();
this.updateStudentFilter();
this.populateClassFilter();
this.showNotification('学生信息更新成功', 'success');
return true;
}
return false;
}
// 删除学生
deleteStudent(id) {
const student = this.getStudent(id);
if (!student) {
this.showNotification('学生不存在', 'error');
return;
}
// 检查是否有相关成绩
const hasGrades = gradeManager.getStudentGrades(id).length > 0;
let confirmMessage = `确定要删除学生 "${student.name}" 吗？`;
if (hasGrades) {
confirmMessage += '\n注意：删除学生将同时删除其所有成绩记录！';
}
if (confirm(confirmMessage)) {
// 删除学生
this.students = this.students.filter(s => s.id !== id);
// 删除相关成绩
if (hasGrades) {
gradeManager.deleteStudentGrades(id);
}
if (this.saveStudents()) {
this.filteredStudents = [...this.students];
this.renderStudentList();
this.updateStudentFilter();
this.populateClassFilter();
this.showNotification('学生删除成功', 'success');
}
}
}
// 编辑学生
editStudent(id) {
const student = this.getStudent(id);
if (student) {
this.currentEditId = id;
document.getElementById('studentName').value = student.name;
document.getElementById('studentNumber').value = student.studentId;
document.getElementById('studentClass').value = student.class;
document.getElementById('studentGrade').value = student.grade || '';
document.getElementById('studentModalTitle').textContent = '编辑学生';
const modal = new bootstrap.Modal(document.getElementById('studentModal'));
modal.show();
}
}
// 保存学生（新增或更新）
saveStudent() {
const form = document.getElementById('studentForm');
const formData = new FormData(form);
const studentData = {
name: formData.get('studentName') || document.getElementById('studentName').value.trim(),
studentId: formData.get('studentNumber') || document.getElementById('studentNumber').value.trim(),
class: formData.get('studentClass') || document.getElementById('studentClass').value.trim(),
grade: formData.get('studentGrade') || document.getElementById('studentGrade').value
};
// 验证必填字段
if (!studentData.name || !studentData.studentId || !studentData.class) {
this.showNotification('请填写所有必填字段', 'error');
return false;
}
let success = false;
if (this.currentEditId) {
success = this.updateStudent(this.currentEditId, studentData);
} else {
success = this.addStudent(studentData);
}
if (success) {
this.resetForm();
const modal = bootstrap.Modal.getInstance(document.getElementById('studentModal'));
modal.hide();
}
return success;
}
// 获取学生详情
getStudent(id) {
return this.students.find(s => s.id === id);
}
// 获取所有学生
getAllStudents() {
return this.students;
}
// 筛选学生
filterStudents() {
const searchTerm = document.getElementById('studentSearch')?.value.toLowerCase() || '';
const classFilter = document.getElementById('classFilter')?.value || '';
this.filteredStudents = this.students.filter(student => {
const matchesSearch = !searchTerm || 
student.name.toLowerCase().includes(searchTerm) ||
student.studentId.toLowerCase().includes(searchTerm);
const matchesClass = !classFilter || student.class === classFilter;
return matchesSearch && matchesClass;
});
this.renderStudentList();
}
// 清除筛选
clearFilters() {
const searchInput = document.getElementById('studentSearch');
const classFilter = document.getElementById('classFilter');
if (searchInput) searchInput.value = '';
if (classFilter) classFilter.value = '';
this.filteredStudents = [...this.students];
this.renderStudentList();
}
// 填充班级筛选器
populateClassFilter() {
const classFilter = document.getElementById('classFilter');
if (!classFilter) return;
const classes = [...new Set(this.students.map(s => s.class))].sort();
// 清除现有选项（除了"全部班级"）
classFilter.innerHTML = '<option value="">全部班级</option>';
classes.forEach(cls => {
const option = document.createElement('option');
option.value = cls;
option.textContent = cls;
classFilter.appendChild(option);
});
}
// 更新学生筛选器（用于成绩管理页面）
updateStudentFilter() {
const studentFilter = document.getElementById('gradeStudent');
if (!studentFilter) return;
studentFilter.innerHTML = '<option value="">请选择学生</option>';
this.students.forEach(student => {
const option = document.createElement('option');
option.value = student.id;
option.textContent = `${student.name} (${student.studentId})`;
studentFilter.appendChild(option);
});
}
// 重置表单
resetForm() {
const form = document.getElementById('studentForm');
if (form) form.reset();
this.currentEditId = null;
document.getElementById('studentModalTitle').textContent = '添加学生';
}
// 显示通知
showNotification(message, type = 'info') {
// 创建通知元素
const notification = document.createElement('div');
notification.className = `notification ${type}`;
notification.innerHTML = `
<div class="d-flex align-items-center">
<i class="fas ${this.getNotificationIcon(type)} me-2"></i>
<span>${message}</span>
<button type="button" class="btn-close btn-close-white ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
</div>
`;
document.body.appendChild(notification);
// 自动移除通知
setTimeout(() => {
if (notification.parentElement) {
notification.remove();
}
}, 5000);
}
// 获取通知图标
getNotificationIcon(type) {
switch (type) {
case 'success': return 'fa-check-circle';
case 'error': return 'fa-exclamation-circle';
case 'warning': return 'fa-exclamation-triangle';
default: return 'fa-info-circle';
}
}
// HTML转义
escapeHtml(text) {
const div = document.createElement('div');
div.textContent = text;
return div.innerHTML;
}
// 导入学生数据
importStudents(studentsData) {
try {
const validStudents = studentsData.filter(data => 
data.name && data.studentId && data.class
);
if (validStudents.length === 0) {
this.showNotification('没有有效的学生数据', 'error');
return false;
}
let imported = 0;
validStudents.forEach(data => {
if (!this.students.some(s => s.studentId === data.studentId)) {
this.addStudent(data);
imported++;
}
});
this.showNotification(`成功导入 ${imported} 个学生`, 'success');
return true;
} catch (error) {
console.error('Error importing students:', error);
this.showNotification('导入学生数据失败', 'error');
return false;
}
}
// 导出学生数据
exportStudents() {
try {
const dataStr = JSON.stringify(this.students, null, 2);
const dataBlob = new Blob([dataStr], { type: 'application/json' });
const link = document.createElement('a');
link.href = URL.createObjectURL(dataBlob);
link.download = `students_${new Date().toISOString().split('T')[0]}.json`;
link.click();
this.showNotification('学生数据导出成功', 'success');
} catch (error) {
console.error('Error exporting students:', error);
this.showNotification('导出学生数据失败', 'error');
}
}
// 获取统计数据
getStatistics() {
const total = this.students.length;
const grades = [...new Set(this.students.map(s => s.grade).filter(Boolean))];
const classes = [...new Set(this.students.map(s => s.class))];
return {
total,
grades: grades.length,
classes: classes.length,
gradeDistribution: this.getGradeDistribution()
};
}
// 获取年级分布
getGradeDistribution() {
const distribution = {};
this.students.forEach(student => {
const grade = student.grade || '未设置';
distribution[grade] = (distribution[grade] || 0) + 1;
});
return distribution;
}
}