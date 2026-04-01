import type { RouterData } from "../types.js";
import { get } from "../utils/getData.js";
import { getTime } from "../utils/getTime.js";

export const handleRoute = async (_: undefined, noCache: boolean) => {
  const listData = await getList(noCache);
  const routeData: RouterData = {
    name: "douyin",
    title: "抖音",
    type: "热榜",
    description: "实时上升热点",
    link: "https://www.douyin.com",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

interface DyCookieResponse {
  headers: {
    "set-cookie": string[];
  };
}

// 获取抖音临时 Cookis
const getDyCookies = async () => {
  try {
    const cookisUrl = "https://www.douyin.com/passport/general/login_guiding_strategy/?aid=6383";
    const { data } = await get<DyCookieResponse>({ url: cookisUrl, originaInfo: true });
    const cookies = data.headers["set-cookie"] || [];
    const matchedCookie = cookies.find((cookie) => cookie.includes("passport_csrf_token="));
    const matchResult = matchedCookie?.match(/passport_csrf_token=([^;]+)/);
    return matchResult?.[1];
  } catch {
    return undefined;
  }
};

interface DouyinWordItem {
  sentence_id: string;
  word: string;
  event_time: string;
  hot_value: number;
}

interface DouyinResponse {
  word_list?: DouyinWordItem[];
  data?: {
    word_list?: DouyinWordItem[];
  };
}

const getList = async (noCache: boolean) => {
  const url = "https://aweme.snssdk.com/aweme/v1/hot/search/list/?device_platform=android&version_name=13.2.0&version_code=130200&aid=1128";
  const cookie = await getDyCookies();
  const result = await get<DouyinResponse>({
    url,
    noCache,
    headers: {
      "User-Agent": "okhttp3",
      ...(cookie
        ? {
            Cookie: `passport_csrf_token=${cookie}`,
          }
        : {}),
    },
  });
  const list = result.data.word_list || result.data.data?.word_list || [];
  return {
    ...result,
    data: list.map((v) => ({
      id: v.sentence_id,
      title: v.word,
      timestamp: getTime(v.event_time),
      hot: v.hot_value,
      url: `https://www.douyin.com/search/${encodeURIComponent(v.word)}`,
      mobileUrl: `https://www.douyin.com/search/${encodeURIComponent(v.word)}`,
    })),
  };
};
