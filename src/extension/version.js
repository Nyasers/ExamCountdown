let input = [
    {
        d: '2024-06-10T15:00',
        m: "更新 2024 年中考及会考时间"
    },
    {
        d: '2024-06-10T16:00',
        m: '更新高考时间'
    }
]


let output = [];
input.forEach(version => {
    let build = {
        date: new Date(version.d ?? 0),
        msg: version.m ?? ''
    }
    output.join(build);
});
output.sort((left, right) =>
    left.date.getTime() ?? 0 - right.date.getTime() ?? 0
);

export default output;