// 成绩管理模块
class GradeManager {
constructor() {
this.grades = this.loadGrades();
this.subjects = ['语文', '数学', '英语'];
this.currentEditId = null;
this.filteredGrades = [...this.grades];
this.init();
}
// 初始化
init() {
this.renderGradeList();
this.setupEventListeners();
this.updateStatistics();
}
// 设置事件监听器
setupEventListeners() {
// 成绩输入事件
['chineseScore', 'mathScore', 'englishScore'].forEach(subject => {
const input = document.getElementById(subject);
if (input) {
input.addEventListener('input', () => {
this.calculateTotalScore();
});
}
});
// 筛选事件
['studentFilter', 'examTypeFilter', 'dateFilter'].forEach(filterId => {
const element = document.getElementById(filterId);
if (element) {
element.addEventListener('change', () => {
this.filterGrades();
});
}
});
// 模态框事件
const gradeModal = document.getElementById('gradeModal');
if (gradeModal) {
gradeModal.addEventListener('hidden.bs.modal', () => {
this.resetForm();
});
}
// 设置默认日期为今天
const examDateInput = document.getElementById('examDate');
if (examDateInput) {
examDateInput.valueAsDate = new Date();
}
}
// 加载成绩数据
loadGrades() {
try {
const data = localStorage.getItem('grades');
return data ? JSON.parse(data) : [];
} catch (error) {
console.error('Error loading grades:', error);
this.showNotification('加载成绩数据失败', 'error');
return [];
}
}
// 保存成绩数据
saveGrades() {
try {
localStorage.setItem('grades', JSON.stringify(this.grades));
return true;
} catch (error) {
console.error('Error saving grades:', error);
this.showNotification('保存成绩数据失败', 'error');
return false;
}
}
// 渲染成绩列表
renderGradeList() {
const gradeList = document.getElementById('gradeList');
if (!gradeList) return;
if (this.filteredGrades.length === 0) {
gradeList.innerHTML = `
<tr>
<td colspan="8" class="text-center">
<div class="empty-state">
<i class="fas fa-chart-bar"></i>
<p>暂无成绩数据</p>
</div>
</td>
</tr>
`;
return;
}
gradeList.innerHTML = this.filteredGrades.map(grade => {
const student = studentManager.getStudent(grade.studentId);
const studentName = student ? student.name : '未知学生';
const chinese = parseFloat(grade.chineseScore) || 0;
const math = parseFloat(grade.mathScore) || 0;
const english = parseFloat(grade.englishScore) || 0;
const total = chinese + math + english;
const average = (total / 3).toFixed(1);
return `
<tr>
<td>
<div class="d-flex align-items-center">
<i class="fas fa-user-circle text-primary me-2"></i>
<span class="fw-medium">${this.escapeHtml(studentName)}</span>
</div>
</td>
<td>
<span class="badge ${this.getExamTypeBadgeClass(grade.examType)}">
${this.escapeHtml(grade.examType)}
</span>
</td>
<td>${this.formatDate(grade.examDate)}</td>
<td>
<span class="badge ${this.getScoreBadgeClass(chinese)}">${chinese}</span>
</td>
<td>
<span class="badge ${this.getScoreBadgeClass(math)}">${math}</span>
</td>
<td>
<span class="badge ${this.getScoreBadgeClass(english)}">${english}</span>
</td>
<td>
<span class="badge bg-primary">${total}</span>
<small class="text-muted ms-1">(${average})</small>
</td>
<td>
<div class="btn-group" role="group">
<button class="btn btn-sm btn-outline-primary" 
onclick="gradeManager.editGrade('${grade.id}')" 
title="编辑">
<i class="fas fa-edit"></i>
</button>
<button class="btn btn-sm btn-outline-danger" 
onclick="gradeManager.deleteGrade('${grade.id}')" 
title="删除">
<i class="fas fa-trash"></i>
</button>
</div>
</td>
</tr>
`;
}).join('');
}
// 计算总分
calculateTotalScore() {
const chinese = parseFloat(document.getElementById('chineseScore')?.value) || 0;
const math = parseFloat(document.getElementById('mathScore')?.value) || 0;
const english = parseFloat(document.getElementById('englishScore')?.value) || 0;
const total = chinese + math + english;
const totalInput = document.getElementById('totalScore');
if (totalInput) {
totalInput.value = total;
}
}
// 添加成绩
addGrade(gradeData) {
// 验证学生是否存在
const student = studentManager.getStudent(gradeData.studentId);
if (!student) {
this.showNotification('学生不存在', 'error');
return false;
}
// 检查该学生在同一天是否有相同类型的考试
const existingGrade = this.grades.find(g => 
g.studentId === gradeData.studentId && 
g.examType === gradeData.examType && 
g.examDate === gradeData.examDate
);
if (existingGrade) {
this.showNotification('该学生在此日期已有相同类型的考试记录', 'error');
return false;
}
const grade = {
id: Date.now().toString(),
...gradeData,
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString()
};
this.grades.push(grade);
if (this.saveGrades()) {
this.filteredGrades = [...this.grades];
this.renderGradeList();
this.updateStatistics();
this.showNotification('成绩录入成功', 'success');
return true;
}
return false;
}
// 更新成绩
updateGrade(id, gradeData) {
const index = this.grades.findIndex(g => g.id === id);
if (index === -1) {
this.showNotification('成绩记录不存在', 'error');
return false;
}
// 验证学生是否存在
const student = studentManager.getStudent(gradeData.studentId);
if (!student) {
this.showNotification('学生不存在', 'error');
return false;
}
// 检查重复记录（排除当前记录）
const existingGrade = this.grades.find(g => 
g.id !== id &&
g.studentId === gradeData.studentId && 
g.examType === gradeData.examType && 
g.examDate === gradeData.examDate
);
if (existingGrade) {
this.showNotification('该学生在此日期已有相同类型的考试记录', 'error');
return false;
}
this.grades[index] = { 
...this.grades[index], 
...gradeData,
updatedAt: new Date().toISOString()
};
if (this.saveGrades()) {
this.filteredGrades = [...this.grades];
this.renderGradeList();
this.updateStatistics();
this.showNotification('成绩更新成功', 'success');
return true;
}
return false;
}
// 删除成绩
deleteGrade(id) {
const grade = this.getGrade(id);
if (!grade) {
this.showNotification('成绩记录不存在', 'error');
return;
}
const student = studentManager.getStudent(grade.studentId);
const studentName = student ? student.name : '未知学生';
if (confirm(`确定要删除 "${studentName}" 的成绩记录吗？`)) {
this.grades = this.grades.filter(g => g.id !== id);
if (this.saveGrades()) {
this.filteredGrades = [...this.grades];
this.renderGradeList();
this.updateStatistics();
this.showNotification('成绩删除成功', 'success');
}
}
}
// 删除指定学生的所有成绩
deleteStudentGrades(studentId) {
this.grades = this.grades.filter(g => g.studentId !== studentId);
this.saveGrades();
}
// 编辑成绩
editGrade(id) {
const grade = this.getGrade(id);
if (grade) {
this.currentEditId = id;
document.getElementById('gradeStudent').value = grade.studentId;
document.getElementById('examType').value = grade.examType;
document.getElementById('examDate').value = grade.examDate;
document.getElementById('chineseScore').value = grade.chineseScore || '';
document.getElementById('mathScore').value = grade.mathScore || '';
document.getElementById('englishScore').value = grade.englishScore || '';
this.calculateTotalScore();
document.getElementById('gradeModalTitle').textContent = '编辑成绩';
const modal = new bootstrap.Modal(document.getElementById('gradeModal'));
modal.show();
}
}
// 保存成绩（新增或更新）
saveGrade() {
const gradeData = {
studentId: document.getElementById('gradeStudent').value,
examType: document.getElementById('examType').value,
examDate: document.getElementById('examDate').value,
chineseScore: parseFloat(document.getElementById('chineseScore').value) || 0,
mathScore: parseFloat(document.getElementById('mathScore').value) || 0,
englishScore: parseFloat(document.getElementById('englishScore').value) || 0
};
// 验证必填字段
if (!gradeData.studentId || !gradeData.examType || !gradeData.examDate) {
this.showNotification('请填写所有必填字段', 'error');
return false;
}
// 验证分数范围
const scores = [gradeData.chineseScore, gradeData.mathScore, gradeData.englishScore];
if (scores.some(score => score < 0 || score > 100)) {
this.showNotification('分数必须在 0-100 之间', 'error');
return false;
}
let success = false;
if (this.currentEditId) {
success = this.updateGrade(this.currentEditId, gradeData);
} else {
success = this.addGrade(gradeData);
}
if (success) {
this.resetForm();
const modal = bootstrap.Modal.getInstance(document.getElementById('gradeModal'));
modal.hide();
}
return success;
}
// 获取成绩详情
getGrade(id) {
return this.grades.find(g => g.id === id);
}
// 获取学生所有成绩
getStudentGrades(studentId) {
return this.grades.filter(g => g.studentId === studentId);
}
// 计算学生平均分
calculateAverage(studentId) {
const studentGrades = this.getStudentGrades(studentId);
if (studentGrades.length === 0) return 0;
const total = studentGrades.reduce((sum, grade) => {
const subjects = ['chineseScore', 'mathScore', 'englishScore'];
const average = subjects.reduce((subjectSum, subject) => 
subjectSum + (parseFloat(grade[subject]) || 0), 0
) / subjects.length;
return sum + average;
}, 0);
return (total / studentGrades.length).toFixed(2);
}
// 筛选成绩
filterGrades() {
const studentFilter = document.getElementById('studentFilter')?.value || '';
const examTypeFilter = document.getElementById('examTypeFilter')?.value || '';
const dateFilter = document.getElementById('dateFilter')?.value || '';
this.filteredGrades = this.grades.filter(grade => {
const matchesStudent = !studentFilter || grade.studentId === studentFilter;
const matchesExamType = !examTypeFilter || grade.examType === examTypeFilter;
const matchesDate = !dateFilter || grade.examDate === dateFilter;
return matchesStudent && matchesExamType && matchesDate;
});
this.renderGradeList();
}
// 清除筛选
clearFilters() {
['studentFilter', 'examTypeFilter', 'dateFilter'].forEach(filterId => {
const element = document.getElementById(filterId);
if (element) element.value = '';
});
this.filteredGrades = [...this.grades];
this.renderGradeList();
}
// 重置表单
resetForm() {
const form = document.getElementById('gradeForm');
if (form) form.reset();
this.currentEditId = null;
document.getElementById('gradeModalTitle').textContent = '录入成绩';
// 重置总分
const totalInput = document.getElementById('totalScore');
if (totalInput) totalInput.value = '';
}
// 更新统计信息
updateStatistics() {
this.updateStatisticsOverview();
this.updateCharts();
}
// 更新统计概览
updateStatisticsOverview() {
const overview = document.getElementById('statisticsOverview');
if (!overview) return;
const stats = this.getStatistics();
overview.innerHTML = `
<div class="col-md-3">
<div class="stat-card primary">
<div class="stat-number">${stats.totalGrades}</div>
<div class="stat-label">总成绩记录</div>
</div>
</div>
<div class="col-md-3">
<div class="stat-card success">
<div class="stat-number">${stats.averageGrade}</div>
<div class="stat-label">全级平均分</div>
</div>
</div>
<div class="col-md-3">
<div class="stat-card info">
<div class="stat-number">${stats.highestGrade}</div>
<div class="stat-label">最高分</div>
</div>
</div>
<div class="col-md-3">
<div class="stat-card warning">
<div class="stat-number">${stats.lowestGrade}</div>
<div class="stat-label">最低分</div>
</div>
</div>
`;
}
// 更新图表
updateCharts() {
this.updateGradeDistributionChart();
this.updateSubjectAverageChart();
}
// 更新成绩分布图表
updateGradeDistributionChart() {
const ctx = document.getElementById('gradeDistChart');
if (!ctx) return;
const distribution = this.getGradeDistribution();
if (window.gradeDistChart) {
window.gradeDistChart.destroy();
}
window.gradeDistChart = new Chart(ctx, {
type: 'doughnut',
data: {
labels: Object.keys(distribution),
datasets: [{
data: Object.values(distribution),
backgroundColor: [
'#28a745', '#ffc107', '#fd7e14', '#dc3545', '#6f42c1', '#20c997'
]
}]
},
options: {
responsive: true,
plugins: {
legend: {
position: 'bottom'
}
}
}
});
}
// 更新科目平均分图表
updateSubjectAverageChart() {
const ctx = document.getElementById('subjectAvgChart');
if (!ctx) return;
const averages = this.getSubjectAverages();
if (window.subjectAvgChart) {
window.subjectAvgChart.destroy();
}
window.subjectAvgChart = new Chart(ctx, {
type: 'bar',
data: {
labels: ['语文', '数学', '英语'],
datasets: [{
label: '平均分',
data: averages,
backgroundColor: ['#007bff', '#28a745', '#ffc107']
}]
},
options: {
responsive: true,
scales: {
y: {
beginAtZero: true,
max: 100
}
}
}
});
}
// 获取统计信息
getStatistics() {
if (this.grades.length === 0) {
return {
totalGrades: 0,
averageGrade: 0,
highestGrade: 0,
lowestGrade: 0
};
}
const allScores = this.grades.flatMap(grade => [
parseFloat(grade.chineseScore) || 0,
parseFloat(grade.mathScore) || 0,
parseFloat(grade.englishScore) || 0
]);
const averageGrade = (allScores.reduce((sum, score) => sum + score, 0) / allScores.length).toFixed(1);
const highestGrade = Math.max(...allScores).toFixed(1);
const lowestGrade = Math.min(...allScores).toFixed(1);
return {
totalGrades: this.grades.length,
averageGrade,
highestGrade,
lowestGrade
};
}
// 获取成绩分布
getGradeDistribution() {
const ranges = {
'优秀(90-100)': 0,
'良好(80-89)': 0,
'中等(70-79)': 0,
'及格(60-69)': 0,
'不及格(0-59)': 0
};
this.grades.forEach(grade => {
const scores = [
parseFloat(grade.chineseScore) || 0,
parseFloat(grade.mathScore) || 0,
parseFloat(grade.englishScore) || 0
];
const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
if (average >= 90) ranges['优秀(90-100)']++;
else if (average >= 80) ranges['良好(80-89)']++;
else if (average >= 70) ranges['中等(70-79)']++;
else if (average >= 60) ranges['及格(60-69)']++;
else ranges['不及格(0-59)']++;
});
return ranges;
}
// 获取科目平均分
getSubjectAverages() {
const subjects = {
chinese: [],
math: [],
english: []
};
this.grades.forEach(grade => {
subjects.chinese.push(parseFloat(grade.chineseScore) || 0);
subjects.math.push(parseFloat(grade.mathScore) || 0);
subjects.english.push(parseFloat(grade.englishScore) || 0);
});
return Object.keys(subjects).map(subject => {
const scores = subjects[subject];
return scores.length > 0 ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1) : 0;
});
}
// 获取分数徽章样式类
getScoreBadgeClass(score) {
if (score >= 90) return 'bg-success';
if (score >= 80) return 'bg-primary';
if (score >= 70) return 'bg-info';
if (score >= 60) return 'bg-warning';
return 'bg-danger';
}
// 获取考试类型徽章样式类
getExamTypeBadgeClass(examType) {
const typeMap = {
'期中考试': 'bg-primary',
'期末考试': 'bg-danger',
'月考': 'bg-warning',
'测验': 'bg-info'
};
return typeMap[examType] || 'bg-secondary';
}
// 格式化日期
formatDate(dateString) {
const date = new Date(dateString);
return date.toLocaleDateString('zh-CN');
}
// HTML转义
escapeHtml(text) {
const div = document.createElement('div');
div.textContent = text;
return div.innerHTML;
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
// 导出成绩数据
exportGrades() {
try {
const data = {
grades: this.grades,
students: studentManager.getAllStudents(),
exportDate: new Date().toISOString()
};
const dataStr = JSON.stringify(data, null, 2);
const dataBlob = new Blob([dataStr], { type: 'application/json' });
const link = document.createElement('a');
link.href = URL.createObjectURL(dataBlob);
link.download = `grades_${new Date().toISOString().split('T')[0]}.json`;
link.click();
this.showNotification('成绩数据导出成功', 'success');
} catch (error) {
console.error('Error exporting grades:', error);
this.showNotification('导出成绩数据失败', 'error');
}
}
// 清空所有数据
clearAllData() {
if (confirm('确定要清空所有数据吗？此操作不可撤销！')) {
this.grades = [];
studentManager.students = [];
this.saveGrades();
studentManager.saveStudents();
this.renderGradeList();
this.filteredGrades = [];
this.updateStatistics();
studentManager.renderStudentList();
this.showNotification('所有数据已清空', 'success');
}
}
}
// 定义常量 - 这里故意留空，后续制造冲突
const GRADE_CONSTANTS = {
PASSING_GRADE: 60,
EXCELLENT_GRADE: 90
};