import type { FC } from "hono/jsx";
import { css, Style } from "hono/css";

const Layout: FC = (props) => {
  const globalClass = css`
    :-hono-global {
      * {
        margin: 0;
        padding: 0;
        user-select: none;
        box-sizing: border-box;
        -webkit-user-drag: none;
      }
      :root {
        --text-color: #000;
        --text-color-gray: #cbcbcb;
        --text-color-hover: #fff;
        --icon-color: #444;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --text-color: #fff;
          --text-color-gray: #cbcbcb;
          --text-color-hover: #3c3c3c;
          --icon-color: #cbcbcb;
        }
      }
      a {
        text-decoration: none;
        color: var(--text-color);
      }
      body {
        width: 100vw;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        color: var(--text-color);
        background-color: var(--text-color-hover);
        font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei";
        transition:
          color 0.3s,
          background-color 0.3s;
      }
      main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        margin: 20px;
        width: min(1120px, calc(100vw - 32px));
        min-height: calc(100vh - 120px);
      }
      .page-shell {
        justify-content: flex-start;
        gap: 24px;
      }
      .page-head {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        padding: 32px;
        border: 1px solid rgba(127, 127, 127, 0.18);
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(127, 127, 127, 0.08), rgba(127, 127, 127, 0.02));
      }
      .page-head-left {
        align-items: flex-start;
      }
      .page-head h1 {
        font-size: 40px;
        line-height: 1.15;
      }
      .page-head p {
        font-size: 16px;
        line-height: 1.7;
        opacity: 0.82;
      }
      .eyebrow {
        font-size: 12px;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        opacity: 0.6;
      }
      .back-link {
        opacity: 0.72;
      }
      .page-meta,
      .page-actions,
      .leaderboard-meta {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      .page-meta span,
      .leaderboard-meta span {
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(127, 127, 127, 0.12);
        font-size: 13px;
      }
      .page-action {
        padding: 10px 14px;
        border-radius: 999px;
        border: 1px solid rgba(127, 127, 127, 0.22);
      }
      .route-grid,
      .leaderboard-list {
        width: 100%;
        display: grid;
        gap: 16px;
      }
      .route-grid {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }
      .home-route-grid {
        margin-top: 8px;
      }
      .route-card,
      .leaderboard-item {
        width: 100%;
        border-radius: 22px;
        border: 1px solid rgba(127, 127, 127, 0.16);
        background: rgba(127, 127, 127, 0.05);
        transition:
          transform 0.2s,
          border-color 0.2s,
          background-color 0.2s;
      }
      .route-card {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 22px;
      }
      .route-card:hover,
      .leaderboard-item:hover {
        transform: translateY(-2px);
        border-color: rgba(127, 127, 127, 0.32);
        background: rgba(127, 127, 127, 0.08);
      }
      .route-name {
        font-size: 24px;
        font-weight: 700;
      }
      .route-type {
        font-size: 13px;
        opacity: 0.65;
      }
      .route-card p,
      .leaderboard-main p {
        line-height: 1.7;
        opacity: 0.82;
      }
      .route-card code {
        font-size: 13px;
        opacity: 0.72;
      }
      .docs-list,
      .docs-table {
        width: 100%;
        display: grid;
        gap: 12px;
      }
      .docs-code-grid {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 16px;
      }
      .docs-code-card {
        display: grid;
        gap: 10px;
      }
      .docs-code-head {
        display: grid;
        gap: 4px;
      }
      .docs-code-head span {
        font-size: 13px;
        opacity: 0.66;
      }
      .docs-item,
      .docs-row {
        display: grid;
        gap: 6px;
        padding: 14px 16px;
        border-radius: 16px;
        background: rgba(127, 127, 127, 0.06);
      }
      .docs-item code,
      .docs-row code,
      .code-block {
        user-select: text;
      }
      .code-block {
        width: 100%;
        overflow: auto;
        padding: 18px;
        border-radius: 18px;
        background: rgba(127, 127, 127, 0.08);
        line-height: 1.6;
        font-size: 13px;
      }
      .leaderboard-item {
        display: grid;
        grid-template-columns: 56px 1fr;
        gap: 18px;
        padding: 20px;
      }
      .health-item {
        display: grid;
        gap: 12px;
        padding: 20px;
        border-radius: 22px;
        border: 1px solid rgba(127, 127, 127, 0.16);
        background: rgba(127, 127, 127, 0.05);
      }
      .health-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }
      .health-badge {
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 12px;
        text-transform: uppercase;
        background: rgba(127, 127, 127, 0.12);
      }
      .health-badge.ok {
        background: rgba(46, 204, 113, 0.18);
      }
      .health-badge.error {
        background: rgba(231, 76, 60, 0.18);
      }
      .health-badge.idle {
        background: rgba(241, 196, 15, 0.18);
      }
      .leaderboard-rank {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        border-radius: 18px;
        font-size: 24px;
        font-weight: 700;
        background: rgba(127, 127, 127, 0.12);
      }
      .leaderboard-main {
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 0;
      }
      .leaderboard-main h2 {
        font-size: 22px;
        line-height: 1.4;
      }
      .leaderboard-nav {
        width: 100%;
        display: flex;
        gap: 12px;
        overflow-x: auto;
        padding-bottom: 8px;
      }
      .leaderboard-tab {
        min-width: 132px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 12px 14px;
        border-radius: 18px;
        border: 1px solid rgba(127, 127, 127, 0.16);
        background: rgba(127, 127, 127, 0.05);
        transition:
          border-color 0.2s,
          background-color 0.2s,
          transform 0.2s;
      }
      .leaderboard-tab:hover {
        transform: translateY(-1px);
        border-color: rgba(127, 127, 127, 0.32);
      }
      .leaderboard-tab span {
        font-size: 16px;
        font-weight: 700;
      }
      .leaderboard-tab small {
        font-size: 12px;
        opacity: 0.66;
      }
      .leaderboard-tab.active {
        background: rgba(127, 127, 127, 0.12);
        border-color: rgba(127, 127, 127, 0.42);
      }
      .img {
        width: 120px;
        height: 120px;
        margin-bottom: 20px;
      }
      .img img,
      .img svg {
        width: 100%;
        height: 100%;
      }
      .title {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 40px;
      }
      .title .title-text {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 12px;
        text-align: center;
      }
      .title .title-tip {
        font-size: 20px;
        opacity: 0.8;
      }
      .title .content {
        margin-top: 30px;
        display: flex;
        padding: 20px;
        border-radius: 12px;
        border: 1px dashed var(--text-color);
        user-select: text;
      }
      .control {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .control button {
        display: flex;
        flex-direction: row;
        align-items: center;
        color: var(--text-color);
        border: var(--text-color) solid;
        background-color: var(--text-color-hover);
        border-radius: 8px;
        padding: 8px 12px;
        margin: 0 8px;
        transition:
          color 0.3s,
          background-color 0.3s;
        cursor: pointer;
      }
      .control button .btn-icon {
        width: 22px;
        height: 22px;
        margin-right: 8px;
      }
      .control button .btn-text {
        font-size: 14px;
      }
      .control button:hover {
        border: var(--text-color) solid;
        background: var(--text-color);
        color: var(--text-color-hover);
      }
      .control button i {
        margin-right: 6px;
      }
      footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        line-height: 30px;
        padding: 20px;
      }
      .social {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 8px;
      }
      .social .link {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0 4px;
      }
      .social .link::after {
        content: "";
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: var(--text-color);
        opacity: 0.4;
        margin-left: 8px;
      }
      .social .link:last-child::after {
        display: none;
      }
      .social .link svg {
        width: 22px;
        height: 22px;
      }
      footer .power,
      footer .icp {
        font-size: 14px;
      }
      footer a {
        color: var(--text-color-gray);
        transition: color 0.3s;
      }
      footer a:hover {
        color: var(--text-color);
      }
      @media (max-width: 720px) {
        main {
          width: min(100vw, calc(100vw - 16px));
          margin: 8px;
          padding: 12px;
        }
        .page-head {
          padding: 20px;
        }
        .page-head h1 {
          font-size: 30px;
        }
        .leaderboard-item {
          grid-template-columns: 1fr;
        }
        .leaderboard-tab {
          min-width: 116px;
        }
        .leaderboard-rank {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          font-size: 20px;
        }
        .control {
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }
      }
    }
  `;
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta charset="utf-8" />
        <title>{props.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="今日热榜 API，一个聚合热门数据的 API 接口" />
        <Style>{globalClass}</Style>
      </head>
      <body>
        {props.children}
        <footer>
          <div class="social">
            <a href="https://github.com/imsyy/DailyHotApi" className="link" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                />
              </svg>
            </a>
            <a href="https://www.imsyy.top" className="link" target="_blank">
              <svg
                className="btn-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1"
                />
              </svg>
            </a>
            <a href="mailto:one@imsyy.top" className="link">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"
                />
              </svg>
            </a>
          </div>
          <div class="power">
            Copyright&nbsp;©&nbsp;
            <a href="https://www.imsyy.top/" target="_blank">
              無名
            </a>
            &nbsp;|&nbsp;Power by&nbsp;
            <a href="https://github.com/honojs/hono/" target="_blank">
              Hono
            </a>
          </div>
          <div class="icp">
            <a href="https://beian.miit.gov.cn/" target="_blank">
              豫ICP备2022018134号-1
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default Layout;
