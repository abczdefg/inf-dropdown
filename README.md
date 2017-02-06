# Inf-DropDown

[点我预览](https://abczdefg.github.io/inf-dropdown/)

#### 实现无限级异步加载的下拉选择菜单

通过扩展bootstrap自带的dropdown实现：

1. 添加submenu子菜单样式，在hover时显示下一级菜单，同时保证html可递归
2. 给li添加hover()事件，使用定时器保证hover一定时间才触发ajax，请求该li对应的子级分类/话题
3. 由于dropdown本身具有**点击li关闭dropdown选择框**的特点，可通过阻止li点击事件冒泡`e.stopPropagation()`，然后按自己需要，控制style关闭选择框
```
//可递归的简单例子
<ul class="submenu">
	<li>1</li>
	<li>2</li>
	<li>
		3
		<ul class="submenu">...</ul>
	</li>
</ul>
```

#### 注意：若在本地中运行Demo，`chrome`由于安全机制，不能直接调用本地文件json，会出现跨域现象

解决方法：
1. 右键点击`chrome`的快捷方式
2. 选择属性
3. 在目标一栏中末尾加入空格和`--allow-file-access-from-files`