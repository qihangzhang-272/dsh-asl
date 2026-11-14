# v0.3.15

修复 dsh-market 审核指出的首次安装问题。

- `sourceRoot`、`environment` 改为可选，ASL 领域服务延迟到实际使用时初始化。商店／GitHub 直装缺少本地路径或桥接文件时，插件仍可挂载，界面和工具返回明确的配置指引。
- 补充 `engines.dsh: >=0.2.1-rc.5 <0.3.0-0`。包名保持 `dsh-asl-workspace`，市场目录 ID 同步对齐。
- 更新中英文安装说明，区分「安装插件」和「配置可用的 ASL 环境」。直装不依赖子模块；实际业务读写仍依赖完整 ASL 仓库、核心和 Environment。

没有改动画板视觉、Mode 架构或保存保护。原有路径配置继续使用。Windows 官方 DSH 0.2.1-rc.5 为实测宿主，macOS／Linux 原生宿主未实测。
