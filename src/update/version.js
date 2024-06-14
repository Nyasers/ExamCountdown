var o = [];
[
    {
        d: '2024-06-14T17:00',
        m: '底层改了好多，反正表面看不出来，懒得写了orz'
    },
    {
        d: '2024-06-14T10:00',
        m: '将“每日壁纸”改为“必应壁纸”'
    },
    {
        d: '2024-06-13T00:00',
        m: '新增“每日壁纸”选项（默认开启，可打开 Wallpaper Engine 进行设置）'
    },
    {
        d: '2024-06-10T18:00',
        m: '修复版本号错误的问题'
    },
    {
        d: '2024-06-10T16:00',
        m: '更新高考时间'
    },
    {
        d: '2024-06-10T15:00',
        m: "更新 2024 年中考及会考时间"
    },
].forEach(v => o = o.concat({
    date: new Date(v.d + 'Z' ?? 0),
    msg: v.m ?? ''
}));
export default o.sort((a, b) => b.date - a.date);
