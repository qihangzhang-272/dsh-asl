# 来源与维护

ASL 上游： https://github.com/qihangzhang-272/asl-harness

固定提交：`da26226a2ab18fd8fa9d38f786241517250beb58`（Git submodule upstream）。

共享编辑器和插件客户端仅在上游维护；这里的 host.js、domain.cjs、cordis.patch.yml 和 skills/ 与该提交逐字一致。build.mjs 从 upstream/plugins/dsh-asl-workspace/client/index.jsx 构建；仅调整入口和依赖解析目录。dist/client.js 是可安装的预构建产物，不需要用户执行构建脚本。

升级时先在上游完成测试并提交，再更新子模块及上述投影文件，运行 npm ci --ignore-scripts --legacy-peer-deps、npm run build 和测试。不要在此另改一份共享编辑器。
