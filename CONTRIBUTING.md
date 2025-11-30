# 贡献指南

首先，非常感谢你对 Student Grade Management System 的兴趣！我们欢迎所有形式的贡献。

## 如何贡献

### 报告Bug

如果你发现了bug，请按照 bug 报告模板创建一个 issue。

### 建议新功能

我们很乐意听到你的想法！请按照功能请求模板创建一个 issue。

### 提交代码

#### 开发环境设置

1. Fork 这个仓库
2. 克隆你的 fork 到本地：

```bash
git clone https://github.com/[your-username]/student_grade_071.git
cd student_grade_071
```

3. 添加上游仓库为远程：

```bash
git remote add upstream https://github.com/[username]/student_grade_071.git
```

#### 开发流程

1. **创建分支**

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b bugfix/your-bugfix-name
```

2. **进行开发**

- 遵循现有的代码风格
- 添加必要的测试
- 确保所有功能正常工作

3. **提交更改**

```bash
git add .
git commit -m "feat: add new feature description"
```

4. **推送到你的 fork**

```bash
git push origin feature/your-feature-name
```

5. **创建 Pull Request**

- 访问你的 fork 仓库
- 点击 "Create Pull Request"
- 填写 PR 模板

## 代码风格

### HTML/CSS

- 使用 4 个空格缩进
- 使用有意义的类名
- 遵循 BEM 命名规范

### JavaScript

- 使用 ES6+ 语法
- 使用有意义的变量和函数名
- 添加必要的注释
- 遵循 Airbnb JavaScript Style Guide

## 测试

在提交 PR 之前，请确保：

- 所有功能正常工作
- 代码通过 linting 检查
- 没有 console 错误

## 沟通

如果你有任何问题，欢迎：

- 创建 issue 讨论
- 参与现有的讨论
- 查看项目的 README 和文档
再次感谢你的贡献！
