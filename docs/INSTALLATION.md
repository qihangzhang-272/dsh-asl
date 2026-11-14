# 安装与排错

第一次用，请从 [README 的开始使用](../README.md#开始使用) 按顺序操作。本页解释容易弄错的路径、命令和配置。以下命令面向 Windows PowerShell；当前实测组合为 DSH 0.2.1-rc.5、插件 0.3.16（新增界面在官方 Web 隔离配置中验证）、ASL App 0.5.19／核心 0.4.12。

## 从商店或 GitHub 直装

商店会使用仓库地址安装，也可以在已有 DSH profile 中手动执行：

```powershell
dsh plugin --profile desktop add https://github.com/qihangzhang-272/dsh-asl --config.auto-install-peers=false --ignore-scripts
```

直装使用仓库内预构建的客户端，不要求安装脚本或 `upstream` 子模块。0.3.15 起，`sourceRoot` 和 `environment` 不再是插件挂载的必填项；未配置时打开工作区会显示配置指引，`asl_workspace` 工具返回 `ASL_SETUP_REQUIRED`，不会阻断 DSH 启动。

实际使用仍要按 README 准备完整 ASL 仓库、核心和 Environment，填写当前 profile 的 `cordis.patch.yml` 后重启。GitHub 直装不会递归检出子模块；不要把 DSH 插件安装目录当成 `sourceRoot`。若已填路径却缺少桥接文件，会返回 `ASL_SETUP_INVALID` 和具体原因；按指引修正路径即可，无需关闭所有第三方插件。

## 下载哪几个东西

| 下载项 | 用途 | 要注意什么 |
| --- | --- | --- |
| [dsh-asl 源码](https://github.com/qihangzhang-272/dsh-asl) | 提供插件桥接所需的 ASL 源码目录 | 用 `git clone --recurse-submodules`，确认 `upstream/desktop/bridge.cjs` 存在 |
| [Windows ASL App ZIP](https://github.com/qihangzhang-272/asl-harness/releases/download/app-v0.5.19/ASL-Workspace-0.5.19-Windows-x64.zip) | 提供免装 Python 的核心及 Mermaid 校验运行时 | 完整解压，保留 `ASL Workspace` 整个文件夹 |
| [插件 tgz 与 SHA256SUMS](https://github.com/qihangzhang-272/dsh-asl/releases/tag/v0.3.16) | 安装到 DSH profile | 使用 `dsh plugin` 安装，不需要手动解压到插件目录 |
| 自己的 Environment，或仓库样例的副本 | 保存技能、Mode 和实际修改 | 配置库的根目录，不要指到其中某个 Skill |

ASL App ZIP 不是插件；插件 tgz 也不包含 ASL 核心。你只需解压 App 获取完整运行时，不必先在 ASL App 中登录、配置模型或运行它。模型在 DSH 里配置。

GitHub 自动生成的 `Source code` ZIP 不包含 `upstream` 子模块。若要不用子模块，需另行完整检出 [固定 ASL 提交](../UPSTREAM.md)，再将 `sourceRoot` 指向该目录；初次使用建议按 README 的 clone 命令走。

## 找不到 dsh 命令

先试 `dsh --version`。官方桌面版若未把命令加入 PATH，可以用其安装目录中的 CLI。把下面第一行改成你机器上的实际安装位置：

```powershell
$dsh = 'C:/path/to/DeepSeek Harness/resources/runtime/cli/bin/dsh.cmd'
& $dsh --version
& $dsh plugin --profile desktop add https://github.com/qihangzhang-272/dsh-asl/releases/download/v0.3.16/dsh-asl-workspace-0.3.16.tgz --config.auto-install-peers=false --ignore-scripts
```

这是官方 DSH 0.2.1-rc.5 桌面版随附的路径结构；其他发行版以各自的 CLI 入口为准。不要为了得到 `dsh` 命令，再安装另一套不同版本的宿主。

`--ignore-scripts` 表示使用已构建的客户端，不执行安装脚本。`--config.auto-install-peers=false` 保留宿主提供的核心依赖，避免为插件额外安装另一份 DSH 基础包。缺少 peer 的提示与插件无法挂载需要分别判断；请先确认宿主版本，别直接批量升级宿主包。

## 配置文件在哪

官方桌面版的 profile 名称是 `desktop`。先打开应用一次，让它初始化，再完全退出后安装插件。

默认配置路径：

```text
%USERPROFILE%/.dsh/profiles/desktop/cordis.patch.yml
```

如果配置了 `DSH_HOME`，默认的 `.dsh` 部分替换成该目录。可以在 PowerShell 查看你当前终端的设置：

```powershell
$env:DSH_HOME
```

终端与桌面应用应使用同一个 DSH_HOME。自定义 profile 用户需把安装命令中的 `desktop` 换成目标 profile，并确认其中具备原生 Web UI 和会话服务。当前首次安装路径只对官方 Windows 桌面版做过验收。

`cordis.patch.yml` 是 YAML 列表。保留其他配置，把这项合并到同一层级；已有 `asl-workspace` 时更新，不要重复追加，也不要覆盖整个文件：

```yaml
- id: asl-workspace
  config:
    sourceRoot: 'C:/Work/dsh-asl/upstream'
    environment: 'C:/Work/dsh-asl/my-environment'
    coreExecutable: 'C:/Tools/ASL-Workspace-0.5.19/ASL Workspace/resources/core/asl-harness.exe'
```

路径用单引号包住，用 `/` 分隔目录。不要在 YAML 里填 `%USERPROFILE%`、`$repo` 或 `~` 期待自动展开；填完整绝对路径。`coreExecutable` 指向核心文件，而 `sourceRoot`、`environment` 指向目录。

## 打开 DSH 前，先检查路径

下面示例假设你当前位于 `dsh-asl` 仓库根目录，且使用 `my-environment` 样例。核心路径请换成自己的：

```powershell
$core = 'C:/Tools/ASL-Workspace-0.5.19/ASL Workspace/resources/core/asl-harness.exe'
Test-Path -LiteralPath ./upstream/desktop/bridge.cjs
Test-Path -LiteralPath ./my-environment/modes/creator-studio/mode.yaml
Test-Path -LiteralPath $core
& $core environment.catalog --workspace (Resolve-Path -LiteralPath ./my-environment).Path
```

前三项应返回 `True`；最后一条应返回 `ok: true` 的 JSON，样例应有 1 个 Mode、2 个 Skill。这一步证明核心能读取内容；它还没有验证 DSH 原生会话或 Mermaid 保存，后面仍要实际试一次。

配置完成后，**从桌面应用重新打开 DSH**。官方桌面版保留了 `desktop` profile 的启动管理，不能用 `dsh --profile desktop` 替代桌面启动；它会提示该 profile 由 Electron 应用管理。

## 第一次打开后，怎样确认装好了

按这几个实际结果判断：

1. 左侧出现「ASL 工作区」，能进入 `Creator Studio`。样例会投影出「产品分析示例」和「通用能力」。
2. 单击产品分析节点，右侧显示文件树与 Markdown；点「编辑 Markdown」直接修改、保存。可收起或放大预览；点「打开技能 ↗」仍可进入完整文件页。
3. 在样例文件中改一句话，保存、重新读取，文字保留。试一次图中文字修改，并确认保存成功。
4. 在 DSH 已配置可用模型的前提下，让 DeepSeek 用 `asl_workspace` 读取当前文件。随后做一次小修改，确认工具成功回执和界面内容一致。

若你没有配置模型，也可以先验证手动阅读与编辑；原生会话回复需要可用模型与相应工具权限。请在独立样例里试，不要用重要材料做首次保存测试。

## 常见问题

| 现象 | 先检查什么 | 接下来怎么做 |
| --- | --- | --- |
| 提示先初始化桌面 profile | 是否从未打开过 DSH | 打开 DSH 一次，完全退出，再安装；不要手造桌面 profile |
| 插件安装时目录占用／无法替换 | DSH 是否还在运行 | 完全退出后重新安装，成功后再打开；失败的替换可能需要重新安装来补齐文件 |
| 找不到 `desktop/bridge.cjs` | `sourceRoot` 与子模块 | 补执行 `git submodule update --init --recursive`；路径指向 `upstream`，不是插件根目录 |
| 找不到核心／核心未返回有效结果 | `coreExecutable` | 核对核心路径和完整应用目录，先执行上面的 `environment.catalog` |
| 没有 Mode／文件夹不是技能库 | `environment` | 指向有 `skills/`、`modes/` 的环境根目录；首次可用样例副本 |
| 看不到 ASL 入口 | 安装用的 profile 与 DSH_HOME | 确认装在桌面应用实际使用的 profile，完整重启以加载客户端 |
| 输入框未加载／会话服务不可用 | 宿主版本、原生会话与模型 | 确认使用具备会话服务的官方桌面版；重启后重试。仍不行请附版本和错误反馈，不要加第二个 ChatBox 代替原生会话 |
| 提示草稿未保存 | 当前画板或文件是否仍在编辑 | 先保存或放弃草稿，再让 DeepSeek 读取最新上下文并修改 |
| 原文指纹或上下文冲突 | 是否刚切换文件、选区或被其他程序修改 | 重新读取、合并当前内容后保存；不要强制覆盖旧版本 |
| 图示校验程序无法运行 | ASL App 是否完整、所在目录是否可运行 | 使用完整正式便携包，见下节；不能关闭渲染校验来“解决” |
| 搜索不到技能／下载失败 | 网络与来源仓库 | 本地阅读不依赖搜索；发现与下载需要网络，部分来源可能要求访问凭据 |

### 能读文件，但 Mermaid 保存报 0x80000003

这次首次安装演练中，把完整 ASL App 解压在开发工作区下，读取正常，图示校验进程却退出 `0x80000003`。同一公开 ZIP 校验一致，重新完整解压到独立的本地目录后，图示保存、回读和恢复均通过。具体目录或系统权限原因尚未确认。

遇到同样情况，可先把**整个应用文件夹**放到自己有正常运行权限的独立目录，再更新 `coreExecutable`。不要只拷贝核心 EXE，也不要关闭系统防护或绕过图示校验。仍有问题时保留草稿，并反馈报错中的退出码。

## 更新与移除

更新前保存当前草稿，完全退出 DSH，再安装目标版本的 Release tgz。三个本地路径沿用现有配置；正常更新不会替换你的 Environment。仓库源码与已安装 tgz 是两个位置，`git pull` 不会自动更新 DSH 里的插件。

移除时同样先退出 DSH：

```powershell
dsh plugin --profile desktop remove dsh-asl-workspace
```

随后从 `cordis.patch.yml` 移除你添加的 `asl-workspace` 配置项，保留其他条目，再打开桌面应用。技能库仍在你配置的环境目录，移除插件不需要删除它。

## 开发者使用 Python 核心

普通使用者建议使用上述便携核心。开发者也可在 ASL 检出目录安装 Python 3.11+ 的核心依赖与桌面渲染运行时，再在配置中用 `python` 的绝对路径替代 `coreExecutable`。两者同时提供时，`coreExecutable` 优先。

Python 包安装成功只说明核心依赖就绪；含 Mermaid 的保存还需要能实际运行的 Electron 校验器。参见 [ASL 源码运行说明](https://github.com/qihangzhang-272/asl-harness#quick-start)。不要把 `npm ci --ignore-scripts` 用于准备 Electron 运行时——那会跳过它的下载。插件自身的预构建安装才可以不执行脚本。
