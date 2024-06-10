var o = [];
[
    {
        d: '2024-06-10T15:00',
        m: "更新 2024 年中考及会考时间"
    },
    {
        d: '2024-06-10T16:00',
        m: '更新高考时间'
    }
].forEach(v => o = o.concat({
    date: new Date(v.d ?? 0),
    msg: v.m ?? ''
}));
export default o.sort((a, b) => a.date.getTime() - b.date.getTime());