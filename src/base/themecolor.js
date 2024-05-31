var OctreeNode = function () {
    this.isLeaf = false;
    this.pixelCount = 0;
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.children = [null, null, null, null, null, null, null, null];
    this.next = null;
}

var root = null,
    leafNum = 0,
    colorMap = null,
    reducible = null;

function createNode(index, level) {
    var node = new OctreeNode();
    if (level === 7) {
        node.isLeaf = true;
        leafNum++;
    } else {
        // 将其丢到第 level 层的 reducible 链表中
        node.next = reducible[level];
        reducible[level] = node;
    }

    return node;
}

function addColor(node, color, level) {
    if (node.isLeaf) {
        node.pixelCount += 1;
        node.red += color.r;
        node.green += color.g;
        node.bllue += color.b;
    }
    else {
        var str = "";
        var r = color.r.toString(2);
        var g = color.g.toString(2);
        var b = color.b.toString(2);
        while (r.length < 8) r = '0' + r;
        while (g.length < 8) g = '0' + g;
        while (b.length < 8) b = '0' + b;

        str += r[level];
        str += g[level];
        str += b[level];

        var index = parseInt(str, 2);

        if (null === node.children[index]) {
            node.children[index] = createNode(index, level + 1);
        }

        if (undefined === node.children[index]) {
            console.log(index, level, color.r.toString(2));
        }

        addColor(node.children[index], color, level + 1);
    }
}

function reduceTree() {

    // 找到最深层次的并且有可合并节点的链表
    var level = 6;
    while (null == reducible[level]) {
        level -= 1;
    }

    // 取出链表头并将其从链表中移除
    var node = reducible[level];
    reducible[level] = node.next;

    // 合并子节点
    var r = 0;
    var g = 0;
    var b = 0;
    var count = 0;
    for (var i = 0; i < 8; i++) {
        if (null === node.children[i]) continue;
        r += node.children[i].red;
        g += node.children[i].green;
        b += node.children[i].blue;
        count += node.children[i].pixelCount;
        leafNum--;
    }

    // 赋值
    node.isLeaf = true;
    node.red = r;
    node.green = g;
    node.blue = b;
    node.pixelCount = count;
    leafNum++;
}

function buidOctree(imageData, maxColors) {
    var total = imageData.length / 4;
    for (var i = 0; i < total; i++) {
        // 添加颜色
        addColor(root, {
            r: imageData[i * 4],
            g: imageData[i * 4 + 1],
            b: imageData[i * 4 + 2]
        }, 0);

        // 合并叶子节点
        while (leafNum > maxColors) reduceTree();
    }
}

function colorsStats(node, object) {
    if (node.isLeaf) {
        var r = parseInt(node.red / node.pixelCount);
        var g = parseInt(node.green / node.pixelCount);
        var b = parseInt(node.blue / node.pixelCount);

        var color = r + ',' + g + ',' + b;
        if (object[color]) object[color] += node.pixelCount;
        else object[color] = node.pixelCount;
        return;
    }

    for (var i = 0; i < 8; i++) {
        if (null !== node.children[i]) {
            colorsStats(node.children[i], object);
        }
    }
}

export const themeColor = async function (blob) {
    let img = await createImageBitmap(blob);
    var canvas = new OffscreenCanvas(img.width, img.height),
        ctx = canvas.getContext('2d'),
        width = 0,
        height = 0,
        imageData = null,
        length = 0,
        blockSize = 1;

    width = img.width;
    height = img.height;

    ctx.drawImage(img, 0, 0, width, height);

    imageData = ctx.getImageData(0, 0, width, height).data;

    root = new OctreeNode();
    colorMap = {};
    reducible = {};
    leafNum = 0;

    buidOctree(imageData, 8)

    colorsStats(root, colorMap)

    var arr = [];
    for (var key in colorMap) {
        arr.push(key);
    }
    arr.sort(function (a, b) {
        return colorMap[a] - colorMap[b];
    })
    arr.forEach(function (item, index) {
        arr[index] = item.split(',')
    })
    return arr;
}