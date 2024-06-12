var o = [];
[
    {
        d: '2024-06-10T15:00',
        m: "更新 2024 年中考及会考时间"
    },
    {
        d: '2024-06-10T16:00',
        m: '更新高考时间'
    },
    {
        d: '2024-06-10T18:00',
        m: '修复版本号错误的问题'
    },
    {
        d: '2024-06-13T00:00',
        m: '新增“每日壁纸”选项（默认开启，可打开 Wallpaper Engine 进行设置）'
    }
].forEach(v => o = o.concat({
    date: new Date(v.d + 'Z' ?? 0),
    msg: v.m ?? ''
}));
export default o.sort((a, b) => a.date - b.date);