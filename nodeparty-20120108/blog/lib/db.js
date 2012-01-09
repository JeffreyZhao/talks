var categories = {
    "practice": "实践优化",
    "language": "语言编程",
    "extension": "项目扩展",
    "front-end": "前端表现",
    "news": "新闻信息",
    "reading": "阅读相关"
};

var posts = {
    1: {
        title: "求助：一份用于学习单元测试的案例需求",
        abstract: "一直熟知单元测试的重要性，也算是了看了几本这方面的经典书籍，但是真开始上手的时候总会遇到各种各样的坎。例如，为什么总感觉自己的单元测试之间有较多的重合，为什么每个单元测试都要准备那么多依赖？有的说法是，这意味着代码设计不够好，单元测试也有问题，或者说没有使用TDD的缘故，等等。但是，现实开发过程中在这方面也颇感无力。前段时间在微博上咨询了几个问题，感觉收获不大，这次干脆整理一份需求，仔细认真向高手学习一下代码设计，单元测试，甚至测试驱动开发的方式吧。我也会准备一些礼物来感谢一部分同学的帮助。",
        commentCount: 5,
        tags: ["单元测试", "测试驱动开发"],
        categoryIds: ["practice"],
        visits: 1234
    },
    2: {
        title: "Node.js中相同模块是否会被加载多次？",
        abstract: "JavaScript的包管理一直是个软肋，但既然它流行了，既然人们想要用它做大事了，就要开始为它制定一些模块的约定。Node.js使用了CommonJS模块机制，最近在InfoQ上也有一篇文章讨论了这方面的问题。这篇文章提到Node.js在载入模块时，如果之前该模块已经加载过则不会有重复开销，因为模块加载有缓存机制。这篇文章是我初审的，当时也正好在思考Jscex在Node.js使用时的模块化问题，但研究了它的规则之后，我发现在某些情况下还是可能加载多次。现在我们便来分析这个问题。",
        commentCount: 21,
        tags: ["Jscex", "Node.js", "模块"],
        categoryIds: ["language", "extension"],
        visits: 22393
    },
    3: {
        title: "受禁锢的异步编程思维",
        abstract: "最近一直在努力推广，补充了很多中文文档和示例，因此博客上都已经有两篇文章有了“上”而没有“下”，即使最复杂的图示也已经绘制完毕。在推广Jscex的过程中，我发现有个比较明显的问题是，许多使用JavaScript的程序员已经习惯旧有的操作方式，甚至推崇一些据说很漂亮“模式”。但其实跟许多GoF模式是在修补OO语言的不足类似，很多异步模式都只是因为JavaScript语言特性不足而设计出来的“权宜之计”。我们在传统JavaScript编程环境下并没有其他选择，单纯地认为这是“美”，说实话只不过是一种安慰罢了。",
        commentCount: 62,
        tags: ["Jscex", "异步"],
        categoryIds: ["language", "front-end", "extension"],
        visits: 32223
    },
    4: {
        title: "Jscex正式发布至npm",
        abstract: "之前一直不敢将Jscex发布至npm上，因为有些问题还没有完全拿定主意，例如“取消”任务的模型。一个异步任务一定是需要取消功能，尽管这个模型不一定需要直接定义在Jscex里。但是我还是为Jscex提供了一个统一的标准化的取消模型，一是易于使用，二是提供模型这个之后，API在设计时可以有更多表现力（例如，现在的task的status可能是canceled了）。上周末我实现这个模型（其实也就十几二十行代码），昨天我又修改了模块的加载方式，使其支持CommonJS规范。在发布到npm之后，现在可以说Jscex已经正式对外公开了！",
        commentCount: 22,
        tags: ["Jscex", "Node.js", "npm", "jscex-jit", "jscex-async"],
        categoryIds: ["extension", "news"],
        visits: 23848
    },
    5: {
        title: "尾递归对时间与空间复杂度的影响（上）",
        abstract: "以前我也在博客上简单谈过“尾递归”及其优化方式方面的话题。前几天有同学在写邮件向我提问，说是否所有的递归算法都能改写为尾递归，改写成尾递归之后，是否在时间和空间复杂度方面都能有所提高？他以斐波那契数列为例，似乎的确是这样的情况。我当时的回答有些简单，后来细想之后似乎感觉有点问题，而在仔细操作之后发现事情并没有理论上那么简单，因此还是计划写篇文章来讨论下这方面的问题。",
        commentCount: 36,
        tags: ["尾递归"],
        categoryIds: ["language"],
        visits: 32123
    },
    6: {
        title: "挖坟鞭尸：当年Sun公司的白皮书《About Microsoft “Delegates”》",
        abstract: "这是一桩当年的Sun公司与Java的旧事，还要追溯到C#还没出现，微软还在搞J++的时代。这篇著名的白皮书便是《About Microsoft “Delegates”》，其中列出了Sun眼中的Delegate的多个缺点。最后，在白皮书里信誓旦旦地写到：“Bound Method Reference并不是语言发展的正确道路”。我的感觉是：不谈Java语言设计者的水平如何，至少这篇白皮书的作者，在语言设计的能力或品味上几乎落后了Anders Hejlsberg十年。从我之前翻译过的一篇文章来看，Anders一直扮演着指引语言发展方向的作用，这也是为什么C#在这十年的发展能比Java要健康得多的主要原因之一。",
        commentCount: 109,
        tags: ["Sun", "Java", "Delegate"],
        categoryIds: ["language"],
        visit: 12345
    }
}

exports.getCategory = function (id, callback) {
    setTimeout(function () {
        callback(null, categories[id]);
    }, 10);
}

exports.getPost = function (id, callback) {
    setTimeout(function () {
        callback(null, posts[id]);
    }, 20);
}

exports.getPostIDs = function (callback) {
    setTimeout(function () {
        callback(null, Object.keys(posts));
    }, 20);
}