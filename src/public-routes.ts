export interface PublicRoute {
  name: string;
  title: string;
  type: string;
  description: string;
}

export const publicRoutes: PublicRoute[] = [
  { name: "baidu", title: "百度", type: "热搜榜", description: "实时搜索热点与社会关注话题" },
  { name: "bilibili", title: "哔哩哔哩", type: "热门榜", description: "站内热视频与讨论内容" },
  { name: "douyin", title: "抖音", type: "热点榜", description: "短视频平台实时上升热点" },
  { name: "ithome", title: "IT之家", type: "热榜", description: "科技资讯与数码行业热门内容" },
  { name: "netease-news", title: "网易新闻", type: "热点榜", description: "新闻资讯热点与时事关注" },
  { name: "qq-news", title: "腾讯新闻", type: "热点榜", description: "新闻热点与全网事件关注" },
  { name: "sina", title: "新浪网", type: "热榜", description: "门户站点综合热点榜单" },
  { name: "sina-news", title: "新浪新闻", type: "热点榜", description: "新闻类热门内容榜单" },
  { name: "thepaper", title: "澎湃新闻", type: "热榜", description: "深度新闻与热点报道" },
  { name: "tieba", title: "百度贴吧", type: "热议榜", description: "社区讨论热帖与热门吧话题" },
  { name: "toutiao", title: "今日头条", type: "热榜", description: "资讯推荐与全网热点聚合" },
  { name: "weatheralarm", title: "中央气象台", type: "预警榜", description: "全国天气预警与突发气象提醒" },
  { name: "weibo", title: "微博", type: "热搜榜", description: "全网传播最快的实时热点" },
  { name: "weread", title: "微信读书", type: "飙升榜", description: "近期升温最快的阅读内容" },
  { name: "zhihu", title: "知乎", type: "热榜", description: "高讨论度问答与社会议题" },
];

export const publicRouteNames = publicRoutes.map((route) => route.name);
