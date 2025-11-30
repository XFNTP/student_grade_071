// 学生成绩管理系统主程序
class StudentGradeManagement {
constructor() {
this.currentTab = 'students';
this.init();
}
// 初始化应用
init() {
this.setupTabNavigation();
this.setupGlobalEventListeners();
this.initializeManagers();
this.showWelcomeMessage();
console.log('学生成绩管理系统初始化完成');
}
// 设置标签页导航
setupTabNavigation() {
const navLinks = document.querySelectorAll('[data-tab]');
const tabContents = document.querySelectorAll('.tab-content');
navLinks.forEach(link => {
link.addEventListener('click', (e) => {
e.preventDefault();
const targetTab = link.getAttribute('data-tab');
this.switchTab(targetTab);
});
});
// 监听浏览器前进后退
window.addEventListener('popstate', (e) => {
const tab = e.state?.tab || 'students';
this.switchTab(tab, false);
});
}
// 切换标签页
switchTab(tabName, pushState = true) {
// 隐藏所有标签页内容
document.querySelectorAll('.tab-content').forEach(content => {
content.classList.remove('active');
});
// 移除所有导航链接的活跃状态
document.querySelectorAll('.nav-link').forEach(link => {
link.classList.remove('active');
});
// 显示目标标签页
const targetContent = document.getElementById(tabName);
if (targetContent) {
targetContent.classList.add('active');
}
// 激活对应的导航链接
const targetNavLink = document.querySelector(`[data-tab="${tabName}"]`);
if (targetNavLink) {
targetNavLink.classList.add('active');
}
// 更新当前标签页
this.currentTab = tabName;
// 更新浏览器历史
if (pushState) {
history.pushState({ tab: tabName }, '', `#${tabName}`);
}
// 根据标签页执行相应操作
this.onTabChange(tabName);
}
// 标签页切换时的处理
onTabChange(tabName) {
switch (tabName) {
case 'students':
// 刷新学生列表
if (window.studentManager) {
studentManager.renderStudentList();
studentManager.filterStudents();
}
break;
case 'grades':
// 刷新成绩列表
if (window.gradeManager) {
gradeManager.renderGradeList();
gradeManager.filterGrades();
}
break;
case 'statistics':
// 更新统计信息
if (window.gradeManager) {
gradeManager.updateStatistics();
}
break;
}
}
// 设置全局事件监听器
setupGlobalEventListeners() {
// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
this.onPageLoad();
});
// 键盘快捷键
document.addEventListener('keydown', (e) => {
this.handleKeyboardShortcuts(e);
});
// 窗口大小改变时调整图表
window.addEventListener('resize', () => {
this.handleResize();
});
// 窗口关闭前保存数据
window.addEventListener('beforeunload', (e) => {
this.saveAllData();
});
// 网络状态监听
window.addEventListener('online', () => {
this.showNotification('网络连接已恢复', 'success');
});
window.addEventListener('offline', () => {
this.showNotification('网络连接已断开，使用离线模式', 'warning');
});
}
// 页面加载完成后的处理
onPageLoad() {
// 从URL哈希中获取标签页
const hash = window.location.hash.slice(1);
if (hash && ['students', 'grades', 'statistics'].includes(hash)) {
this.switchTab(hash, false);
}
// 设置页面标题
document.title = '学生成绩管理系统';
// 添加工具提示
this.initializeTooltips();
// 检查浏览器兼容性
this.checkBrowserCompatibility();
}
// 初始化管理类
initializeManagers() {
try {
// 初始化学生管理器
if (typeof StudentManager !== 'undefined') {
window.studentManager = new StudentManager();
}
// 初始化成绩管理器
if (typeof GradeManager !== 'undefined') {
window.gradeManager = new GradeManager();
}
console.log('管理类初始化成功');
} catch (error) {
console.error('管理类初始化失败:', error);
this.showNotification('系统初始化失败，请刷新页面', 'error');
}
}
// 处理键盘快捷键
handleKeyboardShortcuts(e) {
// Ctrl+S: 保存数据
if (e.ctrlKey && e.key === 's') {
e.preventDefault();
this.saveAllData();
this.showNotification('数据已保存', 'success');
}
// Ctrl+E: 导出数据
if (e.ctrlKey && e.key === 'e') {
e.preventDefault();
this.exportAllData();
}
// Ctrl+N: 新增学生
if (e.ctrlKey && e.key === 'n') {
e.preventDefault();
this.addStudent();
}
// Ctrl+G: 新增成绩
if (e.ctrlKey && e.key === 'g') {
e.preventDefault();
this.addGrade();
}
// ESC: 关闭模态框
if (e.key === 'Escape') {
this.closeActiveModal();
}
// 数字键 1,2,3: 快速切换标签页
if (e.altKey && ['1', '2', '3'].includes(e.key)) {
e.preventDefault();
const tabs = ['students', 'grades', 'statistics'];
const tabIndex = parseInt(e.key) - 1;
this.switchTab(tabs[tabIndex]);
}
}
// 处理窗口大小改变
handleResize() {
// 重新调整图表大小
if (window.gradeDistChart) {
window.gradeDistChart.resize();
}
if (window.subjectAvgChart) {
window.subjectAvgChart.resize();
}
}
// 保存所有数据
saveAllData() {
try {
if (window.studentManager) {
studentManager.saveStudents();
}
if (window.gradeManager) {
gradeManager.saveGrades();
}
return true;
} catch (error) {
console.error('保存数据失败:', error);
return false;
}
}
// 导出所有数据
exportAllData() {
try {
const data = {
students: window.studentManager?.getAllStudents() || [],
grades: window.gradeManager?.grades || [],
exportTime: new Date().toISOString(),
version: '1.0.0'
};
const dataStr = JSON.stringify(data, null, 2);
const dataBlob = new Blob([dataStr], { type: 'application/json' });
const link = document.createElement('a');
link.href = URL.createObjectURL(dataBlob);
link.download = `student_grade_system_${new Date().toISOString().split('T')[0]}.json`;
link.click();
this.showNotification('数据导出成功', 'success');
} catch (error) {
console.error('导出数据失败:', error);
this.showNotification('数据导出失败', 'error');
}
}
// 快速添加学生
addStudent() {
const modal = new bootstrap.Modal(document.getElementById('studentModal'));
modal.show();
}
// 快速添加成绩
addGrade() {
const modal = new bootstrap.Modal(document.getElementById('gradeModal'));
modal.show();
}
// 关闭活跃的模态框
closeActiveModal() {
const activeModal = document.querySelector('.modal.show');
if (activeModal) {
const modalInstance = bootstrap.Modal.getInstance(activeModal);
if (modalInstance) {
modalInstance.hide();
}
}
}
// 初始化工具提示
initializeTooltips() {
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
return new bootstrap.Tooltip(tooltipTriggerEl);
});
}
// 检查浏览器兼容性
checkBrowserCompatibility() {
const issues = [];
// 检查localStorage支持
if (!window.localStorage) {
issues.push('浏览器不支持本地存储，数据无法持久化');
}
// 检查Fetch API支持
if (!window.fetch) {
issues.push('浏览器不支持现代Web标准，部分功能可能受限');
}
// 检查ES6支持
try {
eval('const test = () => {};');
} catch (e) {
issues.push('浏览器不支持ES6，建议升级到现代浏览器');
}
if (issues.length > 0) {
console.warn('浏览器兼容性问题:', issues);
this.showNotification('检测到浏览器兼容性问题，建议使用Chrome、Firefox或Safari最新版本', 'warning');
}
}
// 显示欢迎消息
showWelcomeMessage() {
const welcomeKey = 'showWelcomeMessage';
const hasShownWelcome = localStorage.getItem(welcomeKey);
if (!hasShownWelcome) {
setTimeout(() => {
this.showNotification('欢迎使用学生成绩管理系统！按 Ctrl+N 快速添加学生', 'info');
localStorage.setItem(welcomeKey, 'true');
}, 1000);
}
}
// 显示通知
showNotification(message, type = 'info', duration = 5000) {
// 创建通知元素
const notification = document.createElement('div');
notification.className = `notification ${type}`;
notification.innerHTML = `
<div class="d-flex align-items-center">
<i class="fas ${this.getNotificationIcon(type)} me-2"></i>
<span>${this.escapeHtml(message)}</span>
<button type="button" class="btn-close btn-close-white ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
</div>
`;
// 设置位置
notification.style.position = 'fixed';
notification.style.top = '20px';
notification.style.right = '20px';
notification.style.zIndex = '9999';
notification.style.minWidth = '300px';
notification.style.borderRadius = '8px';
notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
notification.style.animation = 'slideInRight 0.3s ease-out';
document.body.appendChild(notification);
// 自动移除通知
setTimeout(() => {
if (notification.parentElement) {
notification.style.animation = 'slideOutRight 0.3s ease-in';
setTimeout(() => {
notification.remove();
}, 300);
}
}, duration);
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
// 获取系统信息
getSystemInfo() {
return {
userAgent: navigator.userAgent,
language: navigator.language,
platform: navigator.platform,
cookieEnabled: navigator.cookieEnabled,
onLine: navigator.onLine,
screen: {
width: screen.width,
height: screen.height,
colorDepth: screen.colorDepth
},
viewport: {
width: window.innerWidth,
height: window.innerHeight
},
localStorage: {
available: typeof(Storage) !== "undefined",
usage: this.getLocalStorageUsage()
}
};
}
// 获取localStorage使用情况
getLocalStorageUsage() {
try {
let total = 0;
for (let key in localStorage) {
if (localStorage.hasOwnProperty(key)) {
total += localStorage[key].length + key.length;
}
}
return Math.round(total / 1024 * 100) / 100; // KB
} catch (e) {
return 0;
}
}
// 清理缓存数据
clearCache() {
if (confirm('确定要清理缓存数据吗？这将清除所有本地存储的数据！')) {
localStorage.clear();
sessionStorage.clear();
this.showNotification('缓存数据已清理，请刷新页面', 'success');
}
}
// 重置系统
resetSystem() {
if (confirm('确定要重置系统吗？这将清除所有数据并恢复默认设置！')) {
localStorage.clear();
sessionStorage.clear();
location.reload();
}
}
// 获取应用统计
getAppStatistics() {
const students = window.studentManager?.getAllStudents() || [];
const grades = window.gradeManager?.grades || [];
return {
students: students.length,
grades: grades.length,
classes: [...new Set(students.map(s => s.class))].length,
grades: [...new Set(students.map(s => s.grade).filter(Boolean))].length,
examTypes: [...new Set(grades.map(g => g.examType))].length,
localStorageSize: this.getLocalStorageUsage(),
systemInfo: this.getSystemInfo()
};
}
}
// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
from {
transform: translateX(100%);
opacity: 0;
}
to {
transform: translateX(0);
opacity: 1;
}
}
@keyframes slideOutRight {
from {
transform: translateX(0);
opacity: 1;
}
to {
transform: translateX(100%);
opacity: 0;
}
}
`;
document.head.appendChild(style);
// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
app = new StudentGradeManagement();
// 将应用实例挂载到全局，便于调试
window.app = app;
});
// 导出应用类（用于模块化）
if (typeof module !== 'undefined' && module.exports) {
module.exports = StudentGradeManagement;
}