import type { FooterConfig } from "../types/config";

// 页脚配置
export const footerConfig: FooterConfig = {
	enable: true, // 是否启用Footer HTML注入功能
	customHtml: `
<div style="text-align:center; font-size: 0.95em; color: #888; margin-top: 1em;">
	<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">
		豫ICP备2025149385号
	</a>
</div>
<div style="text-align:center; font-size: 0.95em; color: #888; margin-top: 0.5em;">
	<a href="https://i.stardots.io/locxl/StarDots_2026-01-15T11_33_08.3760Z_0756.png" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline; display:inline-flex; align-items:center; gap:0.5em;">
		<img src="https://free.picui.cn/free/2025/10/23/68f9e9fbc08ae.png" alt="公安备案图标" style="height:1em; width:auto; display:inline-block; vertical-align:middle;">
		鄂公网安备42011102005849号
	</a>
</div>
`, // HTML格式的自定义页脚信息，例如备案号等，默认留空
	// 也可以直接编辑 FooterConfig.html 文件来添加备案号等自定义内容
	// 注意：若 customHtml 不为空，则使用 customHtml 中的内容；若 customHtml 留空，则使用 FooterConfig.html 文件中的内容
	// FooterConfig.html 可能会在未来的某个版本弃用
};
