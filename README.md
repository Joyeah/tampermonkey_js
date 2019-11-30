# 油猴脚本(持续更新)

## googlefilter

对谷歌搜索内容进行筛选处理，将不喜欢的站点的内容置灰，将喜欢的网站条目前加★。用户可以自行修改脚本中的几个配置项，增加自己的喜好设置。

```javascript
//垃圾网站
var trashsites = [
    'baidu.com','csdn.net','360.cn',
];
//垃圾站点信息处理方式：remove-移除, gray-变灰
var trash_action = 'remove';
//星标网站
var starsites = ['liaoxuefeng.com','shihu.com'];
```



## 招聘网站搜索二次过滤

针对搜索的职位进行二次筛选，将筛选的结果弹窗展示出来，减少滚动页面的查看时间，提交搜索效率 。用户可以在页面上修改筛选条件进行当前页的再次过滤。

初步实现的有：

1. 直聘网
2. 猎聘网
3. 拉勾网

用户可以修改默认配置项，这样就不用在翻页后重新修改筛选条件了。

```javascript
//筛选条件
var conds = {};
conds.words = ['经理', 'IT', '技术', '需求', '培训'];
conds.minSalary = 11; //薪水（单位K)
conds.minEmployees = 100; //最少人数
```



