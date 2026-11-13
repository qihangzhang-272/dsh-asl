# v0.3.14

ASL Harness 的 DeepSeek Harness 原生工作区首次独立分发。

- Mode 用途匹配、可编辑 Mermaid 技能画板、完整文件树与 Markdown 编辑。
- 原生 DeepSeek 会话与共享 `asl_workspace` 保存契约，检查上下文修订号、原文指纹和草稿状态。
- Stitch 生成的浅色视觉、字体比例，以及缩放合成层模糊修复。
- 固定 ASL 上游提交；预构建客户端可直接安装，无需安装脚本。

需要已有 ASL 核心与 Environment；完整配置步骤见 README。包名 `dsh-asl-workspace`。

验证：ASL 上游 39 项组件检查和 10 项插件检查通过；独立分发检出 47 项单元检查及含正式核心的 48 项检查通过。独立分发不运行 Electron 桌面宿主专属的子进程断连检查，上游已单独通过。Windows DSH 用户已确认视觉；macOS／Linux 原生宿主未实测。

独立构建继承上游 lodash-es 4.18.1 固定规则。npm audit 当前无中／高／严重项，有 Mermaid/KaTeX 链的 2 个低风险报告；没有为发布而自动升级 Mermaid 大范围依赖。生产运行权限仍由 DSH 与用户配置管理。
